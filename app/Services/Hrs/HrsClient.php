<?php

namespace App\Services\Hrs;

use Illuminate\Http\Client\Pool;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

/**
 * Fetches HRS feed files with a cache. When a file is stale it is fetched again; if that fails
 * the stale copy is kept, so the site stays up while HRS is down. Only an empty cache fails.
 */
class HrsClient
{
    private const TIMEOUT_SECONDS = 15;

    private const COMPETITION_TTL = 5 * 60;

    private const MATCH_LIVE_TTL = 60;

    private const MATCH_FINISHED_TTL = 60 * 60;

    // Stale copies are kept this long as a fallback.
    private const KEEP_SECONDS = 30 * 24 * 60 * 60;

    /** Files already read during this request. */
    private array $memo = [];

    public function competition(int $competitionId): array
    {
        return $this->get("natjecanje{$competitionId}.js", fn () => self::COMPETITION_TTL);
    }

    public function matchFile(int $matchId): array
    {
        return $this->get("utakmice/{$matchId}.js", self::matchTtl(...));
    }

    /**
     * Several match files at once; files that are not cached are fetched in parallel.
     *
     * @param  int[]  $matchIds
     * @return array<int, array> keyed by match id
     */
    public function matchFiles(array $matchIds): array
    {
        $missing = array_values(array_filter($matchIds, fn ($id) => ! $this->fresh("utakmice/{$id}.js")));

        if ($missing) {
            $responses = Http::pool(fn (Pool $pool) => array_map(
                fn ($id) => $pool->as((string) $id)->timeout(self::TIMEOUT_SECONDS)->get($this->url("utakmice/{$id}.js")),
                $missing,
            ));
            foreach ($missing as $id) {
                $response = $responses[(string) $id];
                if ($response instanceof Response && $response->successful()) {
                    try {
                        $this->remember("utakmice/{$id}.js", FeedParser::parse($response->body()), self::matchTtl(...));
                    } catch (HrsUnavailableException) {
                        // Falls back to the single fetch below, which reports the error.
                    }
                }
            }
        }

        $files = [];
        foreach ($matchIds as $id) {
            $files[$id] = $this->matchFile($id);
        }

        return $files;
    }

    private static function matchTtl(array $data): int
    {
        return ($data['ut'][0]['status'] ?? null) === 2 ? self::MATCH_FINISHED_TTL : self::MATCH_LIVE_TTL;
    }

    private function get(string $path, callable $ttlFor): array
    {
        if (isset($this->memo[$path])) {
            return $this->memo[$path];
        }

        $cached = Cache::get($this->key($path));
        if ($cached && time() - $cached['fetched_at'] < $cached['ttl']) {
            return $this->memo[$path] = $cached['data'];
        }

        try {
            $response = Http::timeout(self::TIMEOUT_SECONDS)->get($this->url($path));
            if (! $response->successful()) {
                throw new HrsUnavailableException("{$response->status()} for {$this->url($path)}");
            }

            return $this->remember($path, FeedParser::parse($response->body()), $ttlFor);
        } catch (Throwable $e) {
            $message = $e instanceof HrsUnavailableException ? $e->getMessage() : "HRS feed: {$e->getMessage()}";
            if ($cached) {
                logger()->warning("{$message} – serving cached copy");

                return $this->memo[$path] = $cached['data'];
            }
            logger()->error($message);

            throw $e instanceof HrsUnavailableException ? $e : new HrsUnavailableException($e->getMessage());
        }
    }

    private function remember(string $path, array $data, callable $ttlFor): array
    {
        Cache::put($this->key($path), ['data' => $data, 'fetched_at' => time(), 'ttl' => $ttlFor($data)], self::KEEP_SECONDS);

        return $this->memo[$path] = $data;
    }

    private function fresh(string $path): bool
    {
        if (isset($this->memo[$path])) {
            return true;
        }
        $cached = Cache::get($this->key($path));

        return $cached && time() - $cached['fetched_at'] < $cached['ttl'];
    }

    private function key(string $path): string
    {
        return "hrs:{$path}";
    }

    private function url(string $path): string
    {
        return rtrim(config('hrs.feed_base_url'), '/').'/'.$path;
    }
}
