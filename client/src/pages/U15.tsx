import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Card } from "@/components/ui/card";
import TeamHrsSection from "@/components/TeamHrsSection";
import TeamSeasonStats from "@/components/TeamSeasonStats";
import TeamStaff from "@/components/TeamStaff";
import TeamTrainings from "@/components/TeamTrainings";
import { usePageBanner } from "@/lib/pageBanners";

export default function U15() {
  const bannerImage = usePageBanner("u15");
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageBanner title="U15" eyebrow="RK Biograd · Mlađe selekcije" subtitle="Mladost i talent budućnosti" imageSrc={bannerImage} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold uppercase text-primary mb-4">O ekipi</h2>
              <p className="text-muted-foreground mb-4">
                U15 selekcija RK Biograd je temelj budućnosti našeg kluba. Mladi igrači razvijaju vještine, 
                timski duh i ljubav prema rukometu pod vodstvom iskusnog stručnog tima.
              </p>
              <p className="text-muted-foreground">
                Natječemo se u 1. HRL U15 ligi gdje pokazujemo odlične rezultate i kontinuirani napredak.
              </p>
              <TeamSeasonStats team="u15" />
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold uppercase text-primary mb-4">Treninzi</h2>
              <TeamTrainings team="u15" />
              <TeamStaff team="u15" variant="compact" />
            </Card>
          </div>

          <section className="mt-12">
            <TeamHrsSection team="u15" />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
