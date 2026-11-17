import { Link } from "wouter";
import { Home, LogIn, ShieldAlert } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

// Shown after a Replit login with an account that is not in ADMIN_EMAILS (or a failed login).
export default function AccessDenied() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-brand-gradient p-8 md:p-12 text-center text-white shadow-xl shadow-primary/20">
          <ShieldAlert className="mx-auto mb-4 h-14 w-14 text-accent" />
          <h1 className="font-display text-4xl md:text-5xl font-extrabold uppercase leading-none mb-3">Pristup odbijen</h1>
          <p className="text-white/85 mb-2">Ovaj račun nema pristup administraciji stranice.</p>
          <p className="text-sm text-white/60 mb-8">
            Ako ste administrator kluba, prijavite se s računom čija je e-mail adresa na popisu administratora.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button asChild variant="accent" size="lg" className="rounded-full px-8" data-testid="button-home">
              <Link href="/">
                <Home className="h-4 w-4" />
                Na početnu
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-8 bg-white/10 border-white/40 text-white hover:bg-white/20"
              data-testid="button-login-again"
            >
              {/* Full page load: the login is handled by the server */}
              <a href="/api/login">
                <LogIn className="h-4 w-4" />
                Prijava drugim računom
              </a>
            </Button>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-accent" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
