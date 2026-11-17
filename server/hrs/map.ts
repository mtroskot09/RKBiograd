import type {
  HrsCompetitionInfo,
  HrsEventType,
  HrsLineupPlayer,
  HrsMatch,
  HrsMatchEvent,
  HrsMatchStatus,
  HrsPlayerStats,
  HrsStanding,
} from "@shared/hrs";
import { CLUB_ID, FEED_BASE_URL, HRS_COMPETITION_URL, type CompetitionConfig } from "./config";

// Field names below are the vendor's (Croatian abbreviations). Meanings were checked
// against hrs.hr and by cross-checking event counts with lineup totals.

const num = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const numOrNull = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);
const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

// Our own crest (client/public) instead of the HRS copy; other clubs use HRS logos.
const OUR_LOGO_URL = "/rk-biograd-logo-192.png";

export const logoUrl = (clubId: number) =>
  clubId === CLUB_ID ? OUR_LOGO_URL : new URL(`logo/${clubId}.png`, FEED_BASE_URL).href;
const photoUrl = (file: unknown) => (str(file) ? new URL(`foto/${str(file)}`, FEED_BASE_URL).href : null);

export function competitionInfo(c: CompetitionConfig): HrsCompetitionInfo {
  return {
    competitionId: c.competitionId,
    leagueId: c.leagueId,
    name: c.name,
    isCup: !!c.isCup,
    hrsUrl: HRS_COMPETITION_URL + c.competitionId,
  };
}

export function findLeague(competition: any, leagueId: number): any {
  const league = competition?.lige?.find((l: any) => l.broj === leagueId);
  if (!league) {
    throw new Error(`HRS feed: league ${leagueId} not found in competition ${competition?.broj}`);
  }
  return league;
}

export function mapStandings(league: any): HrsStanding[] {
  return (league.tablica ?? [])
    .map((r: any) => ({
      position: num(r.por),
      team: str(r.n),
      clubId: num(r.k),
      logoUrl: logoUrl(num(r.k)),
      played: num(r.utk),
      won: num(r.pob),
      draw: num(r.ner),
      lost: num(r.izg),
      goalsFor: num(r.dat),
      goalsAgainst: num(r.prim),
      goalDiff: num(r.raz),
      points: num(r.bod),
      isOurTeam: num(r.k) === CLUB_ID,
    }))
    .sort((a: HrsStanding, b: HrsStanding) => a.position - b.position);
}

// st: 0 = not played, 2 = finished, 6 = postponed (no score). Anything else is in progress.
function matchStatus(st: unknown): HrsMatchStatus {
  switch (st) {
    case 0:
      return "upcoming";
    case 2:
      return "finished";
    case 6:
      return "postponed";
    default:
      return "live";
  }
}

export const isOurMatch = (u: any) => u.k1 === CLUB_ID || u.k2 === CLUB_ID;

export function mapMatch(u: any, competition: CompetitionConfig): HrsMatch {
  const status = matchStatus(u.st);
  const hasScore = status === "finished" || status === "live";
  return {
    id: num(u.broj),
    competition: competition.name,
    isCup: !!competition.isCup,
    round: numOrNull(u.kolo),
    startsAt: str(u.pc) || null,
    homeTeam: str(u.e1),
    awayTeam: str(u.e2),
    homeClubId: num(u.k1),
    awayClubId: num(u.k2),
    homeLogoUrl: logoUrl(num(u.k1)),
    awayLogoUrl: logoUrl(num(u.k2)),
    homeScore: hasScore ? numOrNull(u.r1) : null,
    awayScore: hasScore ? numOrNull(u.r2) : null,
    homeHalfTime: hasScore ? numOrNull(u.p11) : null,
    awayHalfTime: hasScore ? numOrNull(u.p12) : null,
    venue: str(u.mnaziv),
    city: str(u.mmjesto),
    status,
    isHome: u.k1 === CLUB_ID,
  };
}

