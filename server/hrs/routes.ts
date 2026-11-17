import type { Express, Response } from "express";
import {
  HRS_TEAM_KEYS,
  type HrsMatch,
  type HrsMatchDetail,
  type HrsOfficial,
  type HrsTeamInfo,
  type HrsTeamKey,
} from "@shared/hrs";
import { HRS_MATCH_URL, SEASON, TEAMS } from "./config";
import { getCompetition, getMatchFile } from "./client";
import {
  competitionInfo,
  findLeague,
  isOurMatch,
  mapEvents,
  mapLineups,
  mapMatch,
  mapPlayers,
  mapStandings,
  mapTeamOfficials,
} from "./map";

function teamInfo(key: HrsTeamKey): HrsTeamInfo {
  return {
    key,
    label: TEAMS[key].label,
    season: SEASON,
    competitions: TEAMS[key].competitions.map(competitionInfo),
  };
}

async function getStandings(key: HrsTeamKey) {
  const leagues = TEAMS[key].competitions.filter((c) => !c.isCup);
  return Promise.all(
    leagues.map(async (c) => ({
      competition: competitionInfo(c),
      rows: mapStandings(findLeague(await getCompetition(c.competitionId), c.leagueId)),
    })),
  );
}

async function getMatches(key: HrsTeamKey): Promise<HrsMatch[]> {
  const perCompetition = await Promise.all(
    TEAMS[key].competitions.map(async (c) => {
      const league = findLeague(await getCompetition(c.competitionId), c.leagueId);
      return (league.utakmice ?? []).filter(isOurMatch).map((u: any) => mapMatch(u, c));
    }),
  );
  return perCompetition
    .flat()
    .sort((a, b) => (a.startsAt ?? "9999").localeCompare(b.startsAt ?? "9999"));
}

async function getPlayers(key: HrsTeamKey) {
  const leagues = TEAMS[key].competitions.filter((c) => !c.isCup);
  const lists = await Promise.all(
    leagues.map(async (c) => {
      const competition = await getCompetition(c.competitionId);
      return mapPlayers(competition, findLeague(competition, c.leagueId));
    }),
  );
  return lists.flat();
}

const MATCH_FETCH_BATCH = 4;

// Coaches are only listed per match, so all our team officials are collected from the
// finished match sheets of every team. Admins pick from this list in the coaching staff page.
async function getOfficials(): Promise<HrsOfficial[]> {
  const people = new Map<number, HrsOfficial>();

  for (const key of HRS_TEAM_KEYS) {
    const finished = (await getMatches(key)).filter((m) => m.status === "finished");
    for (let i = 0; i < finished.length; i += MATCH_FETCH_BATCH) {
      const batch = finished.slice(i, i + MATCH_FETCH_BATCH);
      const files = await Promise.all(batch.map((m) => getMatchFile(m.id)));
      batch.forEach((match, j) => {
        for (const o of mapTeamOfficials(files[j], match.isHome ? 1 : 2)) {
          const person = people.get(o.personId) ?? {
            personId: o.personId,
            firstName: o.firstName,
            lastName: o.lastName,
            teams: [],
            lastMatch: null,
          };
          const team = person.teams.find((t) => t.team === key);
          if (team) team.matches++;
          else person.teams.push({ team: key, matches: 1 });
          if (match.startsAt && (!person.lastMatch || match.startsAt > person.lastMatch)) {
            person.lastMatch = match.startsAt;
          }
          people.set(o.personId, person);
        }
      });
    }
  }

  return Array.from(people.values()).sort(
    (a, b) => a.lastName.localeCompare(b.lastName, "hr") || a.firstName.localeCompare(b.firstName, "hr"),
  );
}

// Only matches of our club in configured competitions can be requested, so the
// endpoint cannot be used to fetch arbitrary files from the feed.
async function getMatchDetail(matchId: number): Promise<HrsMatchDetail | undefined> {
  for (const key of HRS_TEAM_KEYS) {
    const match = (await getMatches(key)).find((m) => m.id === matchId);
    if (match) {
      const file = await getMatchFile(matchId);
      return {
        match,
        ...mapLineups(file),
        events: mapEvents(file),
        hrsUrl: HRS_MATCH_URL + matchId,
      };
    }
  }
  return undefined;
}

function sendUpstreamError(res: Response, error: unknown) {
  console.error("HRS feed error:", error);
  res.status(502).json({ error: "HRS podaci trenutno nisu dostupni" });
}

const isTeamKey = (v: string): v is HrsTeamKey => (HRS_TEAM_KEYS as readonly string[]).includes(v);

export function registerHrsRoutes(app: Express) {
  app.get("/api/hrs/teams", (_req, res) => {
    res.json(HRS_TEAM_KEYS.map(teamInfo));
  });

  const teamRoutes = {
    standings: getStandings,
    matches: getMatches,
    players: getPlayers,
  } as const;

  for (const [path, load] of Object.entries(teamRoutes)) {
    app.get(`/api/hrs/teams/:team/${path}`, async (req, res) => {
      const { team } = req.params;
      if (!isTeamKey(team)) {
        return res.status(404).json({ error: "Team not found" });
      }
      try {
        res.json(await load(team));
      } catch (error) {
        sendUpstreamError(res, error);
      }
    });
  }

  // All team officials of our club (people the admin can assign as coaches).
  app.get("/api/hrs/officials", async (_req, res) => {
    try {
      res.json(await getOfficials());
    } catch (error) {
      sendUpstreamError(res, error);
    }
  });

  app.get("/api/hrs/matches/:id", async (req, res) => {
    if (!/^\d{1,10}$/.test(req.params.id)) {
      return res.status(404).json({ error: "Match not found" });
    }
    try {
      const detail = await getMatchDetail(Number(req.params.id));
      if (!detail) {
        return res.status(404).json({ error: "Match not found" });
      }
      res.json(detail);
    } catch (error) {
      sendUpstreamError(res, error);
    }
  });
}
