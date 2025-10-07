import { Link } from "wouter";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t bg-card mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                RK
              </div>
              <div>
                <div className="text-lg font-bold">RK Biograd</div>
                <div className="text-sm text-muted-foreground">Rukometni klub Biograd</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Strast, posvećenost i timski duh. Pratite našu putanju kroz sezonu.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Brzi linkovi</h3>
            <div className="space-y-2">
              <Link href="/first-team">
                <Button variant="ghost" className="w-full justify-start px-0 h-auto" data-testid="footer-link-first-team">
                  Prva ekipa
                </Button>
              </Link>
              <Link href="/u15">
                <Button variant="ghost" className="w-full justify-start px-0 h-auto" data-testid="footer-link-u15">
                  U15
                </Button>
              </Link>
              <Link href="/u13">
                <Button variant="ghost" className="w-full justify-start px-0 h-auto" data-testid="footer-link-u13">
                  U13
                </Button>
              </Link>
              <Link href="/history">
                <Button variant="ghost" className="w-full justify-start px-0 h-auto" data-testid="footer-link-history">
                  Povijest kluba
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Biograd na Moru, Hrvatska</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@rkbiograd.hr</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+385 23 123 456</span>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="social-facebook">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="social-instagram">
                  <Instagram className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RK Biograd. Sva prava pridržana.</p>
        </div>
      </div>
    </footer>
  );
}
