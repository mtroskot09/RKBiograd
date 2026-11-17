import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import NewsCard, { NewsEmpty } from "@/components/NewsCard";
import LeagueTable from "@/components/LeagueTable";
import FixtureCard from "@/components/FixtureCard";
import HrsUnavailable from "@/components/HrsUnavailable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import heroImage from '@assets/generated_images/Handball_game_action_shot_0ef2ef52.png';
import type { Post } from "@shared/schema";
import { useHrsMatches, useHrsStandings } from "@/hooks/useHrs";
import { CLUB_MOTTO } from "@/lib/club";
import { formatDate, formatMatchDate, opponentOf, resultLetter, splitMatches } from "@/lib/hrsFormat";
import { usePageBanner } from "@/lib/pageBanners";

export default function Home() {
  const bannerImage = usePageBanner("home");
  const { data: allPosts, isLoading: isLoadingPosts } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });
  const standings = useHrsStandings("senior");
  const matches = useHrsMatches("senior");

  const recentPosts = allPosts?.slice(0, 3) || [];
  const { upcoming, results } = splitMatches(matches.data);
  const nextMatches = upcoming.slice(0, 2);
  const lastResult = results[0];
  const league = standings.data?.[0];
  const ourTeam = league?.rows.find(team => team.isOurTeam);
  const recentForm = results
    .slice(0, 5)
    .reverse()
    .map(resultLetter)
    .filter(Boolean)
    .join("-");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Hero
            title={CLUB_MOTTO}
            subtitle="Pratite našu putanju kroz sezonu. Pobjede, timski duh i nevjerojatna podrška navijača."
            imageSrc={bannerImage}
            stats={{
              nextMatch: nextMatches[0] ? `${formatMatchDate(nextMatches[0].startsAt)} vs ${opponentOf(nextMatches[0])}` : "Nema utakmica",
              leaguePosition: ourTeam ? `${ourTeam.position}. mjesto` : "-",
              recentForm: recentForm || "-"
            }}
          />

          <section className="mt-16">
            <div className="flex items-center justify-between gap-4 mb-8">
              <h2 className="section-title">Najnovije vijesti</h2>
              {recentPosts.length > 0 && (
                <Link href="/news">
                  <Button variant="outline" data-testid="button-all-news">Sve vijesti</Button>
                </Link>
              )}
            </div>
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
              <NewsEmpty />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map(news => (
                  <NewsCard
                    key={news.id}
                    id={news.id}
                    title={news.title}
                    excerpt={news.excerpt}
                    date={formatDate(news.publishedAt)}
                    category={news.category}
                    imageSrc={news.imageSrc || heroImage}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-12">
              <div>
                <h2 className="section-title mb-8">Sljedeće utakmice</h2>
                {matches.isLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-40 w-full" />
                    ))}
                  </div>
                ) : matches.isError ? (
                  <HrsUnavailable what="Utakmice" />
                ) : nextMatches.length === 0 ? (
                  <p className="text-muted-foreground">Nema predstojećih utakmica.</p>
                ) : (
                  <div className="space-y-4">
                    {nextMatches.map((match) => (
                      <FixtureCard key={match.id} match={match} />
                    ))}
                  </div>
                )}
              </div>

              {lastResult && (
                <div>
                  <h2 className="section-title mb-8">Zadnji rezultat</h2>
                  <FixtureCard match={lastResult} />
                </div>
              )}
            </div>

            <div>
              {standings.isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-96 w-full" />
                </div>
              ) : league && league.rows.length > 0 ? (
                <LeagueTable
                  teams={league.rows}
                  title={`${league.competition.name} - Ljestvica`}
                  sourceUrl={league.competition.hrsUrl}
                />
              ) : (
                <HrsUnavailable what="Ljestvica i rezultati" />
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
