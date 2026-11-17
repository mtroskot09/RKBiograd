import { Link } from "wouter";
import { Home } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-brand-gradient p-8 md:p-12 text-center text-white shadow-xl shadow-primary/20">
          <img src="/rk-biograd-logo-192.png" alt="" aria-hidden="true" className="mx-auto mb-6 h-24 w-auto drop-shadow" />
          <h1 className="font-display text-7xl md:text-8xl font-extrabold text-accent leading-none mb-2">404</h1>
          <h2 className="font-display text-3xl font-bold uppercase mb-3">Stranica nije pronađena</h2>
          <p className="text-white/80 mb-8">Stranica koju tražite ne postoji ili je premještena.</p>
          <Button asChild variant="accent" size="lg" className="rounded-full px-8" data-testid="button-home">
            <Link href="/">
              <Home className="h-4 w-4" />
              Povratak na početnu
            </Link>
          </Button>
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-accent" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
