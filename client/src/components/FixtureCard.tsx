import { Card } from "@/components/ui/card";
import { Calendar, ChevronRight, MapPin } from "lucide-react";
import { Link } from "wouter";
import type { HrsMatch, HrsMatchStatus } from "@shared/hrs";
import TeamLogo from "@/components/TeamLogo";
import { formatMatchDate, formatMatchTime } from "@/lib/hrsFormat";
import { cn } from "@/lib/utils";

interface FixtureCardProps {
  match: HrsMatch;
}

const STATUS: Record<HrsMatchStatus, { label: string; className: string }> = {
  live: { label: "Uživo", className: "bg-accent text-accent-foreground animate-pulse" },
  finished: { label: "Završeno", className: "bg-secondary text-secondary-foreground" },
  postponed: { label: "Odgođeno", className: "border border-border text-muted-foreground" },
  upcoming: { label: "Predstoji", className: "bg-primary text-primary-foreground" },
};

export default function FixtureCard({ match }: FixtureCardProps) {
  const { homeScore, awayScore, status } = match;
  const time = formatMatchTime(match.startsAt);
  const location = [match.venue, match.city].filter(Boolean).join(", ");
  const hasDetails = status === "finished" || status === "live";
  const hasScore = homeScore !== null && awayScore !== null;

  // The winning side is shown in dark blue, the losing side greyed out.
  const scoreClass = (isHome: boolean) => {
    if (!hasScore || homeScore === awayScore) return "text-foreground";
    const won = isHome ? homeScore! > awayScore! : awayScore! > homeScore!;
    return won ? "text-primary" : "text-muted-foreground";
  };

  const team = (name: string, logo: string, isOurs: boolean) => (
    <div className="flex flex-col items-center gap-2 text-center min-w-0">
      <TeamLogo src={logo} name={name} className="h-12 w-12 sm:h-14 sm:w-14" />
      <div className={cn("text-sm sm:text-base font-semibold leading-tight break-words", isOurs && "text-primary")}>{name}</div>
    </div>
  );

  const card = (
    <Card
      className={cn("h-full overflow-hidden", hasDetails && "card-hover cursor-pointer")}
      data-testid="fixture-card"
    >
      <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b bg-muted/50">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary truncate">{match.competition}</div>
          {match.round !== null && !match.isCup && (
            <div className="text-xs text-muted-foreground">{match.round}. kolo</div>
          )}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
            STATUS[status].className,
          )}
        >
          {STATUS[status].label}
        </span>
      </div>

      <div className="px-4 sm:px-5 py-5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
          {team(match.homeTeam, match.homeLogoUrl, match.isHome)}
          <div className="text-center px-1">
            {hasScore ? (
              <>
                <div className="font-display text-4xl sm:text-5xl font-extrabold tabular-nums leading-none">
                  <span className={scoreClass(true)}>{homeScore}</span>
                  <span className="mx-1 text-muted-foreground">:</span>
                  <span className={scoreClass(false)}>{awayScore}</span>
                </div>
                {match.homeHalfTime !== null && match.awayHalfTime !== null && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    ({match.homeHalfTime}:{match.awayHalfTime})
                  </div>
                )}
              </>
            ) : (
              <div className="font-display text-2xl font-bold text-accent-strong">VS</div>
            )}
          </div>
          {team(match.awayTeam, match.awayLogoUrl, !match.isHome)}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-4 w-4 text-accent" />
            {formatMatchDate(match.startsAt)}
            {time && ` · ${time}`}
          </span>
          {location && (
            <span className="inline-flex items-center gap-1 text-center">
              <MapPin className="h-4 w-4 text-accent shrink-0" />
              {location}
            </span>
          )}
        </div>
      </div>

      {hasDetails && (
        <div className="flex items-center justify-center gap-1 border-t py-2 text-xs font-semibold uppercase tracking-wider text-primary">
          Detalji utakmice
          <ChevronRight className="h-4 w-4" />
        </div>
      )}
    </Card>
  );

  return hasDetails ? (
    <Link href={`/utakmica/${match.id}`} className="block h-full rounded-xl">
      {card}
    </Link>
  ) : (
    card
  );
}
