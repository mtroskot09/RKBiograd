import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { TRAINING_DAYS, type InsertTrainingSession, type TrainingSession } from "@shared/schema";
import { HRS_TEAM_KEYS, type HrsTeamKey } from "@shared/hrs";
import AdminBackButton from "@/components/AdminBackButton";

const TEAM_LABELS: Record<HrsTeamKey, string> = {
  senior: "Prva ekipa",
  u15: "U15",
  u13: "U13",
};

interface FormState {
  editingId: string | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  location: string;
}

const emptyForm = (): FormState => ({ editingId: null, dayOfWeek: 1, startTime: "", endTime: "", location: "" });

export default function AdminTrainings() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [forms, setForms] = useState<Record<HrsTeamKey, FormState>>({
    senior: emptyForm(),
    u15: emptyForm(),
    u13: emptyForm(),
  });

  const { data: sessions, isLoading } = useQuery<TrainingSession[]>({
    queryKey: ["/api/trainings"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Potrebna prijava",
        description: "Prijavite se za pristup ovoj stranici",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [authLoading, isAuthenticated, toast]);

  const onError = (action: string) => (error: Error) => {
    if (isUnauthorizedError(error)) {
      toast({
        title: "Sesija je istekla",
        description: "Prijavite se ponovno.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    } else {
      toast({ title: "Greška", description: action, variant: "destructive" });
    }
  };

  const saveMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | null; data: InsertTrainingSession }) =>
      id ? apiRequest("PATCH", `/api/trainings/${id}`, data) : apiRequest("POST", "/api/trainings", data),
    onSuccess: (_res, { data }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/trainings"] });
      setForms((f) => ({ ...f, [data.team]: emptyForm() }));
      toast({ title: "Spremljeno", description: "Trening je spremljen" });
    },
    onError: onError("Trening nije spremljen"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/trainings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trainings"] });
      toast({ title: "Spremljeno", description: "Trening je obrisan" });
    },
    onError: onError("Trening nije obrisan"),
  });

  const updateForm = (team: HrsTeamKey, change: Partial<FormState>) =>
    setForms((f) => ({ ...f, [team]: { ...f[team], ...change } }));

  const startEdit = (s: TrainingSession) =>
    updateForm(s.team as HrsTeamKey, {
      editingId: s.id,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      location: s.location ?? "",
    });

  const submit = (team: HrsTeamKey) => {
    const form = forms[team];
    if (!form.startTime || !form.endTime) {
      toast({ title: "Greška", description: "Upišite početak i kraj treninga", variant: "destructive" });
      return;
    }
    if (form.endTime <= form.startTime) {
      toast({ title: "Greška", description: "Kraj mora biti nakon početka", variant: "destructive" });
      return;
    }
    saveMutation.mutate({
      id: form.editingId,
      data: {
        team,
        dayOfWeek: form.dayOfWeek,
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location.trim() || null,
      },
    });
  };

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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div>
          <AdminBackButton />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Raspored treninga</h1>
          <p className="text-muted-foreground">Tjedni termini prikazuju se u odjeljku „Treninzi” na stranici svake ekipe.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {HRS_TEAM_KEYS.map((team) => {
            const teamSessions = sessions?.filter((s) => s.team === team) ?? [];
            const form = forms[team];
            return (
              <Card key={team} data-testid={`card-trainings-${team}`}>
                <CardHeader>
                  <CardTitle>{TEAM_LABELS[team]}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Učitavanje...</p>
                  ) : teamSessions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Još nema treninga.</p>
                  ) : (
                    <div className="space-y-2">
                      {teamSessions.map((s) => (
                        <div
                          key={s.id}
                          className={`flex items-center gap-2 p-2 rounded-md ${form.editingId === s.id ? "bg-primary/10" : "bg-muted"}`}
                          data-testid={`training-row-${s.id}`}
                        >
                          <div className="flex-1 min-w-0 text-sm">
                            <div className="font-medium">{TRAINING_DAYS[s.dayOfWeek - 1]}</div>
                            <div className="text-muted-foreground">
                              {s.startTime} - {s.endTime}
                              {s.location && ` • ${s.location}`}
                            </div>
                          </div>
                          <Button variant="outline" size="icon" onClick={() => startEdit(s)} data-testid={`button-edit-training-${s.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              if (window.confirm("Obrisati ovaj trening?")) deleteMutation.mutate(s.id);
                            }}
                            data-testid={`button-delete-training-${s.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t pt-4 space-y-3">
                    <div className="text-sm font-medium">{form.editingId ? "Uredi trening" : "Novi trening"}</div>
                    <Select
                      value={String(form.dayOfWeek)}
                      onValueChange={(v) => updateForm(team, { dayOfWeek: Number(v) })}
                    >
                      <SelectTrigger data-testid={`select-day-${team}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TRAINING_DAYS.map((day, i) => (
                          <SelectItem key={day} value={String(i + 1)}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={form.startTime}
                        onChange={(e) => updateForm(team, { startTime: e.target.value })}
                        aria-label="Početak"
                        data-testid={`input-start-${team}`}
                      />
                      <span className="text-muted-foreground">-</span>
                      <Input
                        type="time"
                        value={form.endTime}
                        onChange={(e) => updateForm(team, { endTime: e.target.value })}
                        aria-label="Kraj"
                        data-testid={`input-end-${team}`}
                      />
                    </div>
                    <Input
                      placeholder="Mjesto (neobavezno)"
                      value={form.location}
                      maxLength={100}
                      onChange={(e) => updateForm(team, { location: e.target.value })}
                      data-testid={`input-location-${team}`}
                    />
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        disabled={saveMutation.isPending}
                        onClick={() => submit(team)}
                        data-testid={`button-save-training-${team}`}
                      >
                        {form.editingId ? (
                          "Spremi"
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Dodaj
                          </>
                        )}
                      </Button>
                      {form.editingId && (
                        <Button variant="outline" onClick={() => updateForm(team, emptyForm())}>
                          Odustani
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
