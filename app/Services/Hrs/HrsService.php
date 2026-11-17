<?php

namespace App\Services\Hrs;

use App\Support\Croatian;

/**
 * Standings, matches, player stats and match details for our teams, live from the HRS data feed
 * (Sportinfocentar). The vendor's field names (Croatian abbreviations) are mapped into plain
 * arrays here, so views never see raw feed fields. Meanings were checked against hrs.hr and by
 * cross-checking event counts with lineup totals.
 */
class HrsService
{
    public const TEAMS = ['senior', 'u15', 'u13'];

    // Our own crest instead of the HRS copy; other clubs use HRS logos.
    private const OUR_LOGO_URL = '/images/rk-biograd-logo-192.png';

    public function __construct(private HrsClient $client) {}

    public static function isTeam(string $team): bool
    {
        return in_array($team, self::TEAMS, true);
    }

    public static function label(string $team): string
    {
        return config("hrs.teams.{$team}.label");
    }

    /** Teams with their competitions (admin dashboard). */
    public function teams(): array
    {
        return array_map(fn ($team) => [
            'key' => $team,
            'label' => self::label($team),
            'season' => config('hrs.season'),
            'competitions' => array_map($this->competitionInfo(...), $this->competitions($team)),
        ], self::TEAMS);
    }

    /** One table per league (cups have none). */
    public function standings(string $team): array
    {
        return array_map(fn ($c) => [
            'competition' => $this->competitionInfo($c),
            'rows' => $this->mapStandings($this->league($c)),
        ], $this->leagues($team));
    }

    /** Our row in the team's (first) league table, or null. */
    public function ourStanding(string $team): ?array
    {
        foreach ($this->standings($team)[0]['rows'] ?? [] as $row) {
            if ($row['is_our_team']) {
                return $row;
            }
        }

        return null;
    }

    /** All our matches of a team in every competition, oldest first. */
    public function matches(string $team): array
    {
        $matches = [];
        foreach ($this->competitions($team) as $c) {
            foreach ($this->league($c)['utakmice'] ?? [] as $u) {
                if ($this->isOurMatch($u)) {
                    $matches[] = $this->mapMatch($u, $c);
                }
            }
        }
        usort($matches, fn ($a, $b) => strcmp($a['starts_at'] ?? '9999', $b['starts_at'] ?? '9999'));

        return $matches;
    }

    /** Matches split into upcoming (incl. live), results (newest first) and postponed. */
    public static function split(array $matches): array
    {
        $by = fn (array $statuses) => array_values(array_filter($matches, fn ($m) => in_array($m['status'], $statuses, true)));

        return [
            'upcoming' => $by(['upcoming', 'live']),
            'results' => array_reverse($by(['finished'])),
            'postponed' => $by(['postponed']),
        ];
    }

    /** "P" win, "N" draw, "I" loss – from our team's point of view. */
    public static function resultLetter(array $match): ?string
    {
        if ($match['status'] !== 'finished' || $match['home_score'] === null || $match['away_score'] === null) {
            return null;
        }
        $ours = $match['is_home'] ? $match['home_score'] : $match['away_score'];
        $theirs = $match['is_home'] ? $match['away_score'] : $match['home_score'];

        return $ours > $theirs ? 'P' : ($ours < $theirs ? 'I' : 'N');
    }

    public static function opponent(array $match): string
    {
        return $match['is_home'] ? $match['away_team'] : $match['home_team'];
    }

    /** Season stats of our players, top scorers first. */
    public function players(string $team): array
    {
        $players = [];
        foreach ($this->leagues($team) as $c) {
            $competition = $this->client->competition($c['competition_id']);
            array_push($players, ...$this->mapPlayers($competition, $this->findLeague($competition, $c['league_id'])));
        }

        return $players;
    }

