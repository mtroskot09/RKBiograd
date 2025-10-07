import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import youthImage from '@assets/generated_images/Youth_team_training_session_fbe701c2.png';

export default function U13() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative h-64 rounded-lg overflow-hidden mb-8">
            <img src={youthImage} alt="U13" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">U13</h1>
                <p className="text-white/90">Prvi koraci prema velikim uspjesima</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">O ekipi</h2>
              <p className="text-muted-foreground mb-4">
                U13 ekipa je naš najmlađi kadar koji već pokazuje veliki potencijal. Fokus je na 
                razvoju osnovnih rukometnih vještina, fair play i timskom duhu.
              </p>
              <p className="text-muted-foreground">
                Mladi igrači uče od najboljih i polako grade temelje za budućnost u RK Biograd.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Treninzi</h2>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <span className="font-semibold">Utorak</span>
                  <span className="text-muted-foreground">16:00 - 17:15</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <span className="font-semibold">Četvrtak</span>
                  <span className="text-muted-foreground">16:00 - 17:15</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <span className="font-semibold">Subota</span>
                  <span className="text-muted-foreground">10:00 - 11:15</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <p className="text-sm"><span className="font-semibold">Trener:</span> Luka Marić</p>
              </div>
            </Card>
          </div>

          <section className="mt-12">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Razvoj i napredak</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">18</div>
                  <div className="text-sm text-muted-foreground">Mladi igrača</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">3x</div>
                  <div className="text-sm text-muted-foreground">Treninzi tjedno</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Entuzijazam</div>
                </div>
              </div>
            </Card>
          </section>

          <section className="mt-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Pridruži se ekipi!</h2>
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
