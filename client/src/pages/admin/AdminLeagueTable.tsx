import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { LeagueTableRow, InsertLeagueTable } from "@shared/schema";
import { insertLeagueTableSchema } from "@shared/schema";

export default function AdminLeagueTable() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<LeagueTableRow | null>(null);

  const { data: leagueTable, isLoading: tableLoading } = useQuery<LeagueTableRow[]>({
    queryKey: ["/api/league-table"],
    enabled: isAuthenticated,
  });

  const form = useForm<InsertLeagueTable>({
    resolver: zodResolver(insertLeagueTableSchema),
    defaultValues: {
      position: 0,
      team: "",
      played: 0,
      won: 0,
      draw: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
      isOurTeam: false,
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
    if (editingRow) {
      form.reset({
        position: editingRow.position,
        team: editingRow.team,
        played: editingRow.played,
        won: editingRow.won,
        draw: editingRow.draw,
        lost: editingRow.lost,
        goalsFor: editingRow.goalsFor,
        goalsAgainst: editingRow.goalsAgainst,
        goalDiff: editingRow.goalDiff,
        points: editingRow.points,
        isOurTeam: editingRow.isOurTeam,
      });
    } else {
      form.reset({
        position: 0,
        team: "",
        played: 0,
        won: 0,
        draw: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDiff: 0,
        points: 0,
        isOurTeam: false,
      });
    }
  }, [editingRow, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertLeagueTable) => {
      return await apiRequest("POST", "/api/league-table", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/league-table"] });
      toast({
        title: "Success",
        description: "Team row created successfully",
      });
      setIsDialogOpen(false);
      setEditingRow(null);
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      } else {
        toast({
          title: "Error",
          description: "Failed to create team row",
          variant: "destructive",
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertLeagueTable> }) => {
      return await apiRequest("PATCH", `/api/league-table/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/league-table"] });
      toast({
        title: "Success",
        description: "Team row updated successfully",
      });
      setIsDialogOpen(false);
      setEditingRow(null);
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      } else {
        toast({
          title: "Error",
          description: "Failed to update team row",
          variant: "destructive",
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/league-table/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/league-table"] });
      toast({
        title: "Success",
        description: "Team row deleted successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      } else {
        toast({
          title: "Error",
          description: "Failed to delete team row",
          variant: "destructive",
        });
      }
    },
  });

  const importMutation = useMutation({
    mutationFn: async (url?: string) => {
      return await apiRequest("POST", "/api/league-table/import", { url });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/league-table"] });
      toast({
        title: "Success",
        description: `Imported ${data.imported} teams from HRS website`,
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      } else {
        toast({
          title: "Error",
          description: "Failed to import league table from HRS",
          variant: "destructive",
        });
      }
    },
  });

  const onSubmit = (data: InsertLeagueTable) => {
    if (editingRow) {
      updateMutation.mutate({ id: editingRow.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (row: LeagueTableRow) => {
    setEditingRow(row);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this team row?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenDialog = () => {
    setEditingRow(null);
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

  const sortedTable = leagueTable ? [...leagueTable].sort((a, b) => a.position - b.position) : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage League Table</h1>
            <p className="text-muted-foreground">Update standings and team statistics</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => importMutation.mutate()} 
              variant="outline"
              disabled={importMutation.isPending}
              data-testid="button-import-from-hrs"
            >
              {importMutation.isPending ? "Importing..." : "Import from HRS"}
            </Button>
            <Button onClick={handleOpenDialog} data-testid="button-create-league-row">
              <Plus className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          </div>
        </div>

        {tableLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading league table...</p>
          </div>
        ) : sortedTable.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Pos
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        P
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        W
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        D
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        L
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        GF
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        GA
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        GD
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Pts
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sortedTable.map((row) => (
                      <tr
                        key={row.id}
                        className={row.isOurTeam ? "bg-primary/10" : ""}
                        data-testid={`row-league-${row.id}`}
                      >
                        <td className="px-4 py-3 text-sm font-medium" data-testid={`text-position-${row.id}`}>
                          {row.position}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium" data-testid={`text-team-${row.id}`}>
                          {row.team}
                          {row.isOurTeam && <span className="ml-2 text-xs text-primary">(Our Team)</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-center" data-testid={`text-played-${row.id}`}>
                          {row.played}
                        </td>
                        <td className="px-4 py-3 text-sm text-center" data-testid={`text-won-${row.id}`}>
                          {row.won}
                        </td>
                        <td className="px-4 py-3 text-sm text-center" data-testid={`text-draw-${row.id}`}>
                          {row.draw}
                        </td>
                        <td className="px-4 py-3 text-sm text-center" data-testid={`text-lost-${row.id}`}>
                          {row.lost}
                        </td>
                        <td className="px-4 py-3 text-sm text-center" data-testid={`text-goalsfor-${row.id}`}>
                          {row.goalsFor}
                        </td>
                        <td className="px-4 py-3 text-sm text-center" data-testid={`text-goalsagainst-${row.id}`}>
                          {row.goalsAgainst}
                        </td>
                        <td className="px-4 py-3 text-sm text-center" data-testid={`text-goaldiff-${row.id}`}>
                          {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                        </td>
                        <td className="px-4 py-3 text-sm text-center font-bold" data-testid={`text-points-${row.id}`}>
                          {row.points}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(row)}
                              data-testid={`button-edit-league-${row.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(row.id)}
                              data-testid={`button-delete-league-${row.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No league table entries yet. Create your first one!</p>
            </CardContent>
          </Card>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-league-form">
            <DialogHeader>
              <DialogTitle>{editingRow ? "Edit Team Row" : "Create New Team Row"}</DialogTitle>
              <DialogDescription>
                {editingRow ? "Update the team details below" : "Fill in the details to add a new team"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-league-position"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="team"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-league-team" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="played"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Played</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-league-played"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="won"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Won</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-league-won"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="draw"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Draw</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-league-draw"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lost</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-league-lost"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="goalsFor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goals For</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-league-goalsfor"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goalsAgainst"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goals Against</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-league-goalsagainst"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goalDiff"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Difference</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-league-goaldiff"
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
                    name="points"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Points</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-league-points"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isOurTeam"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-league-ourteam"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Is Our Team</FormLabel>
                        </div>
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
                      setEditingRow(null);
                    }}
                    data-testid="button-cancel-league"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-submit-league"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : editingRow
                      ? "Update Team"
                      : "Add Team"}
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
