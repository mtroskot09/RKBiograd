import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Edit, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { IMAGE_ACCEPT, uploadImage } from "@/lib/uploadImage";
import type { HistoryContent, HistoryEvent, HistoryPage, InsertHistoryEvent } from "@shared/schema";
import AdminBackButton from "@/components/AdminBackButton";

const MAX_STATS = 4;
const emptyEvent = (): InsertHistoryEvent & { id: string | null } => ({
  id: null,
  year: "",
  title: "",
  description: "",
  imageSrc: null,
});

export default function AdminHistory() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data, isLoading } = useQuery<HistoryPage>({ queryKey: ["/api/history"], enabled: isAuthenticated });

  const [content, setContent] = useState<HistoryContent | null>(null);
  const [eventForm, setEventForm] = useState(emptyEvent());
  const [uploading, setUploading] = useState<"event" | "gallery" | null>(null);

  // Fill the texts form once the page data has loaded.
  useEffect(() => {
    if (data && !content) setContent(data.content);
  }, [data, content]);

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
    queryClient.invalidateQueries({ queryKey: ["/api/history"] });
    toast({ title: "Spremljeno", description });
  };

  const contentMutation = useMutation({
    mutationFn: (c: HistoryContent) => apiRequest("PUT", "/api/history/content", c),
    onSuccess: onSaved("Tekstovi su spremljeni"),
    onError: onError("Tekstovi nisu spremljeni"),
  });

  const eventMutation = useMutation({
    mutationFn: ({ id, ...event }: InsertHistoryEvent & { id: string | null }) =>
      id ? apiRequest("PUT", `/api/history/events/${id}`, event) : apiRequest("POST", "/api/history/events", event),
    onSuccess: () => {
      onSaved("Događaj je spremljen")();
      setEventForm(emptyEvent());
    },
    onError: onError("Događaj nije spremljen"),
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/history/events/${id}`),
    onSuccess: onSaved("Događaj je obrisan"),
    onError: onError("Događaj nije obrisan"),
  });

  const addPhotoMutation = useMutation({
    mutationFn: (imageSrc: string) => apiRequest("POST", "/api/history/photos", { imageSrc, caption: "" }),
    onSuccess: onSaved("Fotografija je dodana"),
    onError: onError("Fotografija nije dodana"),
  });

  const captionMutation = useMutation({
    mutationFn: ({ id, caption }: { id: string; caption: string }) =>
      apiRequest("PATCH", `/api/history/photos/${id}`, { caption }),
    onSuccess: onSaved("Opis je spremljen"),
    onError: onError("Opis nije spremljen"),
  });

  const deletePhotoMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/history/photos/${id}`),
    onSuccess: onSaved("Fotografija je obrisana"),
    onError: onError("Fotografija nije obrisana"),
  });

  const upload = async (file: File, target: "event" | "gallery") => {
    setUploading(target);
    try {
      return await uploadImage(file);
    } catch (error) {
      toast({ title: "Greška", description: (error as Error).message, variant: "destructive" });
      return null;
    } finally {
      setUploading(null);
    }
  };

  const saveEvent = () => {
    if (!eventForm.year.trim() || !eventForm.title.trim()) {
      toast({ title: "Greška", description: "Godina i naslov su obavezni", variant: "destructive" });
      return;
    }
    eventMutation.mutate(eventForm);
  };

  const updateStat = (index: number, field: "value" | "label", value: string) =>
    setContent((c) => c && { ...c, stats: c.stats.map((s, i) => (i === index ? { ...s, [field]: value } : s)) });

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
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <AdminBackButton />
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Povijest</h1>
            <p className="text-muted-foreground">Sve što se prikazuje na stranici Povijest.</p>
          </div>
          <Button variant="outline" onClick={() => window.open("/history", "_blank")} data-testid="button-view-history">
            Pogledaj stranicu
          </Button>
        </div>

        {isLoading || !data || !content ? (
          <p className="text-muted-foreground">Učitavanje...</p>
        ) : (
          <>
            {/* Texts and stat boxes */}
            <Card>
              <CardHeader>
                <CardTitle>Tekstovi i istaknuti podaci</CardTitle>
                <CardDescription>Uvod (u zaglavlju stranice), istaknuti podaci i tekst „Naša misija”.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="history-intro">Uvod</Label>
                  <Textarea
                    id="history-intro"
                    rows={3}
                    value={content.intro}
                    onChange={(e) => setContent({ ...content, intro: e.target.value })}
                    data-testid="input-history-intro"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Istaknuti podaci (najviše {MAX_STATS})</Label>
                  <div className="space-y-2">
                    {content.stats.map((stat, i) => (
                      <div key={i} className="flex flex-wrap sm:flex-nowrap gap-2">
                        <Input
                          className="sm:w-40"
                          placeholder="1963."
                          value={stat.value}
                          maxLength={20}
                          onChange={(e) => updateStat(i, "value", e.target.value)}
                          aria-label="Vrijednost"
                          data-testid={`input-stat-value-${i}`}
                        />
                        <Input
                          className="flex-1 min-w-[10rem]"
                          placeholder="Godina osnutka"
                          value={stat.label}
                          maxLength={60}
                          onChange={(e) => updateStat(i, "label", e.target.value)}
                          aria-label="Opis"
                          data-testid={`input-stat-label-${i}`}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setContent({ ...content, stats: content.stats.filter((_, j) => j !== i) })}
                          aria-label="Ukloni"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {content.stats.length < MAX_STATS && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setContent({ ...content, stats: [...content.stats, { value: "", label: "" }] })}
                      data-testid="button-add-stat"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Dodaj podatak
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="history-mission">Naša misija</Label>
                  <Textarea
                    id="history-mission"
                    rows={5}
                    value={content.mission}
                    onChange={(e) => setContent({ ...content, mission: e.target.value })}
                    data-testid="input-history-mission"
                  />
                </div>

                <Button
                  onClick={() => {
                    if (content.stats.some((s) => !s.value.trim() || !s.label.trim())) {
                      toast({ title: "Greška", description: "Ispunite ili uklonite prazne istaknute podatke", variant: "destructive" });
                      return;
                    }
                    contentMutation.mutate(content);
                  }}
                  disabled={contentMutation.isPending}
                  data-testid="button-save-history-content"
                >
                  {contentMutation.isPending ? "Spremanje..." : "Spremi tekstove"}
                </Button>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Ključni događaji</CardTitle>
                <CardDescription>
                  Prikazuju se od najnovijeg. Godina je slobodan tekst („1963.”, „2010./11.”, „2011. – 2019.”); redoslijed
                  određuje prva četveroznamenkasta godina.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  {data.events.length === 0 && <p className="text-sm text-muted-foreground">Još nema događaja.</p>}
                  {data.events.map((event: HistoryEvent) => (
                    <div
                      key={event.id}
                      className={`flex items-start gap-3 rounded-lg p-3 ${eventForm.id === event.id ? "bg-primary/10" : "bg-muted"}`}
                      data-testid={`history-event-${event.id}`}
                    >
                      {event.imageSrc ? (
                        <img src={event.imageSrc} alt="" className="h-14 w-14 shrink-0 rounded-md object-cover" />
                      ) : (
                        <div className="h-14 w-14 shrink-0 rounded-md bg-secondary" aria-hidden="true" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-primary">{event.year}</div>
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">{event.description}</div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEventForm({ ...event });
                            document.getElementById("history-event-form")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          aria-label="Uredi događaj"
                          data-testid={`button-edit-event-${event.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            if (window.confirm(`Obrisati „${event.title}”?`)) deleteEventMutation.mutate(event.id);
                          }}
                          aria-label="Obriši događaj"
                          data-testid={`button-delete-event-${event.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div id="history-event-form" className="border-t pt-5 space-y-3">
                  <div className="font-medium">{eventForm.id ? "Uredi događaj" : "Novi događaj"}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="event-year">Godina</Label>
                      <Input
                        id="event-year"
                        placeholder="2010./11."
                        value={eventForm.year}
                        maxLength={30}
                        onChange={(e) => setEventForm({ ...eventForm, year: e.target.value })}
                        data-testid="input-event-year"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="event-title">Naslov</Label>
                      <Input
                        id="event-title"
                        placeholder="Prvaci 2. HRL"
                        value={eventForm.title}
                        maxLength={120}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        data-testid="input-event-title"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="event-description">Opis</Label>
                    <Textarea
                      id="event-description"
                      rows={3}
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      data-testid="input-event-description"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Fotografija (neobavezno)</Label>
                    <div className="flex flex-wrap items-center gap-3">
                      {eventForm.imageSrc && (
                        <div className="relative">
                          <img src={eventForm.imageSrc} alt="" className="h-20 w-28 rounded-md object-cover" />
                          <button
                            type="button"
                            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow"
                            onClick={() => setEventForm({ ...eventForm, imageSrc: null })}
                            aria-label="Ukloni fotografiju"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      <Input
                        type="file"
                        accept={IMAGE_ACCEPT}
                        className="max-w-xs"
                        disabled={uploading === "event"}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          e.target.value = "";
                          if (!file) return;
                          const url = await upload(file, "event");
                          if (url) setEventForm((f) => ({ ...f, imageSrc: url }));
                        }}
                        data-testid="input-event-photo"
                      />
                      {uploading === "event" && <span className="text-sm text-muted-foreground">Učitavanje fotografije...</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveEvent} disabled={eventMutation.isPending || uploading === "event"} data-testid="button-save-event">
                      {eventForm.id ? (
                        "Spremi događaj"
                      ) : (
                        <>
                          <Plus className="mr-1 h-4 w-4" />
                          Dodaj događaj
                        </>
                      )}
                    </Button>
                    {eventForm.id && (
                      <Button variant="outline" onClick={() => setEventForm(emptyEvent())}>
                        Odustani
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Galerija fotografija</CardTitle>
                <CardDescription>Stare fotografije ekipa, pehari, dvorana… JPG, PNG, WebP ili GIF, najviše 5 MB po fotografiji.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <label
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-accent/50 bg-secondary/40 p-6 text-sm font-medium text-primary hover:bg-secondary ${
                    uploading === "gallery" ? "opacity-60" : ""
                  }`}
                  data-testid="label-add-gallery-photos"
                >
                  <ImagePlus className="h-5 w-5" />
                  {uploading === "gallery" ? "Učitavanje fotografije..." : "Dodaj fotografije (možete odabrati više odjednom)"}
                  <input
                    type="file"
                    accept={IMAGE_ACCEPT}
                    multiple
                    className="sr-only"
                    disabled={uploading === "gallery"}
                    onChange={async (e) => {
                      const files = Array.from(e.target.files ?? []);
                      e.target.value = "";
                      for (const file of files) {
                        const url = await upload(file, "gallery");
                        if (url) await addPhotoMutation.mutateAsync(url).catch(() => undefined);
                      }
                    }}
                    data-testid="input-gallery-photos"
                  />
                </label>

                {data.photos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Još nema fotografija.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.photos.map((photo) => (
                      <GalleryItem
                        key={photo.id}
                        photo={photo}
                        onSaveCaption={(caption) => captionMutation.mutate({ id: photo.id, caption })}
                        onDelete={() => {
                          if (window.confirm("Obrisati ovu fotografiju?")) deletePhotoMutation.mutate(photo.id);
                        }}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function GalleryItem({
  photo,
  onSaveCaption,
  onDelete,
}: {
  photo: HistoryPage["photos"][number];
  onSaveCaption: (caption: string) => void;
  onDelete: () => void;
}) {
  const [caption, setCaption] = useState(photo.caption);
  const dirty = caption.trim() !== photo.caption;

  return (
    <div className="overflow-hidden rounded-lg border bg-card" data-testid={`gallery-item-${photo.id}`}>
      <img src={photo.imageSrc} alt="" className="aspect-[4/3] w-full object-cover" />
      <div className="space-y-2 p-3">
        <Input
          placeholder="Opis (neobavezno)"
          value={caption}
          maxLength={200}
          onChange={(e) => setCaption(e.target.value)}
          data-testid={`input-caption-${photo.id}`}
        />
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" disabled={!dirty} onClick={() => onSaveCaption(caption.trim())}>
            Spremi opis
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete} aria-label="Obriši fotografiju">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
