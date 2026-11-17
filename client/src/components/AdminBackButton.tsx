import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

/** "← Dashboard" link shown at the top of every admin sub-page. */
export default function AdminBackButton() {
  return (
    <Button asChild variant="ghost" className="mb-4 -ml-3" data-testid="button-back-dashboard">
      <Link href="/admin">
        <ArrowLeft className="h-4 w-4" />
        Natrag
      </Link>
    </Button>
  );
}
