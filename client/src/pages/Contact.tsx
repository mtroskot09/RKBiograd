import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from "lucide-react";
import { FACEBOOK_URL, INSTAGRAM_URL } from "@/lib/club";
import PageBanner from "@/components/PageBanner";
import { lines, phoneHref, useClubInfo } from "@/hooks/useClubInfo";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePageBanner } from "@/lib/pageBanners";

export default function Contact() {
  const bannerImage = usePageBanner("contact");
  const { toast } = useToast();
  const { info } = useClubInfo();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    toast({
      title: "Poruka poslana!",
      description: "Javit ćemo vam se uskoro.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageBanner
            title="Kontakt"
            eyebrow="RK Biograd"
            subtitle="Imate pitanja? Želite se pridružiti klubu? Javite nam se!"
            imageSrc={bannerImage}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold uppercase text-primary mb-6">Pošaljite nam poruku</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Ime i prezime</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Vaše ime"
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="vas.email@example.com"
                      required
                      data-testid="input-email"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Poruka</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Vaša poruka..."
                      rows={5}
                      required
                      data-testid="input-message"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full rounded-full" data-testid="button-submit">
                    Pošalji poruku
                  </Button>
                </form>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold uppercase text-primary mb-6">Informacije</h2>
                <div className="space-y-4">
                  {lines(info.address).length > 0 && (
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-10 w-10 p-2.5 shrink-0 rounded-full bg-secondary text-primary" />
                      <div>
                        <div className="font-semibold text-primary">Adresa</div>
                        <div className="text-muted-foreground" data-testid="text-contact-address">
                          {lines(info.address).map((line) => (
                            <div key={line}>{line}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {info.phone && (
                    <div className="flex items-start space-x-4">
                      <Phone className="h-10 w-10 p-2.5 shrink-0 rounded-full bg-secondary text-primary" />
                      <div>
                        <div className="font-semibold text-primary">Telefon</div>
                        <a href={phoneHref(info.phone)} className="text-muted-foreground hover:text-primary hover:underline" data-testid="link-contact-phone">
                          {info.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {info.email && (
                    <div className="flex items-start space-x-4">
                      <Mail className="h-10 w-10 p-2.5 shrink-0 rounded-full bg-secondary text-primary" />
                      <div className="min-w-0">
                        <div className="font-semibold text-primary">Email</div>
                        <a href={`mailto:${info.email}`} className="text-muted-foreground hover:text-primary hover:underline break-all" data-testid="link-contact-email">
                          {info.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {lines(info.officeHours).length > 0 && (
                    <div className="flex items-start space-x-4">
                      <Clock className="h-10 w-10 p-2.5 shrink-0 rounded-full bg-secondary text-primary" />
                      <div>
                        <div className="font-semibold text-primary">Radno vrijeme</div>
                        <div className="text-muted-foreground" data-testid="text-contact-hours">
                          {lines(info.officeHours).map((line) => (
                            <div key={line}>{line}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start space-x-4">
                    <Facebook className="h-10 w-10 p-2.5 shrink-0 rounded-full bg-secondary text-primary" />
                    <div>
                      <div className="font-semibold text-primary">Društvene mreže</div>
                      <div className="flex flex-col text-muted-foreground">
                        <a
                          href={FACEBOOK_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 hover:text-foreground hover:underline"
                          data-testid="link-contact-facebook"
                        >
                          <Facebook className="h-4 w-4" />
                          Facebook
                        </a>
                        <a
                          href={INSTAGRAM_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 hover:text-foreground hover:underline"
                          data-testid="link-contact-instagram"
                        >
                          <Instagram className="h-4 w-4" />
                          @rkbiograd
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-bold uppercase text-primary mb-4">Pridružite se klubu</h2>
                <p className="text-muted-foreground mb-4">
                  Zainteresirani ste za rukomet? Pridružite se RK Biograd i postanite dio naše obitelji!
                </p>
                <p className="text-sm text-muted-foreground">
                  Kontaktirajte nas za više informacija o upisima u mlade selekcije ili seniorsku ekipu.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
