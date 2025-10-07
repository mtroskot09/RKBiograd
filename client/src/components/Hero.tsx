import { Button } from "@/components/ui/button";
import { Calendar, Trophy, TrendingUp } from "lucide-react";
import { Link } from "wouter";

interface HeroProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  stats?: {
    nextMatch?: string;
    leaguePosition?: string;
    recentForm?: string;
  };
}

export default function Hero({ title, subtitle, imageSrc, stats }: HeroProps) {
  return (
    <div className="relative h-[500px] lg:h-[600px] w-full overflow-hidden rounded-lg">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      
      <div className="relative h-full flex flex-col justify-end p-6 md:p-12 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
          {subtitle}
        </p>

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 max-w-3xl">
            {stats.nextMatch && (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <div className="flex items-center space-x-2 text-white/70 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Sljedeća utakmica</span>
                </div>
                <div className="text-white font-semibold">{stats.nextMatch}</div>
              </div>
            )}
            {stats.leaguePosition && (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <div className="flex items-center space-x-2 text-white/70 mb-1">
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm">Pozicija</span>
                </div>
                <div className="text-white font-semibold">{stats.leaguePosition}</div>
              </div>
            )}
            {stats.recentForm && (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <div className="flex items-center space-x-2 text-white/70 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Forma</span>
                </div>
                <div className="text-white font-semibold">{stats.recentForm}</div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          <Link href="/first-team">
            <Button 
              size="lg" 
              className="bg-accent text-accent-foreground border border-accent-border hover:bg-accent"
              data-testid="hero-cta-team"
            >
              Pogledaj momčad
            </Button>
          </Link>
          <Link href="/contact">
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
              data-testid="hero-cta-contact"
            >
              Kontaktiraj nas
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