    /**
     * All team officials of our club from this season's finished match sheets. HRS lists officials
     * (A, B, …) per match but gives no job titles; admins pick from this list in Admin → Stručni stožer.
     */
    public function officials(): array
    {
        $people = [];

        foreach (self::TEAMS as $team) {
            $finished = array_values(array_filter($this->matches($team), fn ($m) => $m['status'] === 'finished'));
            $files = $this->client->matchFiles(array_column($finished, 'id'));

            foreach ($finished as $match) {
                foreach ($this->mapTeamOfficials($files[$match['id']], $match['is_home'] ? 1 : 2) as $o) {
                    $person = $people[$o['person_id']] ?? [...$o, 'teams' => [], 'last_match' => null];
                    $person['teams'][$team] = ($person['teams'][$team] ?? 0) + 1;
                    if ($match['starts_at'] && $match['starts_at'] > ($person['last_match'] ?? '')) {
                        $person['last_match'] = $match['starts_at'];
                    }
                    $people[$o['person_id']] = $person;
                }
            }
        }

        usort($people, fn ($a, $b) => Croatian::compare($a['last_name'], $b['last_name']) ?: Croatian::compare($a['first_name'], $b['first_name']));

        return $people;
    }

    /**
     * Lineups and play-by-play of one match. Only matches of our club in the configured
     * competitions can be requested, so this cannot be used to fetch arbitrary feed files.
     */
    public function matchDetail(int $matchId): ?array
    {
        foreach (self::TEAMS as $team) {
            foreach ($this->matches($team) as $match) {
                if ($match['id'] === $matchId) {
                    $file = $this->client->matchFile($matchId);

                    return [
                        'match' => $match,
                        ...$this->mapLineups($file),
                        'events' => $this->mapEvents($file),
                        'hrs_url' => config('hrs.match_url').$matchId,
                    ];
                }
            }
        }

        return null;
    }

    // --- Feed mapping -------------------------------------------------------------------------

    private function competitions(string $team): array
    {
        return config("hrs.teams.{$team}.competitions");
    }

    private function leagues(string $team): array
    {
        return array_values(array_filter($this->competitions($team), fn ($c) => empty($c['is_cup'])));
    }

    private function competitionInfo(array $c): array
    {
        return [
            'competition_id' => $c['competition_id'],
            'league_id' => $c['league_id'],
            'name' => $c['name'],
            'is_cup' => ! empty($c['is_cup']),
            'hrs_url' => config('hrs.competition_url').$c['competition_id'],
        ];
    }

    private function league(array $c): array
    {
        return $this->findLeague($this->client->competition($c['competition_id']), $c['league_id']);
    }

    private function findLeague(array $competition, int $leagueId): array
    {
        foreach ($competition['lige'] ?? [] as $league) {
            if (($league['broj'] ?? null) === $leagueId) {
                return $league;
            }
        }

        throw new HrsUnavailableException("league {$leagueId} not found in competition ".($competition['broj'] ?? '?'));
    }

    private function isOurMatch(array $u): bool
    {
        $club = config('hrs.club_id');

        return ($u['k1'] ?? null) === $club || ($u['k2'] ?? null) === $club;
    }

    public static function logoUrl(int $clubId): string
    {
        return $clubId === config('hrs.club_id')
            ? self::OUR_LOGO_URL
            : rtrim(config('hrs.feed_base_url'), '/')."/logo/{$clubId}.png";
    }

    private static function photoUrl(mixed $file): ?string
    {
        return self::str($file) !== '' ? rtrim(config('hrs.feed_base_url'), '/').'/foto/'.self::str($file) : null;
    }

