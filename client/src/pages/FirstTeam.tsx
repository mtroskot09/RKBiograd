import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Card } from "@/components/ui/card";
import TeamHrsSection from "@/components/TeamHrsSection";
import TeamSeasonStats from "@/components/TeamSeasonStats";
import TeamStaff from "@/components/TeamStaff";
import { TeamTrainingsCard } from "@/components/TeamTrainings";
import { usePageBanner } from "@/lib/pageBanners";

export default function FirstTeam() {
  const bannerImage = usePageBanner("first-team");
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageBanner title="Prva ekipa" eyebrow="RK Biograd · Seniori" subtitle="2. HRL Jug – svim srcem za Biograd" imageSrc={bannerImage} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <h2 className="text-2xl font-bold uppercase text-primary mb-4">O momčadi</h2>
              <p className="text-muted-foreground mb-4">
                Seniorska ekipa RK Biograd trenutno se natječe u 2. HRL Jug ligi.
              </p>
              <TeamSeasonStats team="senior" />
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold uppercase text-primary mb-4">Trenerski stožer</h2>
              <TeamStaff team="senior" />
            </Card>

            <TeamTrainingsCard team="senior" />
          </div>

          <TeamHrsSection team="senior" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
