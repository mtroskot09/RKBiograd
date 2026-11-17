import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar, ExternalLink, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeamLogo from "@/components/TeamLogo";
import HrsUnavailable from "@/components/HrsUnavailable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { HrsLineupPlayer, HrsMatchEvent } from "@shared/hrs";
import { useHrsMatch } from "@/hooks/useHrs";
import { formatMatchDate, formatMatchTime } from "@/lib/hrsFormat";

const EVENT_LABELS: Partial<Record<HrsMatchEvent["type"], string>> = {
  goal: "Gol",
  suspension: "Isključenje 2'",
  yellow: "Žuti karton",
  timeout: "Time-out",
};

export default function MatchDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useHrsMatch(id);
  const notFound = isError && error.message.startsWith("404");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <Button variant="ghost" onClick={() => window.history.back()} data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Natrag
          </Button>

          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : notFound ? (
            <Card className="p-6">
              <p className="font-medium">Utakmica nije pronađena.</p>
              <Link href="/" className="text-sm underline text-muted-foreground">Povratak na početnu</Link>
            </Card>
          ) : isError || !data ? (
            <HrsUnavailable what="Podaci o utakmici" />
          ) : (
            <>
              <Scoreboard detail={data} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Lineup title={data.match.homeTeam} players={data.home} />
                <Lineup title={data.match.awayTeam} players={data.away} />
              </div>
              <Timeline events={data.events} home={data.match.homeTeam} away={data.match.awayTeam} />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Scoreboard({ detail }: { detail: NonNullable<ReturnType<typeof useHrsMatch>["data"]> }) {
  const { match } = detail;
  const time = formatMatchTime(match.startsAt);
  const location = [match.venue, match.city].filter(Boolean).join(", ");
  const hasScore = match.homeScore !== null && match.awayScore !== null;

  return (
    <section
      className="relative overflow-hidden rounded-2xl bg-brand-gradient text-white shadow-xl shadow-primary/20 p-5 sm:p-8 md:p-10"
      data-testid="match-scoreboard"
    >
      <img
        src="/rk-biograd-logo-192.png"
        alt=""
        aria-hidden="true"
        className="absolute -right-8 -top-8 h-56 w-auto opacity-[0.07] rotate-12"
      />
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-accent" />

      <div className="relative flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-8">
        <span>
          {match.competition}
          {match.round !== null && !match.isCup && ` · ${match.round}. kolo`}
        </span>
        {match.status === "live" && (
          <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] text-accent-foreground animate-pulse">Uživo</span>
        )}
      </div>

      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-6">
        <div className="flex flex-col items-center gap-3 text-center min-w-0">
          <div className="rounded-full bg-white p-2 shadow-lg">
            <TeamLogo src={match.homeLogoUrl} name={match.homeTeam} className="h-14 w-14 md:h-20 md:w-20" />
          </div>
          <h1 className="font-display text-xl md:text-3xl font-bold uppercase leading-tight break-words">{match.homeTeam}</h1>
        </div>
        <div className="text-center">
          {hasScore ? (
            <>
              <div className="font-display text-5xl sm:text-6xl md:text-8xl font-extrabold tabular-nums leading-none">
                {match.homeScore}
                <span className="mx-1 text-accent">:</span>
                {match.awayScore}
              </div>
              {match.homeHalfTime !== null && match.awayHalfTime !== null && (
                <div className="mt-2 text-xs sm:text-sm text-white/70">
                  Poluvrijeme {match.homeHalfTime}:{match.awayHalfTime}
                </div>
              )}
            </>
          ) : (
            <div className="font-display text-4xl font-bold text-accent">VS</div>
          )}
        </div>
        <div className="flex flex-col items-center gap-3 text-center min-w-0">
          <div className="rounded-full bg-white p-2 shadow-lg">
            <TeamLogo src={match.awayLogoUrl} name={match.awayTeam} className="h-14 w-14 md:h-20 md:w-20" />
          </div>
          <h2 className="font-display text-xl md:text-3xl font-bold uppercase leading-tight break-words">{match.awayTeam}</h2>
        </div>
      </div>

      <div className="relative flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80 mt-8">
        <span className="flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-accent" />
          {formatMatchDate(match.startsAt)}
          {time && ` · ${time}`}
        </span>
        {location && (
          <span className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-accent" />
            {location}
          </span>
        )}
        <a href={detail.hrsUrl} target="_blank" rel="noreferrer" className="flex items-center underline hover:text-accent">
          Zapisnik na HRS-u
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </section>
  );
}

function Lineup({ title, players }: { title: string; players: HrsLineupPlayer[] }) {
  const showSaves = players.some((p) => p.savesAttempts > 0);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold uppercase text-primary mb-4">{title}</h2>
      {players.length === 0 ? (
        <p className="text-muted-foreground">Sastav nije objavljen.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/60">
                <th className="text-left py-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">#</th>
                <th className="text-left py-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Igrač</th>
                <th className="text-center py-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Golovi</th>
                <th className="text-center py-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">7m</th>
                {showSaves && <th className="text-center py-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Obrane</th>}
                <th className="text-center py-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Ž</th>
                <th className="text-center py-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">2'</th>
                <th className="text-center py-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">C</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.playerId} className="border-b">
                  <td className="py-2 px-2 text-sm font-mono text-muted-foreground">{p.shirtNumber ?? ""}</td>
                  <td className="py-2 px-2 text-sm">{p.firstName} {p.lastName}</td>
                  <td className="text-center py-2 px-2 text-sm font-mono font-bold">
                    {p.goals}
                  </td>
                  <td className="text-center py-2 px-2 text-sm font-mono hidden sm:table-cell">
                    {p.sevenMeterShots > 0 ? `${p.sevenMeterGoals}/${p.sevenMeterShots}` : ""}
                  </td>
                  {showSaves && (
                    <td className="text-center py-2 px-2 text-sm font-mono">
                      {p.savesAttempts > 0 ? `${p.saves}/${p.savesAttempts}` : ""}
                    </td>
                  )}
                  <td className="text-center py-2 px-2 text-sm font-mono hidden sm:table-cell">{p.yellowCards || ""}</td>
                  <td className="text-center py-2 px-2 text-sm font-mono hidden sm:table-cell">{p.suspensions || ""}</td>
                  <td className="text-center py-2 px-2 text-sm font-mono hidden sm:table-cell">{p.redCards || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function Timeline({ events, home, away }: { events: HrsMatchEvent[]; home: string; away: string }) {
  const shown = events.filter((e) => EVENT_LABELS[e.type]);
  if (shown.length === 0) return null;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold uppercase text-primary mb-4">Tijek utakmice</h2>
      <ol className="divide-y" data-testid="match-timeline">
        {[...shown].reverse().map((e, i) => (
          <li
            key={i}
            className={`flex items-center gap-3 py-2 text-sm ${e.side === "away" ? "flex-row-reverse text-right" : ""}`}
          >
            <span className="font-mono tabular-nums text-muted-foreground w-12 shrink-0">{e.time}</span>
            <span
              className={
                e.type === "goal"
                  ? "rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground"
                  : "rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground"
              }
            >
              {EVENT_LABELS[e.type]}
              {e.type === "goal" && e.homeScore !== null && ` ${e.homeScore}:${e.awayScore}`}
            </span>
            <span className="text-muted-foreground truncate">
              {e.player ?? (e.side === "home" ? home : away)}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
