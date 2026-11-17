import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Plus, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useHrsOfficials } from "@/hooks/useHrs";
import { formatMatchDate } from "@/lib/hrsFormat";
import { STAFF_ROLES, type InsertStaffAssignment, type StaffMember, type StaffRole } from "@shared/schema";
import { IMAGE_ACCEPT, uploadImage } from "@/lib/uploadImage";
import { HRS_TEAM_KEYS, type HrsOfficial, type HrsTeamKey } from "@shared/hrs";
import AdminBackButton from "@/components/AdminBackButton";

const TEAM_LABELS: Record<HrsTeamKey, string> = {
  senior: "Prva ekipa",
  u15: "U15",
  u13: "U13",
};

interface Draft {
  team: HrsTeamKey;
  role: StaffRole;
}

export default function AdminStaff() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});

  const { data: staff, isLoading: staffLoading } = useQuery<StaffMember[]>({
    queryKey: ["/api/staff"],
    enabled: isAuthenticated,
  });
  const officials = useHrsOfficials(isAuthenticated);

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

  const onSaved = (description: string) => () => {
    queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
    toast({ title: "Spremljeno", description });
  };

  const createMutation = useMutation({
    mutationFn: (data: InsertStaffAssignment) => apiRequest("POST", "/api/staff", data),
    onSuccess: onSaved("Trener je dodan"),
    onError: onError("Trener nije dodan"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: StaffRole }) => apiRequest("PATCH", `/api/staff/${id}`, { role }),
    onSuccess: onSaved("Uloga je promijenjena"),
    onError: onError("Uloga nije promijenjena"),
  });

  // One photo per person: shown on every team the coach is assigned to.
  const photoMutation = useMutation({
    mutationFn: ({ personId, photoUrl }: { personId: number; photoUrl: string | null }) =>
      apiRequest("PUT", `/api/staff/photos/${personId}`, { photoUrl }),
    onSuccess: onSaved("Fotografija je spremljena"),
    onError: onError("Fotografija nije spremljena"),
  });

  const [uploadingFor, setUploadingFor] = useState<number | null>(null);

  const handlePhotoUpload = async (member: StaffMember, file: File) => {
    setUploadingFor(member.hrsPersonId);
    try {
      const photoUrl = await uploadImage(file);
      photoMutation.mutate({ personId: member.hrsPersonId, photoUrl });
    } catch (error) {
      toast({ title: "Greška", description: (error as Error).message, variant: "destructive" });
    } finally {
      setUploadingFor(null);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/staff/${id}`),
    onSuccess: onSaved("Trener je uklonjen"),
    onError: onError("Trener nije uklonjen"),
  });

  // Default selection: the team the person was listed for most often; head coach if that
  // team has none yet, otherwise assistant.
  const draftFor = (official: HrsOfficial): Draft => {
    if (drafts[official.personId]) return drafts[official.personId];
    const team = [...official.teams].sort((a, b) => b.matches - a.matches)[0]?.team ?? "senior";
    const hasHead = staff?.some((s) => s.team === team && s.role === "Glavni trener");
    return { team, role: hasHead ? "Pomoćni trener" : "Glavni trener" };
  };

  const setDraft = (official: HrsOfficial, change: Partial<Draft>) =>
    setDrafts((d) => ({ ...d, [official.personId]: { ...draftFor(official), ...change } }));

  const isAssigned = (personId: number, team: HrsTeamKey) =>
    !!staff?.some((s) => s.hrsPersonId === personId && s.team === team);

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
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        <div>
          <AdminBackButton />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Stručni stožer</h1>
          <p className="text-muted-foreground">
            Odaberite trenere sa službenih zapisnika HRS-a i odredite im ekipu i ulogu.
            Na stranicama ekipa prikazuju se samo ovdje dodani treneri. Kliknite sliku trenera za dodavanje fotografije.
          </p>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {HRS_TEAM_KEYS.map((team) => {
            const members = staff?.filter((s) => s.team === team) ?? [];
            return (
              <Card key={team} data-testid={`card-staff-${team}`}>
                <CardHeader>
                  <CardTitle>{TEAM_LABELS[team]}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {staffLoading ? (
                    <p className="text-sm text-muted-foreground">Učitavanje...</p>
                  ) : members.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nema dodanih trenera.</p>
                  ) : (
                    members.map((member) => (
                      <div key={member.id} className="flex flex-wrap items-center gap-2" data-testid={`staff-row-${member.id}`}>
                        <CoachPhoto
                          member={member}
                          busy={uploadingFor === member.hrsPersonId}
                          onUpload={(file) => handlePhotoUpload(member, file)}
                          onRemove={() => photoMutation.mutate({ personId: member.hrsPersonId, photoUrl: null })}
                        />
                        <div className="flex-1 min-w-[8rem]">
                          <div className="font-medium truncate">
                            {member.firstName} {member.lastName}
                          </div>
                        </div>
                        <Select
                          value={member.role}
                          onValueChange={(role) => updateMutation.mutate({ id: member.id, role: role as StaffRole })}
                        >
                          <SelectTrigger className="w-44" data-testid={`select-role-${member.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STAFF_ROLES.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            if (window.confirm(`Ukloniti trenera ${member.firstName} ${member.lastName} iz ekipe ${TEAM_LABELS[team]}?`)) {
                              deleteMutation.mutate(member.id);
                            }
                          }}
                          data-testid={`button-remove-${member.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Službene osobe sa zapisnika HRS-a</CardTitle>
              <CardDescription>
                Svi koji su ove sezone upisani kao službene osobe Biograda na odigranim utakmicama.
                Nove osobe pojavljuju se nakon svoje prve utakmice.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {officials.isLoading ? (
                <p className="text-sm text-muted-foreground">Učitavanje s HRS-a...</p>
              ) : officials.isError ? (
                <p className="text-sm text-muted-foreground">HRS trenutno nije dostupan. Pokušajte ponovno za nekoliko minuta.</p>
              ) : !officials.data?.length ? (
                <p className="text-sm text-muted-foreground">Još nema službenih osoba (nije odigrana nijedna utakmica).</p>
              ) : (
                <div className="divide-y">
                  {officials.data.map((official) => {
                    const draft = draftFor(official);
                    const assigned = isAssigned(official.personId, draft.team);
                    return (
                      <div
                        key={official.personId}
                        className="flex flex-col md:flex-row md:items-center gap-3 py-3"
                        data-testid={`official-row-${official.personId}`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">
                            {official.firstName} {official.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {official.teams.map((t) => `${TEAM_LABELS[t.team]} (${t.matches})`).join(", ")}
                            {official.lastMatch && ` • zadnja utakmica ${formatMatchDate(official.lastMatch)}`}
                          </div>
                        </div>
                        <Select value={draft.team} onValueChange={(team) => setDraft(official, { team: team as HrsTeamKey })}>
                          <SelectTrigger className="w-full md:w-36" data-testid={`select-team-${official.personId}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {HRS_TEAM_KEYS.map((team) => (
                              <SelectItem key={team} value={team}>
                                {TEAM_LABELS[team]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={draft.role} onValueChange={(role) => setDraft(official, { role: role as StaffRole })}>
                          <SelectTrigger className="w-full md:w-44" data-testid={`select-new-role-${official.personId}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STAFF_ROLES.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          disabled={assigned || createMutation.isPending}
                          onClick={() =>
                            createMutation.mutate({
                              team: draft.team,
                              role: draft.role,
                              hrsPersonId: official.personId,
                              firstName: official.firstName,
                              lastName: official.lastName,
                            })
                          }
                          data-testid={`button-add-${official.personId}`}
                        >
                          {assigned ? (
                            "Dodan"
                          ) : (
                            <>
                              <Plus className="mr-2 h-4 w-4" />
                              Dodaj
                            </>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

// Round coach photo: click to upload or replace, "x" to remove.
function CoachPhoto({
  member,
  busy,
  onUpload,
  onRemove,
}: {
  member: StaffMember;
  busy: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  return (
    <div className="relative shrink-0">
      <label
        className="group relative flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-secondary text-primary ring-2 ring-accent/40"
        title={member.photoUrl ? "Promijeni fotografiju" : "Dodaj fotografiju"}
        data-testid={`label-photo-${member.hrsPersonId}`}
      >
        {member.photoUrl ? (
          <img src={member.photoUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm font-bold">
            {member.firstName.charAt(0)}
            {member.lastName.charAt(0)}
          </span>
        )}
        <span
          className={`absolute inset-0 flex items-center justify-center bg-primary/70 text-white transition-opacity ${
            busy ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <Camera className={`h-5 w-5 ${busy ? "animate-pulse" : ""}`} />
        </span>
        <input
          type="file"
          accept={IMAGE_ACCEPT}
          className="sr-only"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) onUpload(file);
          }}
          data-testid={`input-photo-${member.hrsPersonId}`}
        />
      </label>
      {member.photoUrl && (
        <button
          type="button"
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow"
          onClick={() => {
            if (window.confirm(`Ukloniti fotografiju trenera ${member.firstName} ${member.lastName}?`)) onRemove();
          }}
          aria-label="Ukloni fotografiju"
          data-testid={`button-remove-photo-${member.hrsPersonId}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
