import { FEED_BASE_URL } from "./config";
import { parseFeed } from "./parse";

const REQUEST_TIMEOUT_MS = 15_000;
const COMPETITION_TTL_MS = 5 * 60_000;
const MATCH_LIVE_TTL_MS = 60_000;
const MATCH_FINISHED_TTL_MS = 60 * 60_000;

interface CacheEntry {
  data: any;
  fetchedAt: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<any>>();

async function fetchFeed(path: string): Promise<any> {
  const url = new URL(path, FEED_BASE_URL).href;
  const res = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  if (!res.ok) {
    throw new Error(`HRS feed: ${res.status} ${res.statusText} for ${url}`);
  }
  return parseFeed(await res.text());
}

// Returns cached data while fresh. When stale, refetches; if that fails, keeps serving
// the stale copy so the site stays up while HRS is down. Only throws with an empty cache.
async function getCached(path: string, ttlFor: (data: any) => number): Promise<any> {
  const cached = cache.get(path);
  if (cached && Date.now() - cached.fetchedAt < cached.ttl) {
    return cached.data;
  }

  let pending = inFlight.get(path);
  if (!pending) {
    pending = fetchFeed(path)
      .then((data) => {
        cache.set(path, { data, fetchedAt: Date.now(), ttl: ttlFor(data) });
        return data;
      })
      .finally(() => inFlight.delete(path));
    inFlight.set(path, pending);
  }

  try {
    return await pending;
  } catch (error) {
    if (cached) {
      console.error(`${(error as Error).message} – serving cached copy`);
      return cached.data;
    }
    throw error;
  }
}

export function getCompetition(competitionId: number): Promise<any> {
  return getCached(`natjecanje${competitionId}.js`, () => COMPETITION_TTL_MS);
}

export function getMatchFile(matchId: number): Promise<any> {
  return getCached(`utakmice/${matchId}.js`, (data) =>
    data?.ut?.[0]?.status === 2 ? MATCH_FINISHED_TTL_MS : MATCH_LIVE_TTL_MS,
  );
}
