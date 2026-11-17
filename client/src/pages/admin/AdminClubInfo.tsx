import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useClubInfo } from "@/hooks/useClubInfo";
import { clubInfoSchema, type ClubInfo } from "@shared/schema";
import AdminBackButton from "@/components/AdminBackButton";

export default function AdminClubInfo() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { info, isLoading, isFetched } = useClubInfo();

  const form = useForm<ClubInfo>({
    resolver: zodResolver(clubInfoSchema),
    defaultValues: info,
  });

  // Fill the form once the saved details have loaded.
  useEffect(() => {
    if (isFetched) form.reset(info);
  }, [isFetched]); // eslint-disable-line react-hooks/exhaustive-deps

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
    mutationFn: (data: ClubInfo) => apiRequest("PUT", "/api/club-info", data),
    onSuccess: (_res, data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/club-info"] });
      form.reset(data);
      toast({ title: "Spremljeno", description: "Kontakt podaci su spremljeni" });
    },
    onError: (error: Error) => {
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
        toast({ title: "Greška", description: "Kontakt podaci nisu spremljeni", variant: "destructive" });
      }
    },
  });

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
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div>
          <AdminBackButton />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Kontakt podaci</h1>
          <p className="text-muted-foreground">Prikazuju se u podnožju svake stranice i na stranici Kontakt. Prazno polje se ne prikazuje.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kontakt kluba</CardTitle>
            <CardDescription>Na mobitelu se broj telefona i e-mail mogu dodirnuti za poziv ili poruku.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Učitavanje...</p>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => saveMutation.mutate(data))} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+385 23 123 456" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="info@rkbiograd.hr" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresa</FormLabel>
                        <FormControl>
                          <Textarea rows={3} {...field} data-testid="input-address" />
                        </FormControl>
                        <FormDescription>Svaki dio u novi red (u podnožju se spajaju zarezima).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="officeHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Radno vrijeme</FormLabel>
                        <FormControl>
                          <Textarea rows={4} placeholder="Ponedjeljak - Petak: 16:00 - 21:00" {...field} data-testid="input-office-hours" />
                        </FormControl>
                        <FormDescription>Svaki termin u novi red, npr. „Subota: 09:00 - 14:00”.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled={saveMutation.isPending || !form.formState.isDirty}
                    data-testid="button-save-club-info"
                  >
                    {saveMutation.isPending ? "Spremanje..." : "Spremi"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
