import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Flame, Mail, Phone, Send, Trophy, Users, Clock } from "lucide-react";
import { useState } from "react";

export default function Services() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    message: "",
  });

  const inquiryMutation = trpc.inquiries.create.useMutation({
    onSuccess: () => {
      toast.success("Anfrage erfolgreich gesendet! Wir melden uns bei dir.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    },
    onError: () => {
      toast.error("Fehler beim Senden. Bitte versuche es erneut.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Bitte fülle alle Pflichtfelder aus.");
      return;
    }
    inquiryMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Flame className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">90-Tage Challenge</span>
            </div>
          </Link>
          
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </Link>
        </div>
      </nav>

      <main className="container pt-24 pb-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Coaching & Programme</h1>
          <p className="text-lg text-muted-foreground">
            Erreiche deine Ziele schneller mit persönlicher Betreuung und maßgeschneiderten Programmen.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="fitness-card">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <CardTitle>Community</CardTitle>
              <CardDescription>Kostenlos</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  Vollständiges Gesundheits-Tracking
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  90-Tage Challenge Teilnahme
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  Blog & Updates
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  Fortschritts-Visualisierung
                </li>
              </ul>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">Jetzt starten</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="fitness-card border-primary/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg">
              Beliebt
            </div>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>1:1 Coaching</CardTitle>
              <CardDescription>Auf Anfrage</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  Alles aus Community
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  Persönliche Betreuung
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  Wöchentliche Video-Calls
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  Individueller Trainingsplan
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  WhatsApp Support
                </li>
              </ul>
              <Button className="w-full" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Anfragen
              </Button>
            </CardContent>
          </Card>
          
          <Card className="fitness-card">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-accent-foreground" />
              </div>
              <CardTitle>Intensiv-Programm</CardTitle>
              <CardDescription>12 Wochen</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  Alles aus 1:1 Coaching
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  Tägliche Begleitung
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  Personalisierter Ernährungsplan
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  Wöchentliche Anpassungen
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  Mindset-Coaching
                </li>
              </ul>
              <Button variant="outline" className="w-full" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Mehr erfahren
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div id="contact" className="max-w-2xl mx-auto">
          <Card className="fitness-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Kontakt aufnehmen</CardTitle>
              <CardDescription>
                Interessiert an einem Coaching? Schreib uns und wir melden uns innerhalb von 24 Stunden.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dein Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail *</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="deine@email.de"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon (optional)</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+49 123 456789"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Nachricht *</Label>
                  <Textarea 
                    id="message" 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Erzähl uns von deinen Zielen und was dich interessiert..."
                    rows={5}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={inquiryMutation.isPending}>
                  {inquiryMutation.isPending ? (
                    "Wird gesendet..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Anfrage senden
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 90-Tage Fitness Challenge. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
}
