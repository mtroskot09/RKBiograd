import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import NewsCard from "@/components/NewsCard";
import LeagueTable from "@/components/LeagueTable";
import FixtureCard from "@/components/FixtureCard";
import heroImage from '@assets/generated_images/Handball_game_action_shot_0ef2ef52.png';
import teamImage from '@assets/generated_images/Team_celebration_victory_shot_e3f6592a.png';
import youthImage from '@assets/generated_images/Youth_team_training_session_fbe701c2.png';

export default function Home() {
  const mockNews = [
    {
      id: "1",
      title: "Uvjerljiva pobjeda protiv rivala - 32:24",
      excerpt: "U sjajnoj atmosferi dvorane, naši rukometaši upisali su uvjerljivu pobjedu protiv RK Split rezultatom 32:24. Od samog početka...",
      date: "5. listopada 2025.",
      category: "Prva ekipa",
      imageSrc: teamImage
    },
    {
      id: "2",
      title: "Mladi Biogradci dominiraju na turniru",
      excerpt: "Naša U15 selekcija osvojila je prvo mjesto na turniru u Zadru. Fantastična igra mladih igrača...",
      date: "2. listopada 2025.",
      category: "U15",
      imageSrc: youthImage
    },
    {
      id: "3",
      title: "Početak nove sezone - više od rukometa",
      excerpt: "RK Biograd službeno je otvorio novu sezonu s jasnom vizijom i ciljevima. Klub ulazi u razdoblje...",
      date: "27. rujna 2025.",
      category: "Novosti",
      imageSrc: heroImage
    }
  ];

  const mockLeagueTable = [
    { position: 1, team: "RK Zagreb", played: 8, won: 7, draw: 1, lost: 0, goalsFor: 245, goalsAgainst: 198, goalDiff: 47, points: 22 },
    { position: 2, team: "RK Split", played: 8, won: 6, draw: 1, lost: 1, goalsFor: 228, goalsAgainst: 205, goalDiff: 23, points: 19 },
    { position: 3, team: "RK Biograd", played: 8, won: 5, draw: 2, lost: 1, goalsFor: 215, goalsAgainst: 198, goalDiff: 17, points: 17, isOurTeam: true },
    { position: 4, team: "RK Zadar", played: 8, won: 4, draw: 2, lost: 2, goalsFor: 210, goalsAgainst: 208, goalDiff: 2, points: 14 },
    { position: 5, team: "RK Dubrovnik", played: 8, won: 3, draw: 1, lost: 4, goalsFor: 198, goalsAgainst: 215, goalDiff: -17, points: 10 },
    { position: 6, team: "RK Šibenik", played: 8, won: 2, draw: 2, lost: 4, goalsFor: 190, goalsAgainst: 220, goalDiff: -30, points: 8 },
  ];

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
              nextMatch: "15.10. vs RK Zadar",
              leaguePosition: "3. mjesto",
              recentForm: "P-P-N-P-P"
            }}
          />

          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Najnovije vijesti</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockNews.map(news => (
                <NewsCard key={news.id} {...news} />
              ))}
            </div>
          </section>

          <section className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-8">Sljedeće utakmice</h2>
              <div className="space-y-4">
                <FixtureCard
                  homeTeam="RK Zadar"
                  awayTeam="RK Biograd"
                  date="15. listopada 2025."
                  time="18:00"
                  location="Sportska dvorana Zadar"
                  status="upcoming"
                />
                <FixtureCard
                  homeTeam="RK Biograd"
                  awayTeam="RK Dubrovnik"
                  date="22. listopada 2025."
                  time="19:00"
                  location="Sportska dvorana Biograd"
                  status="upcoming"
                />
              </div>
            </div>

            <div>
              <LeagueTable teams={mockLeagueTable} title="2. HRL Jug - Ljestvica" />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
