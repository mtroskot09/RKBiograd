import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import teamImage from '@assets/generated_images/Team_celebration_victory_shot_e3f6592a.png';
import FixtureCard from "@/components/FixtureCard";

export default function FirstTeam() {
  const mockResults = [
    { homeTeam: "RK Biograd", awayTeam: "RK Split", homeScore: 32, awayScore: 24, date: "5. listopada 2025.", location: "Sportska dvorana Biograd", status: "finished" as const },
    { homeTeam: "RK Šibenik", awayTeam: "RK Biograd", homeScore: 25, awayScore: 28, date: "28. rujna 2025.", location: "Sportska dvorana Šibenik", status: "finished" as const },
    { homeTeam: "RK Biograd", awayTeam: "RK Zagreb", homeScore: 26, awayScore: 26, date: "21. rujna 2025.", location: "Sportska dvorana Biograd", status: "finished" as const },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative h-64 rounded-lg overflow-hidden mb-8">
            <img src={teamImage} alt="Prva ekipa" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Prva ekipa</h1>
                <p className="text-white/90">RK Biograd - Seniori</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">O momčadi</h2>
              <p className="text-muted-foreground mb-4">
                Seniorska ekipa RK Biograd trenutno se natječe u 2. HRL Jug ligi. Momčad predvođena iskusnim trenerom 
                Ivanom Kovačevićem pokazuje izvanredne rezultate ove sezone.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary">3.</div>
                  <div className="text-sm text-muted-foreground">Pozicija</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary">17</div>
                  <div className="text-sm text-muted-foreground">Bodova</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary">5</div>
                  <div className="text-sm text-muted-foreground">Pobjeda</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary">+17</div>
                  <div className="text-sm text-muted-foreground">Gol razlika</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Trenerski stožer</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                    IK
                  </div>
                  <div>
                    <div className="font-semibold">Ivan Kovačević</div>
                    <div className="text-sm text-muted-foreground">Glavni trener</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                    MP
                  </div>
                  <div>
                    <div className="font-semibold">Marko Pavlović</div>
                    <div className="text-sm text-muted-foreground">Pomoćni trener</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <section>
            <h2 className="text-3xl font-bold mb-6">Posljednji rezultati</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockResults.map((result, idx) => (
                <FixtureCard key={idx} {...result} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
