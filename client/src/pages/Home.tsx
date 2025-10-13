import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import NewsCard from "@/components/NewsCard";
import LeagueTable from "@/components/LeagueTable";
import FixtureCard from "@/components/FixtureCard";
import { Skeleton } from "@/components/ui/skeleton";
import heroImage from '@assets/generated_images/Handball_game_action_shot_0ef2ef52.png';
import type { Post, LeagueTableRow, Fixture } from "@shared/schema";

export default function Home() {
  const { data: allPosts, isLoading: isLoadingPosts } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const { data: leagueTableData, isLoading: isLoadingLeagueTable } = useQuery<LeagueTableRow[]>({
    queryKey: ["/api/league-table"],
  });

  const { data: allFixtures, isLoading: isLoadingFixtures } = useQuery<Fixture[]>({
    queryKey: ["/api/fixtures"],
  });

  const recentPosts = allPosts?.slice(0, 3) || [];
  const upcomingFixtures = allFixtures?.filter(f => f.status === "upcoming" && f.category === "Prva ekipa").slice(0, 2) || [];
  const ourTeam = leagueTableData?.find(team => team.isOurTeam);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Hero
            title="RK Biograd - Snaga i strast"
            subtitle="Pratite našu putanju kroz sezonu. Pobjede, timski duh i nevjerojatna podrška navijača."
            imageSrc={heroImage}
            stats={{
              nextMatch: upcomingFixtures[0] ? `${upcomingFixtures[0].date} vs ${upcomingFixtures[0].homeTeam === "RK Biograd" ? upcomingFixtures[0].awayTeam : upcomingFixtures[0].homeTeam}` : "Nema utakmica",
              leaguePosition: ourTeam ? `${ourTeam.position}. mjesto` : "-",
              recentForm: "P-P-N-P-P"
            }}
          />

          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Najnovije vijesti</h2>
            {isLoadingPosts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : recentPosts.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">Nema objavljenih vijesti.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map(news => (
                  <NewsCard 
                    key={news.id} 
                    id={news.id}
                    title={news.title}
                    excerpt={news.excerpt}
                    date={new Date(news.publishedAt).toLocaleDateString('hr-HR', { day: 'numeric', month: 'long', year: 'numeric' }) + '.'}
                    category={news.category}
                    imageSrc={news.imageSrc || heroImage}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-8">Sljedeće utakmice</h2>
              {isLoadingFixtures ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : upcomingFixtures.length === 0 ? (
                <p className="text-muted-foreground">Nema predstojećih utakmica.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingFixtures.map((fixture) => (
                    <FixtureCard
                      key={fixture.id}
                      homeTeam={fixture.homeTeam}
                      awayTeam={fixture.awayTeam}
                      date={fixture.date}
                      time={fixture.time ?? undefined}
                      location={fixture.location}
                      status={fixture.status as "upcoming" | "live" | "finished"}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              {isLoadingLeagueTable ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-96 w-full" />
                </div>
              ) : leagueTableData && leagueTableData.length > 0 ? (
                <LeagueTable teams={leagueTableData} title="2. HRL Jug - Ljestvica" />
              ) : (
                <div>
                  <h2 className="text-3xl font-bold mb-8">2. HRL Jug - Ljestvica</h2>
                  <p className="text-muted-foreground">Ljestvica nije dostupna.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
