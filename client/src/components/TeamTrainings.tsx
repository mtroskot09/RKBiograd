import { useQuery } from "@tanstack/react-query";
import type { HrsTeamKey } from "@shared/hrs";
import { TRAINING_DAYS, type TrainingSession } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function useTeamTrainings(team: HrsTeamKey) {
  const query = useQuery<TrainingSession[]>({ queryKey: ["/api/trainings"] });
  // The server returns sessions sorted by day and start time.
  return { ...query, sessions: query.data?.filter((s) => s.team === team) ?? [] };
}

interface TeamTrainingsProps {
  team: HrsTeamKey;
}

// Weekly training times of a team as set by an admin (Admin → Training Schedule).
export default function TeamTrainings({ team }: TeamTrainingsProps) {
  const { sessions, isLoading } = useTeamTrainings(team);

  if (isLoading) {
    return <Skeleton className="h-36 w-full" />;
  }

  if (sessions.length === 0) {
    return <p className="text-muted-foreground">Raspored treninga još nije objavljen.</p>;
  }

  return (
    <div className="space-y-3" data-testid="team-trainings">
      {sessions.map((s) => (
        <div key={s.id} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-secondary/70 border-l-4 border-accent">
          <span className="font-semibold text-primary">{TRAINING_DAYS[s.dayOfWeek - 1]}</span>
          <span className="font-mono tabular-nums text-foreground text-right">
            {s.startTime} - {s.endTime}
            {s.location && <span className="block font-sans text-xs text-muted-foreground">{s.location}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

/** "Treninzi" card that is only shown once the team has training times. */
export function TeamTrainingsCard({ team }: TeamTrainingsProps) {
  const { sessions } = useTeamTrainings(team);
  if (sessions.length === 0) return null;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold uppercase text-primary mb-4">Treninzi</h2>
      <TeamTrainings team={team} />
    </Card>
  );
}
