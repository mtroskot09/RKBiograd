import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ExternalLink, ImagePlus, RotateCcw } from "lucide-react";
import AdminBackButton from "@/components/AdminBackButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { IMAGE_ACCEPT, uploadImage } from "@/lib/uploadImage";
import { PAGE_BANNERS, usePageBanners } from "@/lib/pageBanners";
import type { PageBannerKey } from "@shared/schema";

// Admin → Naslovne slike: the top image (banner / hero) of each public page.
export default function AdminBanners() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { data: custom, isLoading } = usePageBanners();
  const [uploadingFor, setUploadingFor] = useState<PageBannerKey | null>(null);

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

  const saveMutation = useMutation({
    mutationFn: ({ page, imageSrc }: { page: PageBannerKey; imageSrc: string | null }) =>
      apiRequest("PUT", `/api/page-banners/${page}`, { imageSrc }),
    onSuccess: (_res, { imageSrc }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/page-banners"] });
      toast({ title: "Spremljeno", description: imageSrc ? "Slika je promijenjena" : "Vraćena je zadana slika" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Sesija je istekla", description: "Prijavite se ponovno.", variant: "destructive" });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      } else {
        toast({ title: "Greška", description: "Slika nije spremljena", variant: "destructive" });
      }
    },
  });

  const handleUpload = async (page: PageBannerKey, file: File) => {
    setUploadingFor(page);
    try {
      const imageSrc = await uploadImage(file);
      saveMutation.mutate({ page, imageSrc });
    } catch (error) {
      toast({ title: "Greška", description: (error as Error).message, variant: "destructive" });
    } finally {
      setUploadingFor(null);
    }
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Naslovne slike</h1>
          <p className="text-muted-foreground">
            Pozadinska slika na vrhu svake stranice. Najbolje izgledaju široke (ležeće) fotografije, barem 1600 piksela
            širine; tekst se ispisuje preko donjeg dijela slike.
          </p>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Učitavanje...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {PAGE_BANNERS.map((page) => {
              const customImage = custom?.[page.key];
              const shown = customImage ?? page.defaultImage;
              const busy = uploadingFor === page.key || (saveMutation.isPending && saveMutation.variables?.page === page.key);
              return (
                <Card key={page.key} className="overflow-hidden" data-testid={`banner-card-${page.key}`}>
                  <div className="relative aspect-[16/7] bg-brand-gradient">
                    {shown ? (
                      <img src={shown} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <img
                        src="/rk-biograd-logo-192.png"
                        alt=""
                        aria-hidden="true"
                        className="absolute -right-4 -bottom-6 h-32 w-auto opacity-10 rotate-6"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(232_85%_10%/0.85)] to-transparent" />
                    <div className="absolute bottom-3 left-4 font-display text-2xl font-extrabold uppercase text-white">
                      {page.label}
                    </div>
                    <span
                      className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                        customImage ? "bg-accent text-accent-foreground" : "bg-white/85 text-primary"
                      }`}
                    >
                      {customImage ? "Vlastita slika" : shown ? "Zadana slika" : "Bez slike"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 p-4">
                    <Button asChild size="sm" disabled={busy} data-testid={`button-change-banner-${page.key}`}>
                      <label className={busy ? "pointer-events-none opacity-60" : "cursor-pointer"}>
                        <ImagePlus className="h-4 w-4" />
                        {busy ? "Spremanje..." : "Promijeni sliku"}
                        <input
                          type="file"
                          accept={IMAGE_ACCEPT}
                          className="sr-only"
                          disabled={busy}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            if (file) handleUpload(page.key, file);
                          }}
                          data-testid={`input-banner-${page.key}`}
                        />
                      </label>
                    </Button>
                    {customImage && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => {
                          const what = page.defaultImage ? "zadanu sliku" : "plavu pozadinu bez slike";
                          if (window.confirm(`Vratiti ${what} na stranici ${page.label}?`)) {
                            saveMutation.mutate({ page: page.key, imageSrc: null });
                          }
                        }}
                        data-testid={`button-reset-banner-${page.key}`}
                      >
                        <RotateCcw className="h-4 w-4" />
                        Vrati zadanu
                      </Button>
                    )}
                    <Button asChild size="sm" variant="ghost" className="ml-auto">
                      <a href={page.path} target="_blank" rel="noreferrer">
                        Pogledaj
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
