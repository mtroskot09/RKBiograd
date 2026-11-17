// Types for data served from /api/hrs/*. The server maps the HRS vendor feed
// (Sportinfocentar) into these shapes so the client never sees raw feed fields.

export const HRS_TEAM_KEYS = ["senior", "u15", "u13"] as const;
export type HrsTeamKey = (typeof HRS_TEAM_KEYS)[number];

export type HrsMatchStatus = "upcoming" | "live" | "finished" | "postponed";

export interface HrsCompetitionInfo {
  competitionId: number;
  leagueId: number;
  name: string;
  isCup: boolean;
  hrsUrl: string;
}

export interface HrsTeamInfo {
  key: HrsTeamKey;
  label: string;
  season: string;
  competitions: HrsCompetitionInfo[];
}

export interface HrsStanding {
  position: number;
  team: string;
  clubId: number;
  logoUrl: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  isOurTeam: boolean;
}

export interface HrsStandingsTable {
  competition: HrsCompetitionInfo;
  rows: HrsStanding[];
}

export interface HrsMatch {
  id: number;
  competition: string;
  isCup: boolean;
  round: number | null;
  /** ISO local date-time as published by HRS (Europe/Zagreb), e.g. "2026-09-20T19:00:00" */
  startsAt: string | null;
  homeTeam: string;
  awayTeam: string;
  homeClubId: number;
  awayClubId: number;
  homeLogoUrl: string;
  awayLogoUrl: string;
  homeScore: number | null;
  awayScore: number | null;
  homeHalfTime: number | null;
  awayHalfTime: number | null;
  venue: string;
  city: string;
  status: HrsMatchStatus;
  isHome: boolean;
}

export interface HrsPlayerStats {
  playerId: number;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  matches: number;
  goals: number;
  sevenMeterGoals: number;
  sevenMeterShots: number;
  assists: number;
  yellowCards: number;
  suspensions: number;
  redCards: number;
}

/**
 * Team official of our club from HRS match sheets (officials A, B, …). HRS gives no job
 * titles; an admin assigns teams and roles (see staffAssignments in shared/schema.ts).
 */
export interface HrsOfficial {
  personId: number;
  firstName: string;
  lastName: string;
  /** Teams this person was listed for, with the number of finished matches */
  teams: { team: HrsTeamKey; matches: number }[];
  lastMatch: string | null;
}

export interface HrsLineupPlayer {
  playerId: number;
  firstName: string;
  lastName: string;
  shirtNumber: number | null;
  goals: number;
  sevenMeterGoals: number;
  sevenMeterShots: number;
  saves: number;
  savesAttempts: number;
  assists: number;
  yellowCards: number;
  suspensions: number;
  redCards: number;
}

export type HrsEventType = "goal" | "miss" | "suspension" | "yellow" | "timeout" | "other";

export interface HrsMatchEvent {
  /** Match clock, e.g. "53:36" */
  time: string;
  side: "home" | "away";
  type: HrsEventType;
  player: string | null;
  homeScore: number | null;
  awayScore: number | null;
}

export interface HrsMatchDetail {
  match: HrsMatch;
  home: HrsLineupPlayer[];
  away: HrsLineupPlayer[];
  events: HrsMatchEvent[];
  hrsUrl: string;
}
