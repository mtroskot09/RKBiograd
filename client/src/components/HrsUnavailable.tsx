import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface HrsUnavailableProps {
  what?: string;
}

export default function HrsUnavailable({ what = "Podaci" }: HrsUnavailableProps) {
  return (
    <Card className="p-6 flex items-start gap-3" data-testid="hrs-unavailable">
      <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
      <div>
        <p className="font-medium">{what} trenutno nisu dostupni.</p>
        <p className="text-sm text-muted-foreground">
          Podaci se preuzimaju sa stranica Hrvatskog rukometnog saveza. Pokušajte ponovno za nekoliko minuta.
        </p>
      </div>
    </Card>
  );
}
