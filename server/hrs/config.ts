import type { HrsTeamKey } from "@shared/hrs";

// Season config for the HRS data feed. Update these IDs at the start of every season.
//
// How to find the IDs:
//   1. https://api.hrs.hr/ed/licence/1 lists all current competitions:
//      `nb` = competitionId, `broj` = leagueId (a group inside the competition), `ln`/`nn` = names.
//   2. The competition page on hrs.hr uses the same competitionId: https://hrs.hr/natjecanje/?natjecanje=<id>
//   3. Our club appears in the feed with club id CLUB_ID (fields `k`, `k1`, `k2`).

export const CLUB_ID = 1421;
export const SEASON = "2026/27";

export interface CompetitionConfig {
  competitionId: number;
  leagueId: number;
  name: string;
  isCup?: boolean;
}

export interface TeamConfig {
  label: string;
  competitions: CompetitionConfig[];
}

export const TEAMS: Record<HrsTeamKey, TeamConfig> = {
  senior: {
    label: "Prva ekipa",
    competitions: [
      { competitionId: 2014, leagueId: 4072, name: "2. HRL Jug" },
      { competitionId: 2075, leagueId: 4351, name: "Hrvatski kup – Regija Jug", isCup: true },
    ],
  },
  u15: {
    label: "U15",
    competitions: [{ competitionId: 2034, leagueId: 4117, name: "1. HRL U15 – Regija 3" }],
  },
  u13: {
    label: "U13",
    competitions: [{ competitionId: 2033, leagueId: 4112, name: "1. HRL U13 – R3 Skupina A" }],
  },
};

export const FEED_BASE_URL = process.env.HRS_FEED_BASE_URL ?? "https://www.sportinfocentar2.com/coman/";
export const HRS_COMPETITION_URL = "https://hrs.hr/natjecanje/?natjecanje=";
export const HRS_MATCH_URL = "https://hrs.hr/utakmica/?utakmica=";
