import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Card } from "@/components/ui/card";
import TeamHrsSection from "@/components/TeamHrsSection";
import TeamSeasonStats from "@/components/TeamSeasonStats";
import TeamStaff from "@/components/TeamStaff";
import TeamTrainings from "@/components/TeamTrainings";
import { usePageBanner } from "@/lib/pageBanners";

export default function U13() {
  const bannerImage = usePageBanner("u13");
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageBanner title="U13" eyebrow="RK Biograd · Mlađe selekcije" subtitle="Prvi koraci prema velikim uspjesima" imageSrc={bannerImage} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold uppercase text-primary mb-4">O ekipi</h2>
              <p className="text-muted-foreground mb-4">
                U13 ekipa je naš najmlađi kadar koji već pokazuje veliki potencijal. Fokus je na 
                razvoju osnovnih rukometnih vještina, fair play i timskom duhu.
              </p>
              <p className="text-muted-foreground">
                Mladi igrači uče od najboljih i polako grade temelje za budućnost u RK Biograd.
              </p>
              <TeamSeasonStats team="u13" />
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold uppercase text-primary mb-4">Treninzi</h2>
              <TeamTrainings team="u13" />
              <TeamStaff team="u13" variant="compact" />
            </Card>
          </div>

          <section className="mt-12">
            <TeamHrsSection team="u13" />
          </section>

          <section className="mt-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold uppercase text-primary mb-4">Pridruži se ekipi!</h2>
              <p className="text-muted-foreground mb-4">
                Tražimo nove talente! Ako voliš rukomet i imaš 12-13 godina, pridruži se našoj ekipi.
              </p>
              <p className="text-sm text-muted-foreground">
                Za više informacija kontaktirajte nas na info@rkbiograd.hr ili dođite na trening u Sportsku dvoranu Biograd.
              </p>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
