<?php

namespace App\Http\Controllers;

use App\Models\HistoryEvent;
use App\Models\HistoryPhoto;
use App\Models\PageBanner;
use App\Models\Post;
use App\Models\StaffAssignment;
use App\Models\TrainingSession;
use App\Services\Hrs\HrsService;
use App\Services\Hrs\HrsUnavailableException;
use App\Support\Croatian;
use App\Support\HistorySeed;
use Illuminate\View\View;

class PageController extends Controller
{
    /** Banner, intro text and layout of each team page. */
    private const TEAM_PAGES = [
        'senior' => [
            'banner' => 'first-team',
            'eyebrow' => 'RK Biograd · Seniori',
            'subtitle' => '2. HRL Jug – svim srcem za Biograd',
        ],
        'u15' => [
            'banner' => 'u15',
            'eyebrow' => 'RK Biograd · Mlađe selekcije',
            'subtitle' => 'Mladost i talent budućnosti',
        ],
        'u13' => [
            'banner' => 'u13',
            'eyebrow' => 'RK Biograd · Mlađe selekcije',
            'subtitle' => 'Prvi koraci prema velikim uspjesima',
        ],
    ];

    public function __construct(private HrsService $hrs) {}

    public function home(): View
    {
        $matches = $this->tryHrs(fn () => HrsService::split($this->hrs->matches('senior')));
        $standings = $this->tryHrs(fn () => $this->hrs->standings('senior'));
        $league = $standings[0] ?? null;
        $ourTeam = collect($league['rows'] ?? [])->firstWhere('is_our_team', true);
        $next = $matches['upcoming'] ?? [];

        $recentForm = collect(array_slice($matches['results'] ?? [], 0, 5))
            ->reverse()
            ->map(HrsService::resultLetter(...))
            ->filter()
            ->join('-');

        return view('pages.home', [
            'banner' => PageBanner::imageFor('home'),
            'posts' => Post::latest('published_at')->take(3)->get(),
            'matches' => $matches,
            'nextMatches' => array_slice($next, 0, 2),
            'lastResult' => $matches['results'][0] ?? null,
            'league' => $league,
            'stats' => [
                'next_match' => isset($next[0])
                    ? Croatian::matchDate($next[0]['starts_at']).' vs '.HrsService::opponent($next[0])
                    : 'Nema utakmica',
                'position' => $ourTeam ? "{$ourTeam['position']}. mjesto" : '-',
                'form' => $recentForm ?: '-',
            ],
        ]);
    }

    public function team(string $team): View
    {
        return view('pages.team', [
            'team' => $team,
            'title' => HrsService::label($team),
            'page' => self::TEAM_PAGES[$team],
            'banner' => PageBanner::imageFor(self::TEAM_PAGES[$team]['banner']),
            'matches' => $this->tryHrs(fn () => HrsService::split($this->hrs->matches($team))),
            'standings' => $this->tryHrs(fn () => $this->hrs->standings($team)),
            'players' => $this->tryHrs(fn () => $this->hrs->players($team)),
            'staff' => StaffAssignment::sorted($team),
            'trainings' => TrainingSession::forTeam($team),
        ]);
    }

    public function news(): View
    {
        return view('pages.news.index', [
            'banner' => PageBanner::imageFor('news'),
            'posts' => Post::latest('published_at')->get(),
        ]);
    }

    public function post(Post $post): View
    {
        return view('pages.news.show', ['post' => $post]);
    }

    public function match(string $id): View
    {
        abort_unless(preg_match('/^\d{1,10}$/', $id), 404);

        $unavailable = false;
        try {
            $detail = $this->hrs->matchDetail((int) $id);
        } catch (HrsUnavailableException) {
            $detail = null;
            $unavailable = true;
        }
        abort_if(! $detail && ! $unavailable, 404);

        return view('pages.match', ['detail' => $detail]);
    }

    public function history(): View
    {
        return view('pages.history', [
            'banner' => PageBanner::imageFor('history'),
            'content' => HistorySeed::ensureSeeded(),
            'events' => HistoryEvent::timeline(),
            'photos' => HistoryPhoto::oldest()->get(),
        ]);
    }

    /** Runs an HRS call; null when the feed is unavailable (the view then says so). */
    private function tryHrs(callable $load): mixed
    {
        try {
            return $load();
        } catch (HrsUnavailableException) {
            return null;
        }
    }
}
