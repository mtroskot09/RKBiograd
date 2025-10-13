import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const navItems = [
    { path: "/", label: "Početna" },
    { path: "/first-team", label: "Prva ekipa" },
    { path: "/u15", label: "U15" },
    { path: "/u13", label: "U13" },
    { path: "/history", label: "Povijest" },
    { path: "/contact", label: "Kontakt" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover-elevate active-elevate-2 rounded-md px-2 -ml-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              RK
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold">RK Biograd</div>
              <div className="text-xs text-muted-foreground">Rukometni klub</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={location === item.path ? "bg-accent text-accent-foreground" : ""}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            {isAuthenticated && (
              <Link href="/admin">
                <Button
                  variant="ghost"
                  className={location === "/admin" ? "bg-accent text-accent-foreground" : ""}
                  data-testid="nav-admin"
                >
                  Admin
                </Button>
              </Link>
            )}
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${location === item.path ? "bg-accent text-accent-foreground" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            {isAuthenticated && (
              <Link href="/admin">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${location === "/admin" ? "bg-accent text-accent-foreground" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-nav-admin"
                >
                  Admin
                </Button>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
