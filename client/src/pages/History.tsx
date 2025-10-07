import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Calendar } from "lucide-react";

export default function History() {
  const milestones = [
    { year: "2025", title: "Plasman u 2. HRL Jug - 3. mjesto", description: "Najbolji plasman u posljednjih 5 godina" },
    { year: "2020", title: "Renovacija sportske dvorane", description: "Modernizacija infrastrukture za mlade igrače" },
    { year: "2015", title: "Osnivanje mladih selekcija", description: "Pokretanje programa razvoja mladih talenta" },
    { year: "2010", title: "Ulazak u 2. HRL", description: "Povijesni uspjeh i plasman u viši rang" },
    { year: "1998", title: "Osnivanje kluba", description: "RK Biograd službeno osnovan" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Povijest RK Biograd</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Od osnivanja 1998. godine, RK Biograd je postao stub rukometne zajednice u Biogradu na Moru. 
              Naša povijest je ispunjena strašću, posvećenošću i rastom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-primary mb-2">27</div>
              <div className="text-muted-foreground">Godina tradicije</div>
            </Card>
            <Card className="p-6 text-center">
              <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-primary mb-2">12</div>
              <div className="text-muted-foreground">Osvojenih turnira</div>
            </Card>
            <Card className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-primary mb-2">200+</div>
              <div className="text-muted-foreground">Članova kluba</div>
            </Card>
          </div>

          <section>
            <h2 className="text-3xl font-bold mb-8">Ključni događaji</h2>
            <div className="space-y-8">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {milestone.year}
                    </div>
                    {idx !== milestones.length - 1 && (
                      <div className="w-0.5 flex-1 bg-border mt-2"></div>
                    )}
                  </div>
                  <Card className="flex-1 p-6 mb-4">
                    <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </Card>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <Card className="p-8 bg-primary/5">
              <h2 className="text-2xl font-bold mb-4">Naša misija</h2>
              <p className="text-muted-foreground">
                RK Biograd nije samo rukometni klub - mi smo zajednica koja njeguje vrijednosti sporta, 
                timskog duha i predanosti. Naš cilj je razvijati mlade talente, dostizati vrhunske rezultate 
                i predstavljati Biograd na Moru s ponosom i dignitetom. Svaki igrač, trener i navijač dio je 
                naše velike obitelji.
              </p>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
