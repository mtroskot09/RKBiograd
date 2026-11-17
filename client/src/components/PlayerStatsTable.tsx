import { Card } from "@/components/ui/card";
import type { HrsPlayerStats } from "@shared/hrs";

interface PlayerStatsTableProps {
  players: HrsPlayerStats[];
}

export default function PlayerStatsTable({ players }: PlayerStatsTableProps) {
  return (
    <Card className="p-4 sm:p-6 overflow-hidden">
      <h2 className="text-2xl font-bold uppercase text-primary mb-4">Igrači</h2>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full" data-testid="player-stats-table">
          <thead>
            <tr className="border-b bg-muted/60">
              <th className="text-left py-3 px-2 pl-4 sm:pl-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Igrač</th>
              <th className="text-center py-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Utk</th>
              <th className="text-center py-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Golovi</th>
              <th className="text-center py-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">7m</th>
              <th className="text-center py-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Ž</th>
              <th className="text-center py-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">2'</th>
              <th className="text-center py-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">C</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, index) => (
              <tr key={p.playerId} className="border-b last:border-b-0 hover:bg-muted/50" data-testid={`player-row-${p.playerId}`}>
                <td className="py-3 px-2 pl-4 sm:pl-3 text-sm">
                  <div className="flex items-center gap-3">
                    {p.photoUrl ? (
                      <img
                        src={p.photoUrl}
                        alt=""
                        loading="lazy"
                        className="h-9 w-9 rounded-full object-cover shrink-0 ring-2 ring-accent/40"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-secondary text-primary text-xs font-bold flex items-center justify-center shrink-0">
                        {p.firstName.charAt(0)}
                        {p.lastName.charAt(0)}
                      </div>
                    )}
                    <span className="font-medium">
                      {p.firstName} {p.lastName}
                    </span>
                    {index === 0 && p.goals > 0 && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                        Strijelac
                      </span>
                    )}
                  </div>
                </td>
                <td className="text-center py-3 px-2 text-sm font-mono tabular-nums">{p.matches}</td>
                <td className="text-center py-3 px-2 text-sm font-mono tabular-nums font-bold text-primary">{p.goals}</td>
                <td className="text-center py-3 px-2 text-sm font-mono tabular-nums hidden md:table-cell">
                  {p.sevenMeterShots > 0 ? `${p.sevenMeterGoals}/${p.sevenMeterShots}` : "–"}
                </td>
                <td className="text-center py-3 px-2 text-sm font-mono tabular-nums hidden md:table-cell">{p.yellowCards}</td>
                <td className="text-center py-3 px-2 text-sm font-mono tabular-nums hidden md:table-cell">{p.suspensions}</td>
                <td className="text-center py-3 px-2 text-sm font-mono tabular-nums hidden md:table-cell">{p.redCards}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-muted-foreground">
        Utk = Utakmice | 7m = Sedmerci (golovi/pokušaji) | Ž = Žuti kartoni | 2' = Isključenja | C = Crveni kartoni
      </div>
      <div className="mt-2 text-xs text-muted-foreground">Izvor: Hrvatski rukometni savez</div>
    </Card>
  );
}
