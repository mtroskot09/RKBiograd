import type { HrsTeamKey } from "@shared/hrs";
import { useHrsStandings } from "@/hooks/useHrs";

interface TeamSeasonStatsProps {
  team: HrsTeamKey;
}

// Position, points, wins and goal difference of our team in its (first) league table.
export default function TeamSeasonStats({ team }: TeamSeasonStatsProps) {
  const { data } = useHrsStandings(team);
  const ours = data?.[0]?.rows.find((r) => r.isOurTeam);

  const stats = [
    { label: "Pozicija", value: ours ? `${ours.position}.` : "–" },
    { label: "Bodova", value: ours ? ours.points : "–" },
    { label: "Pobjeda", value: ours ? ours.won : "–" },
    { label: "Gol razlika", value: ours ? `${ours.goalDiff > 0 ? "+" : ""}${ours.goalDiff}` : "–" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-6" data-testid="team-season-stats">
      {stats.map((s) => (
        <div key={s.label} className="text-center p-4 rounded-xl bg-secondary/70 ring-1 ring-accent/20">
          <div className="font-display text-4xl font-extrabold text-primary tabular-nums">{s.value}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
