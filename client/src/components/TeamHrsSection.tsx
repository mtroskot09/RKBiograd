import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { HrsMatch, HrsTeamKey } from "@shared/hrs";
import { useHrsMatches, useHrsPlayers, useHrsStandings } from "@/hooks/useHrs";
import { splitMatches } from "@/lib/hrsFormat";
import LeagueTable from "@/components/LeagueTable";
import FixtureCard from "@/components/FixtureCard";
import PlayerStatsTable from "@/components/PlayerStatsTable";
import HrsUnavailable from "@/components/HrsUnavailable";

interface TeamHrsSectionProps {
  team: HrsTeamKey;
}

// Standings, matches and player stats for one team, all live from HRS.
export default function TeamHrsSection({ team }: TeamHrsSectionProps) {
  const standings = useHrsStandings(team);
  const matches = useHrsMatches(team);
  const players = useHrsPlayers(team);
  const { upcoming, results, postponed } = splitMatches(matches.data);

  return (
    <Tabs defaultValue="matches" className="w-full">
      <TabsList className="mb-8 grid w-full grid-cols-3 sm:inline-flex sm:w-auto">
        <TabsTrigger value="matches" data-testid="tab-matches">Utakmice</TabsTrigger>
        <TabsTrigger value="table" data-testid="tab-table">Ljestvica</TabsTrigger>
        <TabsTrigger value="players" data-testid="tab-players">Igrači</TabsTrigger>
      </TabsList>

      <TabsContent value="matches" className="space-y-12">
        {matches.isLoading ? (
          <CardGridSkeleton />
        ) : matches.isError ? (
          <HrsUnavailable what="Utakmice" />
        ) : (
          <>
            <MatchList title="Sljedeće utakmice" matches={upcoming} empty="Nema predstojećih utakmica." />
            <MatchList title="Rezultati" matches={results} empty="Još nema odigranih utakmica." />
            {postponed.length > 0 && <MatchList title="Odgođene utakmice" matches={postponed} empty="" />}
          </>
        )}
      </TabsContent>

      <TabsContent value="table" className="space-y-8">
        {standings.isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : standings.isError || !standings.data?.length ? (
          <HrsUnavailable what="Ljestvica i rezultati" />
        ) : (
          standings.data.map((t) => (
            <LeagueTable
              key={t.competition.leagueId}
              teams={t.rows}
              title={t.competition.name}
              sourceUrl={t.competition.hrsUrl}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="players">
        {players.isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : players.isError ? (
          <HrsUnavailable what="Statistika igrača" />
        ) : players.data?.length ? (
          <PlayerStatsTable players={players.data} />
        ) : (
          <p className="text-muted-foreground">Statistika igrača još nije dostupna.</p>
        )}
      </TabsContent>
    </Tabs>
  );
}

// A season has 20+ matches, so only the first few are shown until "Prikaži sve" is pressed
// (keeps the page short on phones).
const INITIAL_MATCHES = 6;

function MatchList({ title, matches, empty }: { title: string; matches: HrsMatch[]; empty: string }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? matches : matches.slice(0, INITIAL_MATCHES);

  return (
    <section>
      <h2 className="section-title mb-6">{title}</h2>
      {matches.length === 0 ? (
        <p className="text-muted-foreground">{empty}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((m) => (
              <FixtureCard key={m.id} match={m} />
            ))}
          </div>
          {matches.length > INITIAL_MATCHES && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                className="rounded-full px-6 border-primary/30 text-primary"
                onClick={() => setShowAll((v) => !v)}
                data-testid={`button-toggle-${title}`}
              >
                {showAll ? "Prikaži manje" : `Prikaži sve (${matches.length})`}
                <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-40 w-full" />
      ))}
    </div>
  );
}
