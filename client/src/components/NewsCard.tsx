import { Calendar, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageSrc?: string;
}

export default function NewsCard({ id, title, excerpt, date, category, imageSrc }: NewsCardProps) {
  return (
    <Link href={`/news/${id}`} className="block h-full rounded-xl group">
      <Card className="card-hover overflow-hidden cursor-pointer h-full flex flex-col" data-testid={`news-card-${id}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-brand-gradient">
          {imageSrc && (
            <img
              src={imageSrc}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(232_85%_10%/0.6)] to-transparent" />
          <span className="absolute top-3 left-3 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-foreground">
            {category}
          </span>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            <Calendar className="h-4 w-4 mr-2 text-accent" />
            {date}
          </div>
          <h3 className="font-display text-2xl font-bold leading-tight text-primary mb-2 line-clamp-2">{title}</h3>
          <p className="text-muted-foreground line-clamp-3 flex-1">{excerpt}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Pročitaj više
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Card>
    </Link>
  );
}

/** Placeholder shown when no news has been published yet. */
export function NewsEmpty() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-accent/40 bg-secondary/40 py-12 px-6 text-center">
      <img src="/rk-biograd-logo-192.png" alt="" aria-hidden="true" className="mx-auto mb-3 h-14 w-auto opacity-60" />
      <p className="font-display text-xl font-bold uppercase text-primary">Uskoro nove vijesti</p>
      <p className="text-sm text-muted-foreground">Nema objavljenih vijesti.</p>
    </div>
  );
}
