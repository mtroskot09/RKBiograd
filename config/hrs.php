<?php

// Season config for the HRS data feed. Update these IDs at the start of every season.
//
// How to find the IDs:
//   1. https://api.hrs.hr/ed/licence/1 lists all current competitions:
//      `nb` = competition_id, `broj` = league_id (a group inside the competition), `ln`/`nn` = names.
//   2. The competition page on hrs.hr uses the same competition_id: https://hrs.hr/natjecanje/?natjecanje=<id>
//   3. Our club appears in the feed with club id `club_id` (fields `k`, `k1`, `k2`).

return [
    'club_id' => 1421,
    'season' => '2026/27',

    'teams' => [
        'senior' => [
            'label' => 'Prva ekipa',
            'competitions' => [
                ['competition_id' => 2014, 'league_id' => 4072, 'name' => '2. HRL Jug'],
                ['competition_id' => 2075, 'league_id' => 4351, 'name' => 'Hrvatski kup – Regija Jug', 'is_cup' => true],
            ],
        ],
        'u15' => [
            'label' => 'U15',
            'competitions' => [
                ['competition_id' => 2034, 'league_id' => 4117, 'name' => '1. HRL U15 – Regija 3'],
            ],
        ],
        'u13' => [
            'label' => 'U13',
            'competitions' => [
                ['competition_id' => 2033, 'league_id' => 4112, 'name' => '1. HRL U13 – R3 Skupina A'],
            ],
        ],
    ],

    'feed_base_url' => env('HRS_FEED_BASE_URL', 'https://www.sportinfocentar2.com/coman/'),
    'competition_url' => 'https://hrs.hr/natjecanje/?natjecanje=',
    'match_url' => 'https://hrs.hr/utakmica/?utakmica=',
];
