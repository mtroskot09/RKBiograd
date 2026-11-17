import { Link } from "wouter";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { CLUB_MOTTO, FACEBOOK_URL, INSTAGRAM_URL } from "@/lib/club";
import { lines, phoneHref, useClubInfo } from "@/hooks/useClubInfo";

const QUICK_LINKS = [
  { path: "/first-team", label: "Prva ekipa", testId: "footer-link-first-team" },
  { path: "/u15", label: "U15", testId: "footer-link-u15" },
  { path: "/u13", label: "U13", testId: "footer-link-u13" },
  { path: "/news", label: "Vijesti", testId: "footer-link-news" },
  { path: "/history", label: "Povijest kluba", testId: "footer-link-history" },
  { path: "/contact", label: "Kontakt", testId: "footer-link-contact" },
];

const SOCIAL_LINKS = [
  { href: FACEBOOK_URL, label: "RK Biograd na Facebooku", icon: Facebook, testId: "social-facebook" },
  { href: INSTAGRAM_URL, label: "RK Biograd na Instagramu", icon: Instagram, testId: "social-instagram" },
];

export default function Footer() {
  const { info } = useClubInfo();

  return (
    <footer className="mt-20 bg-brand-gradient text-white">
      <div className="h-1 w-full bg-accent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4 mb-5">
              <img
                src="/rk-biograd-logo-192.png"
                alt="RK Biograd grb"
                className="h-20 w-auto drop-shadow"
                data-testid="img-footer-logo"
              />
              <div>
                <div className="font-display text-2xl font-bold uppercase tracking-wide">RK Biograd</div>
                <div className="text-sm text-white/70">Rukometni klub Biograd · od 1963.</div>
              </div>
            </div>
            <p className="font-display text-2xl font-bold uppercase tracking-wide text-accent" data-testid="text-footer-motto">
              {CLUB_MOTTO}
            </p>
            <p className="mt-1 text-sm text-white/70">Pratite našu putanju kroz sezonu.</p>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-accent mb-4">Brzi linkovi</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
              {QUICK_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="inline-flex min-h-10 items-center text-white/80 hover:text-accent transition-colors"
                    data-testid={link.testId}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-accent mb-4">Kontakt</h3>
            <div className="space-y-3 text-sm text-white/80">
              {lines(info.address).length > 0 && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                  <span>{lines(info.address).join(", ")}</span>
                </div>
              )}
              {info.email && (
                <a href={`mailto:${info.email}`} className="flex items-center gap-3 hover:text-accent transition-colors">
                  <Mail className="h-4 w-4 text-accent shrink-0" />
                  <span className="break-all">{info.email}</span>
                </a>
              )}
              {info.phone && (
                <a href={phoneHref(info.phone)} className="flex items-center gap-3 hover:text-accent transition-colors">
                  <Phone className="h-4 w-4 text-accent shrink-0" />
                  <span>{info.phone}</span>
                </a>
              )}
              <div className="flex items-center gap-3 pt-2">
                {SOCIAL_LINKS.map(({ href, label, icon: Icon, testId }) => (
                  <a
                    key={testId}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-accent hover:text-accent-foreground transition-colors"
                    data-testid={testId}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 mt-10 pt-6 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} RK Biograd. Sva prava pridržana.</p>
        </div>
      </div>
    </footer>
  );
}
