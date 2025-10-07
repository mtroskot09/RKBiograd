import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Stranica nije pronađena</h2>
        <p className="text-muted-foreground mb-8">
          Stranica koju tražite ne postoji ili je premještena.
        </p>
        <Link href="/">
          <Button data-testid="button-home">
            <Home className="mr-2 h-4 w-4" />
            Povratak na početnu
          </Button>
        </Link>
      </div>
    </div>
  );
}
