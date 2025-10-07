import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

interface FixtureCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time?: string;
  location: string;
  status: "upcoming" | "live" | "finished";
}

export default function FixtureCard({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  date,
  time,
  location,
  status
}: FixtureCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "live":
        return <Badge className="bg-red-500 text-white animate-pulse">UŽIVO</Badge>;
      case "finished":
        return <Badge variant="secondary">ZAVRŠENO</Badge>;
      case "upcoming":
        return <Badge className="bg-accent text-accent-foreground">PREDSTOJI</Badge>;
    }
  };

  const getScoreColor = (isHome: boolean, homeScore?: number, awayScore?: number) => {
    if (homeScore === undefined || awayScore === undefined) return "";
    if (homeScore === awayScore) return "text-muted-foreground";
    if ((isHome && homeScore > awayScore) || (!isHome && awayScore > homeScore)) {
      return "text-green-600 dark:text-green-400 font-bold";
    }
    return "text-muted-foreground";
  };

  return (
    <Card className="p-6" data-testid="fixture-card">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
          {time && <span>• {time}</span>}
        </div>
        {getStatusBadge()}
      </div>

      <div className="grid grid-cols-3 items-center gap-4 mb-4">
        <div className="text-right">
          <div className="font-semibold">{homeTeam}</div>
        </div>
        <div className="text-center">
          {status === "upcoming" ? (
            <div className="text-2xl font-bold text-muted-foreground">VS</div>
          ) : (
            <div className="text-3xl font-bold font-mono">
              <span className={getScoreColor(true, homeScore, awayScore)}>{homeScore}</span>
              <span className="mx-2">:</span>
              <span className={getScoreColor(false, homeScore, awayScore)}>{awayScore}</span>
            </div>
          )}
        </div>
        <div className="text-left">
          <div className="font-semibold">{awayTeam}</div>
        </div>
      </div>

      <div className="flex items-center justify-center text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 mr-1" />
        <span>{location}</span>
      </div>
    </Card>
  );
}
