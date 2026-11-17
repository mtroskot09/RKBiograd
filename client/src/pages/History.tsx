import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Trophy, Users, Star, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CLUB_MOTTO } from "@/lib/club";
import type { HistoryPage, HistoryPhoto } from "@shared/schema";
import { usePageBanner } from "@/lib/pageBanners";

const STAT_ICONS = [Calendar, Trophy, Users, Star];
// Written out in full so Tailwind generates these classes.
const STAT_COLUMNS: Record<number, string> = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

// Content is edited in Admin → History.
export default function History() {
  const bannerImage = usePageBanner("history");
  const { data, isLoading } = useQuery<HistoryPage>({ queryKey: ["/api/history"] });
  const [openPhoto, setOpenPhoto] = useState<HistoryPhoto | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageBanner title="Povijest RK Biograd" eyebrow="Naš klub · od 1963." subtitle={data?.content.intro} imageSrc={bannerImage} />

          {isLoading || !data ? (
            <div className="space-y-6">
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <>
              {data.content.stats.length > 0 && (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 ${STAT_COLUMNS[data.content.stats.length] ?? ""} gap-4 md:gap-6 mb-14`}
                  data-testid="history-stats"
                >
                  {data.content.stats.map((stat, i) => {
                    const Icon = STAT_ICONS[i % STAT_ICONS.length];
                    return (
                      <Card key={i} className="card-hover p-6 text-center">
                        <Icon className="h-14 w-14 p-3 rounded-full bg-secondary text-primary ring-2 ring-accent/40 mx-auto mb-4" />
                        <div className="font-display text-5xl font-extrabold text-primary leading-none mb-2">{stat.value}</div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</div>
                      </Card>
                    );
                  })}
                </div>
              )}

              {data.events.length > 0 && (
                <section>
                  <h2 className="section-title mb-8">Ključni događaji</h2>
                  <ol className="space-y-6 sm:space-y-8" data-testid="history-timeline">
                    {data.events.map((event, index) => (
                      <li key={event.id} className="relative pl-10 sm:pl-14">
                        {/* Line from this dot's centre to the next dot's centre (same offset in the next item,
                            one item height + the list gap further down), so it starts and ends at the dots. */}
                        {index < data.events.length - 1 && (
                          <span
                            className="absolute left-3 sm:left-4 w-1 bg-accent/40 top-[2.125rem] sm:top-[2.375rem] h-[calc(100%+1.5rem)] sm:h-[calc(100%+2rem)]"
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className="absolute left-0 top-5 h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-brand-gradient ring-4 ring-accent/30"
                          aria-hidden="true"
                        />
                        <Card className="card-hover overflow-hidden border-l-4 border-l-accent">
                          <div className={event.imageSrc ? "grid md:grid-cols-[1fr_280px]" : ""}>
                            <div className="p-5 sm:p-6">
                              <span className="inline-block rounded-full bg-primary px-3 py-1 font-display text-lg font-bold text-primary-foreground mb-3">
                                {event.year}
                              </span>
                              <h3 className="font-display text-2xl font-bold uppercase text-primary mb-1">{event.title}</h3>
                              {event.description && (
                                <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
                              )}
                            </div>
                            {event.imageSrc && (
                              <img
                                src={event.imageSrc}
                                alt={event.title}
                                loading="lazy"
                                className="h-56 md:h-full w-full object-cover"
                              />
                            )}
                          </div>
                        </Card>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {data.photos.length > 0 && (
                <section className="mt-14">
                  <h2 className="section-title mb-8">Galerija</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4" data-testid="history-gallery">
                    {data.photos.map((photo) => (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => setOpenPhoto(photo)}
                        className="group relative aspect-square overflow-hidden rounded-xl bg-muted shadow-sm"
                        data-testid={`button-photo-${photo.id}`}
                      >
                        <img
                          src={photo.imageSrc}
                          alt={photo.caption || "Fotografija iz povijesti kluba"}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {photo.caption && (
                          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[hsl(232_85%_10%/0.85)] to-transparent p-2 pt-8 text-left text-xs sm:text-sm font-medium text-white line-clamp-2">
                            {photo.caption}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {data.content.mission && (
                <section className="mt-14">
                  <Card className="p-6 sm:p-8 bg-secondary/60 border-accent/30">
                    <h2 className="text-2xl font-bold uppercase text-primary mb-4">Naša misija</h2>
                    <p className="text-muted-foreground whitespace-pre-line">{data.content.mission}</p>
                    <p className="mt-6 text-xl font-bold tracking-wide text-primary" data-testid="text-history-motto">
                      {CLUB_MOTTO}
                    </p>
                  </Card>
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />

      <Dialog open={!!openPhoto} onOpenChange={(open) => !open && setOpenPhoto(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-[hsl(232_85%_10%)] border-0 [&>button]:hidden">
          <DialogTitle className="sr-only">{openPhoto?.caption || "Fotografija"}</DialogTitle>
          {openPhoto && (
            <figure>
              <img src={openPhoto.imageSrc} alt={openPhoto.caption} className="max-h-[80vh] w-full object-contain" />
              {openPhoto.caption && (
                <figcaption className="p-4 text-center text-sm text-white/90">{openPhoto.caption}</figcaption>
              )}
            </figure>
          )}
          <button
            type="button"
            onClick={() => setOpenPhoto(null)}
            className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            aria-label="Zatvori"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
