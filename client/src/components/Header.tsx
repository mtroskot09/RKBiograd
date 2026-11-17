import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/", label: "Početna" },
  { path: "/first-team", label: "Prva ekipa" },
  { path: "/u15", label: "U15" },
  { path: "/u13", label: "U13" },
  { path: "/news", label: "Vijesti" },
  { path: "/history", label: "Povijest" },
  { path: "/contact", label: "Kontakt" },
];

// "/news/abc" keeps "Vijesti" highlighted; "/" only matches the home page itself.
const isActive = (location: string, path: string) =>
  path === "/" ? location === "/" : location === path || location.startsWith(path + "/");

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const items = isAuthenticated ? [...NAV_ITEMS, { path: "/admin", label: "Admin" }] : NAV_ITEMS;

  // Close the phone menu whenever the page changes.
  useEffect(() => setMobileMenuOpen(false), [location]);

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-gradient text-white shadow-lg shadow-primary/20">
      <div className="h-1 w-full bg-accent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 rounded-md -ml-1 px-1 py-1" data-testid="link-home-logo">
            <img
              src="/rk-biograd-logo-192.png"
              alt="RK Biograd grb"
              className="h-11 md:h-14 w-auto drop-shadow"
              data-testid="img-header-logo"
            />
            <div className="leading-tight">
              <div className="font-display text-xl md:text-2xl font-bold uppercase tracking-wide">RK Biograd</div>
              <div className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-accent">Rukometni klub</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Glavna navigacija">
            {items.map((item) => {
              const active = isActive(location, item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "relative px-3 py-2 text-sm font-semibold uppercase tracking-wide rounded-md transition-colors",
                    active ? "text-accent" : "text-white/85 hover:text-white hover:bg-white/10",
                  )}
                  aria-current={active ? "page" : undefined}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                  {active && <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-accent" />}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-white/10"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Zatvori izbornik" : "Otvori izbornik"}
            aria-expanded={mobileMenuOpen}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="lg:hidden border-t border-white/10 bg-primary/95 backdrop-blur" aria-label="Glavna navigacija">
          <div className="max-w-7xl mx-auto px-4 py-3 grid gap-1">
            {items.map((item) => {
              const active = isActive(location, item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center min-h-12 px-4 rounded-lg font-display text-xl font-semibold uppercase tracking-wide transition-colors",
                    active ? "bg-accent text-accent-foreground" : "text-white hover:bg-white/10",
                  )}
                  aria-current={active ? "page" : undefined}
                  data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
