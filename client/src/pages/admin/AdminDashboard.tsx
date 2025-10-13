import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Table, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Post, Fixture, LeagueTableRow, User as UserType } from "@shared/schema";

export default function AdminDashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
    enabled: isAuthenticated,
  });

  const { data: fixtures, isLoading: fixturesLoading } = useQuery<Fixture[]>({
    queryKey: ["/api/fixtures"],
    enabled: isAuthenticated,
  });

  const { data: leagueTable, isLoading: leagueTableLoading } = useQuery<LeagueTableRow[]>({
    queryKey: ["/api/league-table"],
    enabled: isAuthenticated,
  });

  const userData = user as UserType | undefined;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the admin panel",
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
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const isLoading = postsLoading || fixturesLoading || leagueTableLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userData?.firstName} {userData?.lastName}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-posts-overview">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-posts-count">
                {isLoading ? "..." : posts?.length ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">News and updates</p>
            </CardContent>
          </Card>

          <Card data-testid="card-fixtures-overview">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fixtures</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-fixtures-count">
                {isLoading ? "..." : fixtures?.length ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Matches scheduled</p>
            </CardContent>
          </Card>

          <Card data-testid="card-league-overview">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">League Entries</CardTitle>
              <Table className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-league-count">
                {isLoading ? "..." : leagueTable?.length ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Teams in table</p>
            </CardContent>
          </Card>

          <Card data-testid="card-user-info">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account</CardTitle>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card data-testid="card-manage-posts">
            <CardHeader>
              <CardTitle>Manage Posts</CardTitle>
              <CardDescription>Create and edit news articles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => setLocation("/admin/posts")}
                data-testid="button-navigate-posts"
              >
                Go to Posts
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-manage-fixtures">
            <CardHeader>
              <CardTitle>Manage Fixtures</CardTitle>
              <CardDescription>Schedule and update matches</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => setLocation("/admin/fixtures")}
                data-testid="button-navigate-fixtures"
              >
                Go to Fixtures
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-manage-league">
            <CardHeader>
              <CardTitle>Manage League Table</CardTitle>
              <CardDescription>Update standings and results</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => setLocation("/admin/league-table")}
                data-testid="button-navigate-league"
              >
                Go to League Table
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
