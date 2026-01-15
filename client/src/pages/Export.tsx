import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import { 
  ArrowLeft, 
  Download, 
  Flame, 
  FileSpreadsheet,
  Calendar,
  Moon,
  Scale,
  Heart,
  Target,
  Droplets,
  Dumbbell,
  Thermometer,
  LogOut,
  TrendingUp,
  Home
} from "lucide-react";
import { useState } from "react";
import { format, subDays } from "date-fns";
import { getLoginUrl } from "@/const";

export default function Export() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
  const exportQuery = trpc.export.all.useQuery(
    { startDate, endDate },
    { enabled: isAuthenticated }
  );

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const generateCSV = (data: Record<string, unknown>[], filename: string) => {
    if (!data || data.length === 0) {
      toast.error(`Keine Daten für ${filename} vorhanden`);
      return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(";"),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return "";
          if (typeof value === "string" && value.includes(";")) return `"${value}"`;
          return String(value);
        }).join(";")
      )
    ].join("\n");
    
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${startDate}_${endDate}.csv`;
    link.click();
    toast.success(`${filename} exportiert`);
  };

  const exportAll = () => {
    if (!exportQuery.data) return;
    
    const { sleep, body, bloodPressure, nutrition, water, training, sauna } = exportQuery.data;
    
    if (sleep.length > 0) generateCSV(sleep as Record<string, unknown>[], "schlaf");
    if (body.length > 0) generateCSV(body as Record<string, unknown>[], "koerperdaten");
    if (bloodPressure.length > 0) generateCSV(bloodPressure as Record<string, unknown>[], "blutdruck");
    if (nutrition.length > 0) generateCSV(nutrition as Record<string, unknown>[], "ernaehrung");
    if (water.length > 0) generateCSV(water as Record<string, unknown>[], "wasser");
    if (training.length > 0) generateCSV(training as Record<string, unknown>[], "training");
    if (sauna.length > 0) generateCSV(sauna as Record<string, unknown>[], "sauna");
    
    toast.success("Alle Daten exportiert");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
              <Flame className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle>Anmeldung erforderlich</CardTitle>
            <CardDescription>
              Melde dich an, um deine Daten zu exportieren.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <a href={getLoginUrl()}>
              <Button className="w-full">Jetzt anmelden</Button>
            </a>
            <Link href="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück zur Startseite
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border p-4 hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Flame className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">Daten Export</span>
        </div>
        
        <nav className="space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Home className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/progress">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <TrendingUp className="w-4 h-4" />
              Fortschritt
            </Button>
          </Link>
          <Link href="/export">
            <Button variant="secondary" className="w-full justify-start gap-2">
              <Download className="w-4 h-4" />
              Daten Export
            </Button>
          </Link>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Abmelden
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Daten Export</h1>
              <p className="text-muted-foreground">
                Exportiere deine Gesundheitsdaten als CSV-Datei
              </p>
            </div>
            <Link href="/dashboard" className="lg:hidden">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Date Range Selection */}
          <Card className="fitness-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Zeitraum auswählen
              </CardTitle>
              <CardDescription>
                Wähle den Zeitraum für den Export deiner Daten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Von</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Bis</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStartDate(format(subDays(new Date(), 7), "yyyy-MM-dd"));
                    setEndDate(format(new Date(), "yyyy-MM-dd"));
                  }}
                >
                  Letzte 7 Tage
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStartDate(format(subDays(new Date(), 30), "yyyy-MM-dd"));
                    setEndDate(format(new Date(), "yyyy-MM-dd"));
                  }}
                >
                  Letzte 30 Tage
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStartDate(format(subDays(new Date(), 90), "yyyy-MM-dd"));
                    setEndDate(format(new Date(), "yyyy-MM-dd"));
                  }}
                >
                  Letzte 90 Tage
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Export All Button */}
          <Card className="fitness-card mb-8 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Alle Daten exportieren</h3>
                    <p className="text-sm text-muted-foreground">
                      Exportiert alle Kategorien als separate CSV-Dateien
                    </p>
                  </div>
                </div>
                <Button onClick={exportAll} disabled={exportQuery.isLoading}>
                  <Download className="w-4 h-4 mr-2" />
                  Alle exportieren
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Individual Export Options */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { 
                key: "sleep", 
                icon: Moon, 
                title: "Schlaf", 
                color: "text-chart-4",
                bgColor: "bg-chart-4/10"
              },
              { 
                key: "body", 
                icon: Scale, 
                title: "Körperdaten", 
                color: "text-chart-1",
                bgColor: "bg-chart-1/10"
              },
              { 
                key: "bloodPressure", 
                icon: Heart, 
                title: "Blutdruck", 
                color: "text-destructive",
                bgColor: "bg-destructive/10"
              },
              { 
                key: "nutrition", 
                icon: Target, 
                title: "Ernährung", 
                color: "text-chart-5",
                bgColor: "bg-chart-5/10"
              },
              { 
                key: "water", 
                icon: Droplets, 
                title: "Wasser", 
                color: "text-chart-2",
                bgColor: "bg-chart-2/10"
              },
              { 
                key: "training", 
                icon: Dumbbell, 
                title: "Training", 
                color: "text-chart-3",
                bgColor: "bg-chart-3/10"
              },
              { 
                key: "sauna", 
                icon: Thermometer, 
                title: "Sauna", 
                color: "text-orange-500",
                bgColor: "bg-orange-500/10"
              },
            ].map(({ key, icon: Icon, title, color, bgColor }) => {
              const data = exportQuery.data?.[key as keyof typeof exportQuery.data] as Record<string, unknown>[] | undefined;
              const count = data?.length || 0;
              
              return (
                <Card key={key} className="fitness-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {count} Einträge
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => data && generateCSV(data, title.toLowerCase())}
                        disabled={!data || count === 0}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
