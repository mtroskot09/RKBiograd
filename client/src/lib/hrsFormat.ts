import type { HrsMatch } from "@shared/hrs";

const MONTHS = [
  "siječnja", "veljače", "ožujka", "travnja", "svibnja", "lipnja",
  "srpnja", "kolovoza", "rujna", "listopada", "studenoga", "prosinca",
];

// HRS publishes local Croatian time without a timezone ("2026-09-20T19:00:00"),
// so the parts are read directly instead of going through Date (which would shift it).
function parts(startsAt: string | null) {
  const m = startsAt?.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return null;
  return { year: +m[1], month: +m[2], day: +m[3], time: `${m[4]}:${m[5]}` };
}

export function formatMatchDate(startsAt: string | null): string {
  const p = parts(startsAt);
  return p ? `${p.day}. ${MONTHS[p.month - 1]} ${p.year}.` : "Datum nije poznat";
}

export function formatMatchTime(startsAt: string | null): string | null {
  const p = parts(startsAt);
  return p && p.time !== "00:00" ? p.time : null;
}

export function opponentOf(match: HrsMatch): string {
  return match.isHome ? match.awayTeam : match.homeTeam;
}

/** "P" win, "N" draw, "I" loss – from our team's point of view. */
export function resultLetter(match: HrsMatch): "P" | "N" | "I" | null {
  if (match.status !== "finished" || match.homeScore === null || match.awayScore === null) return null;
  const ours = match.isHome ? match.homeScore : match.awayScore;
  const theirs = match.isHome ? match.awayScore : match.homeScore;
  return ours > theirs ? "P" : ours < theirs ? "I" : "N";
}

export function splitMatches(matches: HrsMatch[] | undefined) {
  const all = matches ?? [];
  return {
    upcoming: all.filter((m) => m.status === "upcoming" || m.status === "live"),
    results: all.filter((m) => m.status === "finished").reverse(),
    postponed: all.filter((m) => m.status === "postponed"),
  };
}

export function formatDate(value: string | Date): string {
  const d = new Date(value);
  return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}.`;
}
