import { Card } from "@/components/ui/card";
import type { HrsStanding } from "@shared/hrs";
import TeamLogo from "@/components/TeamLogo";
import { cn } from "@/lib/utils";

interface LeagueTableProps {
  teams: HrsStanding[];
  title?: string;
  sourceUrl?: string;
}

const th = "py-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground";
const td = "py-3 px-2 text-sm font-mono tabular-nums";

export default function LeagueTable({ teams, title = "Ljestvica", sourceUrl }: LeagueTableProps) {
  return (
    <Card className="p-4 sm:p-6 overflow-hidden">
      <h2 className="text-2xl font-bold uppercase text-primary mb-4">{title}</h2>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full" data-testid="league-table">
          <thead>
            <tr className="border-b bg-muted/60">
              <th className={cn(th, "text-left pl-4 sm:pl-3 w-10")}>#</th>
              <th className={cn(th, "text-left")}>Ekipa</th>
              <th className={cn(th, "text-center")}>O</th>
              <th className={cn(th, "text-center hidden md:table-cell")}>P</th>
              <th className={cn(th, "text-center hidden md:table-cell")}>N</th>
              <th className={cn(th, "text-center hidden md:table-cell")}>I</th>
              <th className={cn(th, "text-center hidden lg:table-cell")}>DG</th>
              <th className={cn(th, "text-center hidden lg:table-cell")}>PG</th>
              <th className={cn(th, "text-center hidden sm:table-cell")}>GR</th>
              <th className={cn(th, "text-center pr-4 sm:pr-3")}>B</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr
                key={team.position}
                className={cn(
                  "border-b last:border-b-0 transition-colors",
                  team.isOurTeam ? "bg-accent/15 font-semibold" : "hover:bg-muted/50",
                )}
                data-testid={`table-row-${team.position}`}
              >
                <td className={cn("py-3 px-2 pl-4 sm:pl-3 text-sm", team.isOurTeam && "border-l-4 border-accent")}>
                  <span
                    className={cn(
                      "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                      team.isOurTeam ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                    )}
                  >
                    {team.position}
                  </span>
                </td>
                <td className="py-3 px-2 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <TeamLogo src={team.logoUrl} name={team.team} className="h-7 w-7" />
                    <span className={cn("truncate", team.isOurTeam && "text-primary")}>{team.team}</span>
                  </div>
                </td>
                <td className={cn(td, "text-center")}>{team.played}</td>
                <td className={cn(td, "text-center hidden md:table-cell")}>{team.won}</td>
                <td className={cn(td, "text-center hidden md:table-cell")}>{team.draw}</td>
                <td className={cn(td, "text-center hidden md:table-cell")}>{team.lost}</td>
                <td className={cn(td, "text-center hidden lg:table-cell")}>{team.goalsFor}</td>
                <td className={cn(td, "text-center hidden lg:table-cell")}>{team.goalsAgainst}</td>
                <td
                  className={cn(
                    td,
                    "text-center hidden sm:table-cell",
                    team.goalDiff > 0 ? "text-primary font-semibold" : team.goalDiff < 0 ? "text-muted-foreground" : "",
                  )}
                >
                  {team.goalDiff > 0 ? "+" : ""}
                  {team.goalDiff}
                </td>
                <td className={cn(td, "text-center font-bold text-primary pr-4 sm:pr-3")}>{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-muted-foreground">
        O = Odigrano | P = Pobjeda | N = Neriješeno | I = Izgubljeno | DG = Dani golovi | PG = Primljeni golovi | GR = Gol razlika | B = Bodovi
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        Izvor:{" "}
        {sourceUrl ? (
          <a href={sourceUrl} target="_blank" rel="noreferrer" className="underline hover:text-primary">
            Hrvatski rukometni savez
          </a>
        ) : (
          "Hrvatski rukometni savez"
        )}
      </div>
    </Card>
  );
}
