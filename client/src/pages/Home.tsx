import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { 
  Activity, 
  ArrowRight, 
  Brain, 
  Calendar, 
  CheckCircle2, 
  Dumbbell, 
  Flame, 
  Heart, 
  LineChart, 
  Moon, 
  Scale, 
  Target,
  Droplets,
  Sparkles,
  Users,
  Trophy,
  Clock
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Flame className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">90-Tage Challenge</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#tracking" className="text-muted-foreground hover:text-foreground transition-colors">Tracking</a>
            <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">Services</a>
            <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button>Dashboard öffnen</Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button>Jetzt starten</Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Für ambitionierte Unternehmer</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                90 Tage zur
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                besten Version
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Körperliche und mentale Fitness sind die Grundlage für unternehmerischen Erfolg. 
              Tracke deine Gesundheitsdaten, optimiere deinen Lifestyle und erreiche deine Ziele.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                    Zum Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                    Challenge starten
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>
              )}
              <Link href="/blog">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Mehr erfahren
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">90</div>
                <div className="text-sm text-muted-foreground">Tage Challenge</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">7+</div>
                <div className="text-sm text-muted-foreground">Tracking-Bereiche</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Datenhoheit</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Warum Fitness für Unternehmer?
            </h2>
            <div className="section-divider mb-6" />
            <p className="text-lg text-muted-foreground">
              Als Unternehmer stehst du vor besonderen Herausforderungen. Lange Arbeitstage, 
              Stress und wenig Zeit für dich selbst. Doch genau hier liegt der Schlüssel zum Erfolg.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="fitness-card border-0 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Mentale Klarheit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Regelmäßige Bewegung und guter Schlaf steigern deine Konzentration und 
                  Entscheidungsfähigkeit um bis zu 40%.
                </p>
              </CardContent>
            </Card>
            
            <Card className="fitness-card border-0 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle>Mehr Energie</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Optimierte Ernährung und Training geben dir die Energie, die du für 
                  lange Arbeitstage und wichtige Meetings brauchst.
                </p>
              </CardContent>
            </Card>
            
            <Card className="fitness-card border-0 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-secondary-foreground" />
                </div>
                <CardTitle>Langfristige Gesundheit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Investiere jetzt in deine Gesundheit, um langfristig leistungsfähig 
                  zu bleiben und dein Unternehmen erfolgreich zu führen.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Alles was du brauchst
            </h2>
            <div className="section-divider mb-6" />
            <p className="text-lg text-muted-foreground">
              Eine Plattform für dein komplettes Gesundheits-Tracking. 
              Von Schlaf bis Training, von Ernährung bis Regeneration.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Moon, title: "Schlaf-Tracking", desc: "Tiefschlaf, REM, Schlafqualität" },
              { icon: Scale, title: "Körperdaten", desc: "Gewicht, Körperfett, Muskelmasse" },
              { icon: Heart, title: "Blutdruck", desc: "Systolisch, Diastolisch, Puls" },
              { icon: Droplets, title: "Wasseraufnahme", desc: "Tägliche Hydration tracken" },
              { icon: Dumbbell, title: "Training", desc: "Workouts, Dauer, Intensität" },
              { icon: Flame, title: "Sauna & Wellness", desc: "Regeneration dokumentieren" },
              { icon: Target, title: "Ernährung", desc: "Mahlzeiten, Kalorien, Makros" },
              { icon: LineChart, title: "Fortschritt", desc: "90-Tage Visualisierung" },
            ].map((feature, i) => (
              <Card key={i} className="fitness-card group cursor-pointer">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tracking Preview Section */}
      <section id="tracking" className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Dein persönliches<br />
                <span className="text-primary">Gesundheits-Dashboard</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Alle deine Gesundheitsdaten an einem Ort. Tracke täglich deine Fortschritte 
                und sieh, wie sich deine Werte über die 90 Tage verbessern.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: CheckCircle2, text: "Tägliches Tracking in unter 2 Minuten" },
                  { icon: CheckCircle2, text: "Automatische Fortschrittsberechnung" },
                  { icon: CheckCircle2, text: "Visuelle Diagramme und Trends" },
                  { icon: CheckCircle2, text: "Export deiner Daten jederzeit möglich" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-primary" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button size="lg">
                      Dashboard öffnen
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <a href={getLoginUrl()}>
                    <Button size="lg">
                      Kostenlos starten
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
            
            {/* Dashboard Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
              <Card className="relative bg-card/80 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Heute
                  </CardTitle>
                  <CardDescription>Dein Tagesüberblick</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Sample tracking items */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Moon className="w-5 h-5 text-chart-4" />
                      <span>Schlaf</span>
                    </div>
                    <span className="font-semibold">7h 32min</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Scale className="w-5 h-5 text-chart-1" />
                      <span>Gewicht</span>
                    </div>
                    <span className="font-semibold">82.4 kg</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Droplets className="w-5 h-5 text-chart-2" />
                      <span>Wasser</span>
                    </div>
                    <span className="font-semibold">2.1 L</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Dumbbell className="w-5 h-5 text-chart-3" />
                      <span>Training</span>
                    </div>
                    <span className="font-semibold text-primary">✓ Erledigt</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Tagesziele</span>
                      <span className="font-semibold">75%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: '75%' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Coaching & Programme
            </h2>
            <div className="section-divider mb-6" />
            <p className="text-lg text-muted-foreground">
              Neben dem kostenlosen Tracking bieten wir individuelle Coaching-Programme 
              für Unternehmer, die mehr erreichen wollen.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
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
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Vollständiges Tracking
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    90-Tage Challenge
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Blog & Updates
                  </li>
                </ul>
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full">Aktiv</Button>
                  </Link>
                ) : (
                  <a href={getLoginUrl()}>
                    <Button variant="outline" className="w-full">Kostenlos starten</Button>
                  </a>
                )}
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
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Alles aus Community
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Persönliche Betreuung
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Wöchentliche Calls
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Individueller Plan
                  </li>
                </ul>
                <Link href="/services">
                  <Button className="w-full">Anfragen</Button>
                </Link>
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
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Alles aus Coaching
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Tägliche Begleitung
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Ernährungsplan
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Trainingsplan
                  </li>
                </ul>
                <Link href="/services">
                  <Button variant="outline" className="w-full">Mehr erfahren</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bereit für die Transformation?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Starte heute deine 90-Tage Challenge und werde zur besten Version deiner selbst. 
              Kostenlos und unverbindlich.
            </p>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  Zum Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  Jetzt kostenlos starten
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Flame className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold">90-Tage Challenge</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Die Fitness-Plattform für ambitionierte Unternehmer.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Plattform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#tracking" className="hover:text-foreground transition-colors">Tracking</a></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/services" className="hover:text-foreground transition-colors">Coaching</Link></li>
                <li><Link href="/services" className="hover:text-foreground transition-colors">Programme</Link></li>
                <li><Link href="/services" className="hover:text-foreground transition-colors">Kontakt</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Impressum</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Datenschutz</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">AGB</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2026 90-Tage Fitness Challenge. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  );
}