// Player rows in `statistika.stat` have `ig` (player id) and `ek`, the teams they played for.
export function mapPlayers(competition: any, league: any): HrsPlayerStats[] {
  const teamId = league.tablica?.find((r: any) => r.k === CLUB_ID)?.e;
  if (teamId === undefined) return [];

  return (competition.statistika?.stat ?? [])
    .filter((r: any) => r.ig && Array.isArray(r.ek) && r.ek.some((t: any) => t.b === teamId))
    .map((r: any) => ({
      playerId: num(r.ig),
      firstName: str(r.ime),
      lastName: str(r.prezime),
      photoUrl: photoUrl(r.f1),
      matches: num(r.utk),
      goals: num(r.sutd),
      sevenMeterGoals: num(r.s7d),
      sevenMeterShots: num(r.s7p),
      assists: num(r.ast),
      yellowCards: num(r.zut),
      suspensions: num(r.iz2),
      redCards: num(r.crv),
    }))
    .sort((a: HrsPlayerStats, b: HrsPlayerStats) => b.goals - a.goals || a.lastName.localeCompare(b.lastName, "hr"));
}

function mapLineupPlayer(p: any): HrsLineupPlayer {
  return {
    playerId: num(p.igrac),
    firstName: str(p.ime),
    lastName: str(p.prezime),
    shirtNumber: numOrNull(p.dres),
    goals: num(p.sutd),
    sevenMeterGoals: num(p.sutsedmeracd),
    sevenMeterShots: num(p.sutsedmeracp),
    saves: num(p.obraned),
    savesAttempts: num(p.obranep),
    assists: num(p.asistencija),
    yellowCards: num(p.zutih),
    suspensions: num(p.iskljucenja),
    redCards: num(p.crvenih),
  };
}

export function mapLineups(matchFile: any) {
  const homeTeamId = matchFile.ut?.[0]?.ekipa1;
  const players: any[] = matchFile.sastavi ?? [];
  const byShirt = (a: HrsLineupPlayer, b: HrsLineupPlayer) => (a.shirtNumber ?? 999) - (b.shirtNumber ?? 999);
  return {
    home: players.filter((p) => p.ekipa === homeTeamId).map(mapLineupPlayer).sort(byShirt),
    away: players.filter((p) => p.ekipa !== homeTeamId).map(mapLineupPlayer).sort(byShirt),
  };
}

export interface MatchOfficial {
  personId: number;
  firstName: string;
  lastName: string;
  letter: string;
}

// Team officials are `sudionici` entries with tip 1 or 2; `rbekipa` is 1 for home, 2 for away,
// `oznaka` is the official's letter on the match sheet (A, B, … – sometimes empty).
// Referees and delegates (tip 3–5) have no team.
export function mapTeamOfficials(matchFile: any, side: 1 | 2): MatchOfficial[] {
  return (matchFile.sudionici ?? [])
    .filter((s: any) => (s.tip === 1 || s.tip === 2) && s.rbekipa === side && s.igrac)
    .map((s: any) => ({
      personId: num(s.igrac),
      firstName: str(s.i),
      lastName: str(s.p),
      letter: str(s.oznaka),
    }));
}

// td 0 = shot (ish 0 scored, otherwise missed), 4 = 2 minutes, 7 = yellow, 10 = timeout.
// The red card code has not been seen in the feed yet, so it falls under "other".
function eventType(e: any): HrsEventType {
  switch (e.td) {
    case 0:
      return e.ish === 0 ? "goal" : "miss";
    case 4:
      return "suspension";
    case 7:
      return "yellow";
    case 10:
      return "timeout";
    default:
      return "other";
  }
}

export function mapEvents(matchFile: any): HrsMatchEvent[] {
  return [...(matchFile.dogadjaji ?? [])]
    .sort((a, b) => num(a.sk) - num(b.sk))
    .map((e) => {
      const player = [str(e.i), str(e.p)].filter(Boolean).join(" ");
      return {
        time: str(e.vr),
        side: e.e === 2 ? ("away" as const) : ("home" as const),
        type: eventType(e),
        player: player || null,
        homeScore: numOrNull(e.r1),
        awayScore: numOrNull(e.r2),
      };
    });
}
