import { Button } from "@/components/ui/button";
import { Calendar, Trophy, TrendingUp } from "lucide-react";
import { Link } from "wouter";

interface HeroProps {
  title: string;
  subtitle: string;
  /** Background photo; without it the hero shows the club gradient */
  imageSrc?: string;
  stats?: {
    nextMatch?: string;
    leaguePosition?: string;
    recentForm?: string;
  };
}

export default function Hero({ title, subtitle, imageSrc, stats }: HeroProps) {
  const statItems = [
    { icon: Calendar, label: "Sljedeća utakmica", value: stats?.nextMatch },
    { icon: Trophy, label: "Pozicija", value: stats?.leaguePosition },
    { icon: TrendingUp, label: "Forma", value: stats?.recentForm },
  ].filter((s) => s.value);

  return (
    // min-height instead of a fixed height, so the title is never cut off on small phones
    <section className="relative w-full overflow-hidden rounded-2xl bg-brand-gradient shadow-xl shadow-primary/20 min-h-[480px] lg:min-h-[600px] flex">
      {imageSrc && (
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${imageSrc})` }}
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(232_85%_10%)] via-[hsl(230_80%_18%/0.85)] to-[hsl(218_85%_32%/0.45)]" />
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-accent" />

      <div className="relative w-full flex flex-col justify-end gap-6 p-6 pt-16 md:p-12">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent ring-1 ring-accent/40">
            RK Biograd · Rukometni klub
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-extrabold uppercase leading-[0.95] text-white drop-shadow-lg">
            {title}
          </h1>
          <p className="mt-4 text-base md:text-xl text-white/85 max-w-2xl">{subtitle}</p>
        </div>

        {statItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
            {statItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl bg-white/10 backdrop-blur-md p-4 ring-1 ring-white/20">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-accent mb-1">
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </div>
                <div className="text-white font-semibold">{value}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" variant="accent" className="rounded-full px-8" data-testid="hero-cta-team">
            <Link href="/first-team">Pogledaj momčad</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full px-8 bg-white/10 backdrop-blur-md border-white/40 text-white hover:bg-white/20"
            data-testid="hero-cta-contact"
          >
            <Link href="/contact">Kontaktiraj nas</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
