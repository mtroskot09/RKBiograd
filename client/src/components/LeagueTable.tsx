import { Card } from "@/components/ui/card";

interface TeamRow {
  position: number;
  team: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  isOurTeam?: boolean;
}

interface LeagueTableProps {
  teams: TeamRow[];
  title?: string;
}

export default function LeagueTable({ teams, title = "Ljestvica" }: LeagueTableProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full" data-testid="league-table">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2 text-sm font-semibold">#</th>
              <th className="text-left py-3 px-2 text-sm font-semibold">Ekipa</th>
              <th className="text-center py-3 px-2 text-sm font-semibold hidden sm:table-cell">O</th>
              <th className="text-center py-3 px-2 text-sm font-semibold hidden md:table-cell">P</th>
              <th className="text-center py-3 px-2 text-sm font-semibold hidden md:table-cell">N</th>
              <th className="text-center py-3 px-2 text-sm font-semibold hidden md:table-cell">I</th>
              <th className="text-center py-3 px-2 text-sm font-semibold hidden lg:table-cell">DG</th>
              <th className="text-center py-3 px-2 text-sm font-semibold hidden lg:table-cell">PG</th>
              <th className="text-center py-3 px-2 text-sm font-semibold hidden sm:table-cell">GR</th>
              <th className="text-center py-3 px-2 text-sm font-semibold">B</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr
                key={team.position}
                className={`border-b transition-colors ${
                  team.isOurTeam 
                    ? "bg-primary/10 font-semibold" 
                    : "hover:bg-muted/50"
                }`}
                data-testid={`table-row-${team.position}`}
              >
                <td className="py-3 px-2 text-sm">{team.position}</td>
                <td className="py-3 px-2 text-sm">{team.team}</td>
                <td className="text-center py-3 px-2 text-sm font-mono hidden sm:table-cell">{team.played}</td>
                <td className="text-center py-3 px-2 text-sm font-mono hidden md:table-cell">{team.won}</td>
                <td className="text-center py-3 px-2 text-sm font-mono hidden md:table-cell">{team.draw}</td>
                <td className="text-center py-3 px-2 text-sm font-mono hidden md:table-cell">{team.lost}</td>
                <td className="text-center py-3 px-2 text-sm font-mono hidden lg:table-cell">{team.goalsFor}</td>
                <td className="text-center py-3 px-2 text-sm font-mono hidden lg:table-cell">{team.goalsAgainst}</td>
                <td className={`text-center py-3 px-2 text-sm font-mono hidden sm:table-cell ${
                  team.goalDiff > 0 ? "text-green-600 dark:text-green-400" : 
                  team.goalDiff < 0 ? "text-red-600 dark:text-red-400" : ""
                }`}>
                  {team.goalDiff > 0 ? "+" : ""}{team.goalDiff}
                </td>
                <td className="text-center py-3 px-2 text-sm font-mono font-bold">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-muted-foreground">
        O = Odigrano | P = Pobjeda | N = Neriješeno | I = Izgubljeno | DG = Dani golovi | PG = Primljeni golovi | GR = Gol razlika | B = Bodovi
      </div>
    </Card>
  );
}
