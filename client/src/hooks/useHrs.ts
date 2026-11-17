import { useQuery } from "@tanstack/react-query";
import type {
  HrsMatch,
  HrsMatchDetail,
  HrsPlayerStats,
  HrsOfficial,
  HrsStandingsTable,
  HrsTeamKey,
} from "@shared/hrs";

// HRS data changes during the season, so unlike the app default (staleTime: Infinity)
// it is refetched after a few minutes. The server caches the feed as well.
const HRS_STALE_TIME = 5 * 60_000;

export function useHrsStandings(team: HrsTeamKey) {
  return useQuery<HrsStandingsTable[]>({
    queryKey: [`/api/hrs/teams/${team}/standings`],
    staleTime: HRS_STALE_TIME,
  });
}

export function useHrsMatches(team: HrsTeamKey) {
  return useQuery<HrsMatch[]>({
    queryKey: [`/api/hrs/teams/${team}/matches`],
    staleTime: HRS_STALE_TIME,
  });
}

export function useHrsPlayers(team: HrsTeamKey) {
  return useQuery<HrsPlayerStats[]>({
    queryKey: [`/api/hrs/teams/${team}/players`],
    staleTime: HRS_STALE_TIME,
  });
}

/** Team officials from HRS match sheets – the people an admin can assign as coaches. */
export function useHrsOfficials(enabled = true) {
  return useQuery<HrsOfficial[]>({
    queryKey: ["/api/hrs/officials"],
    staleTime: HRS_STALE_TIME,
    enabled,
  });
}

export function useHrsMatch(id: string) {
  return useQuery<HrsMatchDetail>({
    queryKey: [`/api/hrs/matches/${id}`],
    staleTime: 60_000,
    refetchInterval: (query) => (query.state.data?.match.status === "live" ? 30_000 : false),
  });
}
