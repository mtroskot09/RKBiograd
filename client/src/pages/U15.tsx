import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import youthImage from '@assets/generated_images/Youth_team_training_session_fbe701c2.png';

export default function U15() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative h-64 rounded-lg overflow-hidden mb-8">
            <img src={youthImage} alt="U15" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">U15</h1>
                <p className="text-white/90">Mladost i talent budućnosti</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">O ekipi</h2>
              <p className="text-muted-foreground mb-4">
                U15 selekcija RK Biograd je temelj budućnosti našeg kluba. Mladi igrači razvijaju vještine, 
                timski duh i ljubav prema rukometu pod vodstvom iskusnog stručnog tima.
              </p>
              <p className="text-muted-foreground">
                Natječemo se u 1. HRL U15 ligi gdje pokazujemo odlične rezultate i kontinuirani napredak.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Treninzi</h2>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <span className="font-semibold">Ponedjeljak</span>
                  <span className="text-muted-foreground">17:00 - 18:30</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <span className="font-semibold">Srijeda</span>
                  <span className="text-muted-foreground">17:00 - 18:30</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <span className="font-semibold">Petak</span>
                  <span className="text-muted-foreground">17:00 - 18:30</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <p className="text-sm"><span className="font-semibold">Trener:</span> Petar Jurić</p>
              </div>
            </Card>
          </div>

          <section className="mt-12">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Najnoviji uspjesi</h2>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-accent rounded-full mt-2"></div>
                  <div>
                    <div className="font-semibold">1. mjesto - Turnir u Zadru</div>
                    <div className="text-sm text-muted-foreground">Listopad 2025.</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-accent rounded-full mt-2"></div>
                  <div>
                    <div className="font-semibold">Niz od 5 uzastopnih pobjeda</div>
                    <div className="text-sm text-muted-foreground">Rujan - Listopad 2025.</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-accent rounded-full mt-2"></div>
                  <div>
                    <div className="font-semibold">Najbolja obrana u ligi</div>
                    <div className="text-sm text-muted-foreground">Sezona 2025/26</div>
                  </div>
                </li>
              </ul>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
