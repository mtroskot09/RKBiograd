import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Home, LogOut, RefreshCw, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Post, User as UserType } from "@shared/schema";
import type { HrsTeamInfo } from "@shared/hrs";

export default function AdminDashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
    enabled: isAuthenticated,
  });

  const { data: hrsTeams } = useQuery<HrsTeamInfo[]>({
    queryKey: ["/api/hrs/teams"],
    enabled: isAuthenticated,
  });
  const userData = user as UserType | undefined;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Potrebna prijava",
        description: "Prijavite se za pristup administraciji",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [authLoading, isAuthenticated, toast]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Učitavanje...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const isLoading = postsLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Administracija</h1>
            <p className="text-muted-foreground">
              Dobro došli, {userData?.firstName} {userData?.lastName}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/">
              <Button variant="outline" data-testid="button-view-site">
                <Home className="mr-2 h-4 w-4" />
                Pogledaj stranicu
              </Button>
            </Link>
            {/* Full page load: the server ends the session and redirects */}
            <Button asChild variant="outline" data-testid="button-logout">
              <a href="/api/logout">
                <LogOut className="mr-2 h-4 w-4" />
                Odjava
              </a>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card data-testid="card-posts-overview">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objavljene vijesti</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-posts-count">
                {isLoading ? "..." : posts?.length ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Vijesti i novosti</p>
            </CardContent>
          </Card>

          <Card data-testid="card-user-info">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Račun</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium" data-testid="text-user-email">
                {userData?.email}
              </div>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card data-testid="card-manage-posts">
            <CardHeader>
              <CardTitle>Vijesti</CardTitle>
              <CardDescription>Pisanje i uređivanje vijesti</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => setLocation("/admin/posts")}
                data-testid="button-navigate-posts"
              >
                Otvori vijesti
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-manage-staff">
            <CardHeader>
              <CardTitle>Stručni stožer</CardTitle>
              <CardDescription>Treneri po ekipama i njihove uloge</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => setLocation("/admin/staff")}
                data-testid="button-navigate-staff"
              >
                Otvori stručni stožer
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-manage-trainings">
            <CardHeader>
              <CardTitle>Raspored treninga</CardTitle>
              <CardDescription>Tjedni termini treninga za svaku ekipu</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => setLocation("/admin/trainings")}
                data-testid="button-navigate-trainings"
              >
                Otvori raspored treninga
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-manage-club-info">
            <CardHeader>
              <CardTitle>Kontakt podaci</CardTitle>
              <CardDescription>Telefon, e-mail, adresa i radno vrijeme</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => setLocation("/admin/club-info")}
                data-testid="button-navigate-club-info"
              >
                Otvori kontakt podatke
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-manage-history">
            <CardHeader>
              <CardTitle>Povijest</CardTitle>
              <CardDescription>Tekstovi, ključni događaji i galerija fotografija</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => setLocation("/admin/history")}
                data-testid="button-navigate-history"
              >
                Otvori povijest
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-manage-banners">
            <CardHeader>
              <CardTitle>Naslovne slike</CardTitle>
              <CardDescription>Pozadinske slike na vrhu stranica</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => setLocation("/admin/banners")}
                data-testid="button-navigate-banners"
              >
                Otvori naslovne slike
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-hrs-data">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Rezultati i ljestvice
              </CardTitle>
              <CardDescription>
                Utakmice, ljestvice i statistika igrača automatski se preuzimaju s HRS-a
                {hrsTeams?.[0] ? ` (sezona ${hrsTeams[0].season})` : ""}. Natjecanja za novu sezonu upisuje programer (server/hrs/config.ts).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {hrsTeams?.flatMap((team) =>
                  team.competitions.map((c) => (
                    <li key={c.leagueId} className="flex justify-between gap-4">
                      <span className="font-medium">{team.label}</span>
                      <a href={c.hrsUrl} target="_blank" rel="noreferrer" className="underline text-muted-foreground text-right">
                        {c.name}
                      </a>
                    </li>
                  )),
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