    private function mapStandings(array $league): array
    {
        $rows = array_map(fn ($r) => [
            'position' => self::num($r['por'] ?? null),
            'team' => self::str($r['n'] ?? null),
            'club_id' => self::num($r['k'] ?? null),
            'logo_url' => self::logoUrl(self::num($r['k'] ?? null)),
            'played' => self::num($r['utk'] ?? null),
            'won' => self::num($r['pob'] ?? null),
            'draw' => self::num($r['ner'] ?? null),
            'lost' => self::num($r['izg'] ?? null),
            'goals_for' => self::num($r['dat'] ?? null),
            'goals_against' => self::num($r['prim'] ?? null),
            'goal_diff' => self::num($r['raz'] ?? null),
            'points' => self::num($r['bod'] ?? null),
            'is_our_team' => self::num($r['k'] ?? null) === config('hrs.club_id'),
        ], $league['tablica'] ?? []);
        usort($rows, fn ($a, $b) => $a['position'] <=> $b['position']);

        return $rows;
    }

    // st: 0 = not played, 2 = finished, 6 = postponed (no score). Anything else is in progress.
    private static function matchStatus(mixed $st): string
    {
        return match ($st) {
            0 => 'upcoming',
            2 => 'finished',
            6 => 'postponed',
            default => 'live',
        };
    }

    private function mapMatch(array $u, array $c): array
    {
        $status = self::matchStatus($u['st'] ?? null);
        $hasScore = in_array($status, ['finished', 'live'], true);
        $score = fn ($key) => $hasScore ? self::numOrNull($u[$key] ?? null) : null;

        return [
            'id' => self::num($u['broj'] ?? null),
            'competition' => $c['name'],
            'is_cup' => ! empty($c['is_cup']),
            'round' => self::numOrNull($u['kolo'] ?? null),
            // Local Croatian time as published by HRS, e.g. "2026-09-20T19:00:00"
            'starts_at' => self::str($u['pc'] ?? null) ?: null,
            'home_team' => self::str($u['e1'] ?? null),
            'away_team' => self::str($u['e2'] ?? null),
            'home_logo_url' => self::logoUrl(self::num($u['k1'] ?? null)),
            'away_logo_url' => self::logoUrl(self::num($u['k2'] ?? null)),
            'home_score' => $score('r1'),
            'away_score' => $score('r2'),
            'home_half_time' => $score('p11'),
            'away_half_time' => $score('p12'),
            'venue' => self::str($u['mnaziv'] ?? null),
            'city' => self::str($u['mmjesto'] ?? null),
            'status' => $status,
            'is_home' => ($u['k1'] ?? null) === config('hrs.club_id'),
        ];
    }

    // Player rows in `statistika.stat` have `ig` (player id) and `ek`, the teams they played for.
    private function mapPlayers(array $competition, array $league): array
    {
        $teamId = null;
        foreach ($league['tablica'] ?? [] as $row) {
            if (($row['k'] ?? null) === config('hrs.club_id')) {
                $teamId = $row['e'] ?? null;
            }
        }
        if ($teamId === null) {
            return [];
        }

        $players = [];
        foreach ($competition['statistika']['stat'] ?? [] as $r) {
            $teams = is_array($r['ek'] ?? null) ? $r['ek'] : [];
            if (empty($r['ig']) || ! in_array($teamId, array_column($teams, 'b'), true)) {
                continue;
            }
            $players[] = [
                'player_id' => self::num($r['ig']),
                'first_name' => self::str($r['ime'] ?? null),
                'last_name' => self::str($r['prezime'] ?? null),
                'photo_url' => self::photoUrl($r['f1'] ?? null),
                'matches' => self::num($r['utk'] ?? null),
                'goals' => self::num($r['sutd'] ?? null),
                'seven_meter_goals' => self::num($r['s7d'] ?? null),
                'seven_meter_shots' => self::num($r['s7p'] ?? null),
                'assists' => self::num($r['ast'] ?? null),
                'yellow_cards' => self::num($r['zut'] ?? null),
                'suspensions' => self::num($r['iz2'] ?? null),
                'red_cards' => self::num($r['crv'] ?? null),
            ];
        }
        usort($players, fn ($a, $b) => ($b['goals'] <=> $a['goals']) ?: Croatian::compare($a['last_name'], $b['last_name']));

        return $players;
    }

