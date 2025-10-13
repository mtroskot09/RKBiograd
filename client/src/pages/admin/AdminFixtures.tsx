import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Fixture, InsertFixture } from "@shared/schema";
import { insertFixtureSchema } from "@shared/schema";

export default function AdminFixtures() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);

  const { data: fixtures, isLoading: fixturesLoading } = useQuery<Fixture[]>({
    queryKey: ["/api/fixtures"],
    enabled: isAuthenticated,
  });

  const form = useForm<InsertFixture>({
    resolver: zodResolver(insertFixtureSchema),
    defaultValues: {
      homeTeam: "",
      awayTeam: "",
      homeScore: undefined,
      awayScore: undefined,
      date: "",
      time: "",
      location: "",
      status: "upcoming",
      category: "Prva ekipa",
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [authLoading, isAuthenticated, toast]);

  useEffect(() => {
    if (editingFixture) {
      form.reset({
        homeTeam: editingFixture.homeTeam,
        awayTeam: editingFixture.awayTeam,
        homeScore: editingFixture.homeScore ?? undefined,
        awayScore: editingFixture.awayScore ?? undefined,
        date: editingFixture.date,
        time: editingFixture.time || "",
        location: editingFixture.location,
        status: editingFixture.status,
        category: editingFixture.category,
      });
    } else {
      form.reset({
        homeTeam: "",
        awayTeam: "",
        homeScore: undefined,
        awayScore: undefined,
        date: "",
        time: "",
        location: "",
        status: "upcoming",
        category: "Prva ekipa",
      });
    }
  }, [editingFixture, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertFixture) => {
      return await apiRequest("POST", "/api/fixtures", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fixtures"] });
      toast({
        title: "Success",
        description: "Fixture created successfully",
      });
      setIsDialogOpen(false);
      setEditingFixture(null);
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        setLocation("/api/login");
      } else {
        toast({
          title: "Error",
          description: "Failed to create fixture",
          variant: "destructive",
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertFixture> }) => {
      return await apiRequest("PATCH", `/api/fixtures/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fixtures"] });
      toast({
        title: "Success",
        description: "Fixture updated successfully",
      });
      setIsDialogOpen(false);
      setEditingFixture(null);
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        setLocation("/api/login");
      } else {
        toast({
          title: "Error",
          description: "Failed to update fixture",
          variant: "destructive",
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/fixtures/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fixtures"] });
      toast({
        title: "Success",
        description: "Fixture deleted successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        setLocation("/api/login");
      } else {
        toast({
          title: "Error",
          description: "Failed to delete fixture",
          variant: "destructive",
        });
      }
    },
  });

  const onSubmit = (data: InsertFixture) => {
    if (editingFixture) {
      updateMutation.mutate({ id: editingFixture.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (fixture: Fixture) => {
    setEditingFixture(fixture);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this fixture?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenDialog = () => {
    setEditingFixture(null);
    setIsDialogOpen(true);
  };

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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Fixtures</h1>
            <p className="text-muted-foreground">Schedule and update matches</p>
          </div>
          <Button onClick={handleOpenDialog} data-testid="button-create-fixture">
            <Plus className="mr-2 h-4 w-4" />
            Create Fixture
          </Button>
        </div>

        {fixturesLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading fixtures...</p>
          </div>
        ) : fixtures && fixtures.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {fixtures.map((fixture) => (
              <Card key={fixture.id} data-testid={`card-fixture-${fixture.id}`}>
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                  <div className="flex-1">
                    <CardTitle className="text-xl" data-testid={`text-fixture-teams-${fixture.id}`}>
                      {fixture.homeTeam} vs {fixture.awayTeam}
                    </CardTitle>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <span data-testid={`text-fixture-date-${fixture.id}`}>{fixture.date}</span>
                      {fixture.time && (
                        <span data-testid={`text-fixture-time-${fixture.id}`}>{fixture.time}</span>
                      )}
                      <span data-testid={`text-fixture-status-${fixture.id}`}>{fixture.status}</span>
                      <span data-testid={`text-fixture-category-${fixture.id}`}>{fixture.category}</span>
                    </div>
                    {(fixture.homeScore !== null || fixture.awayScore !== null) && (
                      <div className="mt-2 font-semibold" data-testid={`text-fixture-score-${fixture.id}`}>
                        Score: {fixture.homeScore ?? 0} - {fixture.awayScore ?? 0}
                      </div>
                    )}
                    <div className="mt-1 text-sm text-muted-foreground" data-testid={`text-fixture-location-${fixture.id}`}>
                      {fixture.location}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(fixture)}
                      data-testid={`button-edit-fixture-${fixture.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(fixture.id)}
                      data-testid={`button-delete-fixture-${fixture.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No fixtures yet. Create your first one!</p>
            </CardContent>
          </Card>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-fixture-form">
            <DialogHeader>
              <DialogTitle>{editingFixture ? "Edit Fixture" : "Create New Fixture"}</DialogTitle>
              <DialogDescription>
                {editingFixture ? "Update the fixture details below" : "Fill in the details to create a new fixture"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="homeTeam"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Team</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-fixture-home-team" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="awayTeam"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Away Team</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-fixture-away-team" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="homeScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Score (optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            data-testid="input-fixture-home-score"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="awayScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Away Score (optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            data-testid="input-fixture-away-score"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-fixture-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time (optional)</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} value={field.value || ""} data-testid="input-fixture-time" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-fixture-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-fixture-status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="live">Live</SelectItem>
                            <SelectItem value="finished">Finished</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-fixture-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Prva ekipa">Prva ekipa</SelectItem>
                            <SelectItem value="U15">U15</SelectItem>
                            <SelectItem value="U13">U13</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingFixture(null);
                    }}
                    data-testid="button-cancel-fixture"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-submit-fixture"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : editingFixture
                      ? "Update Fixture"
                      : "Create Fixture"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