    private function mapLineups(array $matchFile): array
    {
        $homeTeamId = $matchFile['ut'][0]['ekipa1'] ?? null;
        $home = $away = [];
        foreach ($matchFile['sastavi'] ?? [] as $p) {
            $player = [
                'player_id' => self::num($p['igrac'] ?? null),
                'first_name' => self::str($p['ime'] ?? null),
                'last_name' => self::str($p['prezime'] ?? null),
                'shirt_number' => self::numOrNull($p['dres'] ?? null),
                'goals' => self::num($p['sutd'] ?? null),
                'seven_meter_goals' => self::num($p['sutsedmeracd'] ?? null),
                'seven_meter_shots' => self::num($p['sutsedmeracp'] ?? null),
                'saves' => self::num($p['obraned'] ?? null),
                'saves_attempts' => self::num($p['obranep'] ?? null),
                'assists' => self::num($p['asistencija'] ?? null),
                'yellow_cards' => self::num($p['zutih'] ?? null),
                'suspensions' => self::num($p['iskljucenja'] ?? null),
                'red_cards' => self::num($p['crvenih'] ?? null),
            ];
            if (($p['ekipa'] ?? null) === $homeTeamId) {
                $home[] = $player;
            } else {
                $away[] = $player;
            }
        }
        $byShirt = fn ($a, $b) => ($a['shirt_number'] ?? 999) <=> ($b['shirt_number'] ?? 999);
        usort($home, $byShirt);
        usort($away, $byShirt);

        return ['home' => $home, 'away' => $away];
    }

    // Team officials are `sudionici` entries with tip 1 or 2; `rbekipa` is 1 for home, 2 for away.
    // Referees and delegates (tip 3–5) have no team.
    private function mapTeamOfficials(array $matchFile, int $side): array
    {
        $officials = [];
        foreach ($matchFile['sudionici'] ?? [] as $s) {
            if (in_array($s['tip'] ?? null, [1, 2], true) && ($s['rbekipa'] ?? null) === $side && ! empty($s['igrac'])) {
                $officials[] = [
                    'person_id' => self::num($s['igrac']),
                    'first_name' => self::str($s['i'] ?? null),
                    'last_name' => self::str($s['p'] ?? null),
                ];
            }
        }

        return $officials;
    }

    // td 0 = shot (ish 0 scored, otherwise missed), 4 = 2 minutes, 7 = yellow, 10 = timeout.
    // The red card code has not been seen in the feed yet, so it falls under "other".
    private function mapEvents(array $matchFile): array
    {
        $events = $matchFile['dogadjaji'] ?? [];
        usort($events, fn ($a, $b) => self::num($a['sk'] ?? null) <=> self::num($b['sk'] ?? null));

        return array_map(fn ($e) => [
            'time' => self::str($e['vr'] ?? null),
            'side' => ($e['e'] ?? null) === 2 ? 'away' : 'home',
            'type' => match ($e['td'] ?? null) {
                0 => ($e['ish'] ?? null) === 0 ? 'goal' : 'miss',
                4 => 'suspension',
                7 => 'yellow',
                10 => 'timeout',
                default => 'other',
            },
            'player' => trim(self::str($e['i'] ?? null).' '.self::str($e['p'] ?? null)) ?: null,
            'home_score' => self::numOrNull($e['r1'] ?? null),
            'away_score' => self::numOrNull($e['r2'] ?? null),
        ], $events);
    }

    private static function num(mixed $v): int
    {
        return is_int($v) ? $v : (is_float($v) && is_finite($v) ? (int) $v : 0);
    }

    private static function numOrNull(mixed $v): ?int
    {
        return is_int($v) || (is_float($v) && is_finite($v)) ? (int) $v : null;
    }

    private static function str(mixed $v): string
    {
        return is_string($v) ? trim($v) : '';
    }
}
