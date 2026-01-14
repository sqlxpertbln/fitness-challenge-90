import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import { 
  Activity, 
  ArrowLeft, 
  Calendar,
  Droplets, 
  Dumbbell, 
  Flame, 
  Heart, 
  Moon, 
  Plus,
  Scale,
  Target,
  TrendingUp,
  User,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { getLoginUrl } from "@/const";

export default function Dashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
  // Queries
  const sleepQuery = trpc.sleep.getByDate.useQuery({ date: selectedDate }, { enabled: isAuthenticated });
  const bodyQuery = trpc.body.getByDate.useQuery({ date: selectedDate }, { enabled: isAuthenticated });
  const waterQuery = trpc.water.dailyTotal.useQuery({ date: selectedDate }, { enabled: isAuthenticated });
  const trainingQuery = trpc.training.list.useQuery({ startDate: selectedDate, endDate: selectedDate }, { enabled: isAuthenticated });
  
  // Mutations
  const sleepMutation = trpc.sleep.create.useMutation({
    onSuccess: () => {
      toast.success("Schlaf-Daten gespeichert");
      sleepQuery.refetch();
    },
    onError: () => toast.error("Fehler beim Speichern"),
  });
  
  const bodyMutation = trpc.body.create.useMutation({
    onSuccess: () => {
      toast.success("Körperdaten gespeichert");
      bodyQuery.refetch();
    },
    onError: () => toast.error("Fehler beim Speichern"),
  });
  
  const waterMutation = trpc.water.add.useMutation({
    onSuccess: () => {
      toast.success("Wasser hinzugefügt");
      waterQuery.refetch();
    },
    onError: () => toast.error("Fehler beim Speichern"),
  });
  
  const trainingMutation = trpc.training.create.useMutation({
    onSuccess: () => {
      toast.success("Training gespeichert");
      trainingQuery.refetch();
    },
    onError: () => toast.error("Fehler beim Speichern"),
  });

  const handleLogout = async () => {
    await logout();
    setLocation("/");
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
              <Flame className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle>Anmeldung erforderlich</CardTitle>
            <CardDescription>
              Melde dich an, um auf dein Dashboard zuzugreifen.
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Flame className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">Dashboard</span>
        </div>
        
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2 bg-sidebar-accent">
            <Activity className="w-4 h-4" />
            Übersicht
          </Button>
          <Link href="/progress">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <TrendingUp className="w-4 h-4" />
              Fortschritt
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Calendar className="w-4 h-4" />
            Historie
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <User className="w-4 h-4" />
            Profil
          </Button>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <ArrowLeft className="w-4 h-4" />
              Zur Startseite
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start gap-2 text-destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Abmelden
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              Hallo, {user?.name || "Challenger"}!
            </h1>
            <p className="text-muted-foreground">
              Tracke deine Fortschritte für den {format(new Date(selectedDate), "d. MMMM yyyy")}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
            <Link href="/" className="lg:hidden">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="fitness-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Schlaf</p>
                  <p className="text-xl font-bold">
                    {sleepQuery.data?.totalSleep 
                      ? `${Math.floor(sleepQuery.data.totalSleep / 60)}h ${sleepQuery.data.totalSleep % 60}min`
                      : "—"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="fitness-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gewicht</p>
                  <p className="text-xl font-bold">
                    {bodyQuery.data?.weight ? `${bodyQuery.data.weight} kg` : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="fitness-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Wasser</p>
                  <p className="text-xl font-bold">
                    {waterQuery.data ? `${(waterQuery.data / 1000).toFixed(1)} L` : "0 L"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="fitness-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Training</p>
                  <p className="text-xl font-bold">
                    {trainingQuery.data && trainingQuery.data.length > 0 
                      ? `${trainingQuery.data.length}x`
                      : "—"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tracking Tabs */}
        <Tabs defaultValue="sleep" className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-6 w-full">
            <TabsTrigger value="sleep" className="gap-2">
              <Moon className="w-4 h-4" />
              <span className="hidden sm:inline">Schlaf</span>
            </TabsTrigger>
            <TabsTrigger value="body" className="gap-2">
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">Körper</span>
            </TabsTrigger>
            <TabsTrigger value="water" className="gap-2">
              <Droplets className="w-4 h-4" />
              <span className="hidden sm:inline">Wasser</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="gap-2">
              <Dumbbell className="w-4 h-4" />
              <span className="hidden sm:inline">Training</span>
            </TabsTrigger>
            <TabsTrigger value="blood" className="gap-2 hidden lg:flex">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Blutdruck</span>
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="gap-2 hidden lg:flex">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Ernährung</span>
            </TabsTrigger>
          </TabsList>

          {/* Sleep Tab */}
          <TabsContent value="sleep">
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-chart-4" />
                  Schlaf-Tracking
                </CardTitle>
                <CardDescription>
                  Erfasse deine Schlafdaten für den {format(new Date(selectedDate), "d. MMMM")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  sleepMutation.mutate({
                    entryDate: selectedDate,
                    totalSleep: Number(formData.get("totalSleep")) || undefined,
                    deepSleep: Number(formData.get("deepSleep")) || undefined,
                    remSleep: Number(formData.get("remSleep")) || undefined,
                    sleepQuality: formData.get("sleepQuality") as "poor" | "fair" | "good" | "excellent" || undefined,
                    notes: formData.get("notes") as string || undefined,
                  });
                }} className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalSleep">Gesamtschlaf (Minuten)</Label>
                      <Input 
                        id="totalSleep" 
                        name="totalSleep" 
                        type="number" 
                        placeholder="z.B. 450"
                        defaultValue={sleepQuery.data?.totalSleep || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deepSleep">Tiefschlaf (Minuten)</Label>
                      <Input 
                        id="deepSleep" 
                        name="deepSleep" 
                        type="number" 
                        placeholder="z.B. 90"
                        defaultValue={sleepQuery.data?.deepSleep || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="remSleep">REM-Schlaf (Minuten)</Label>
                      <Input 
                        id="remSleep" 
                        name="remSleep" 
                        type="number" 
                        placeholder="z.B. 120"
                        defaultValue={sleepQuery.data?.remSleep || ""}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sleepQuality">Schlafqualität</Label>
                      <Select name="sleepQuality" defaultValue={sleepQuery.data?.sleepQuality || ""}>
                        <SelectTrigger>
                          <SelectValue placeholder="Auswählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="poor">Schlecht</SelectItem>
                          <SelectItem value="fair">Mäßig</SelectItem>
                          <SelectItem value="good">Gut</SelectItem>
                          <SelectItem value="excellent">Ausgezeichnet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notizen</Label>
                      <Input 
                        id="notes" 
                        name="notes" 
                        placeholder="z.B. Gut geschlafen, keine Unterbrechungen"
                        defaultValue={sleepQuery.data?.notes || ""}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={sleepMutation.isPending}>
                    {sleepMutation.isPending ? "Speichern..." : "Speichern"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Body Tab */}
          <TabsContent value="body">
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-chart-1" />
                  Körperdaten
                </CardTitle>
                <CardDescription>
                  Erfasse deine Körperdaten von der Waage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  bodyMutation.mutate({
                    entryDate: selectedDate,
                    weight: formData.get("weight") as string || undefined,
                    bodyFat: formData.get("bodyFat") as string || undefined,
                    muscleMass: formData.get("muscleMass") as string || undefined,
                    bodyWater: formData.get("bodyWater") as string || undefined,
                    visceralFat: Number(formData.get("visceralFat")) || undefined,
                    notes: formData.get("notes") as string || undefined,
                  });
                }} className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Gewicht (kg)</Label>
                      <Input 
                        id="weight" 
                        name="weight" 
                        type="number" 
                        step="0.1"
                        placeholder="z.B. 82.5"
                        defaultValue={bodyQuery.data?.weight || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bodyFat">Körperfett (%)</Label>
                      <Input 
                        id="bodyFat" 
                        name="bodyFat" 
                        type="number" 
                        step="0.1"
                        placeholder="z.B. 18.5"
                        defaultValue={bodyQuery.data?.bodyFat || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="muscleMass">Muskelmasse (kg)</Label>
                      <Input 
                        id="muscleMass" 
                        name="muscleMass" 
                        type="number" 
                        step="0.1"
                        placeholder="z.B. 35.2"
                        defaultValue={bodyQuery.data?.muscleMass || ""}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bodyWater">Körperwasser (%)</Label>
                      <Input 
                        id="bodyWater" 
                        name="bodyWater" 
                        type="number" 
                        step="0.1"
                        placeholder="z.B. 55.0"
                        defaultValue={bodyQuery.data?.bodyWater || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visceralFat">Viszeralfett (Level)</Label>
                      <Input 
                        id="visceralFat" 
                        name="visceralFat" 
                        type="number"
                        placeholder="z.B. 8"
                        defaultValue={bodyQuery.data?.visceralFat || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notizen</Label>
                      <Input 
                        id="notes" 
                        name="notes" 
                        placeholder="Optionale Notizen"
                        defaultValue={bodyQuery.data?.notes || ""}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={bodyMutation.isPending}>
                    {bodyMutation.isPending ? "Speichern..." : "Speichern"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Water Tab */}
          <TabsContent value="water">
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-chart-2" />
                  Wasseraufnahme
                </CardTitle>
                <CardDescription>
                  Heute: {waterQuery.data ? `${(waterQuery.data / 1000).toFixed(1)} L` : "0 L"} getrunken
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {[250, 330, 500, 750, 1000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => waterMutation.mutate({ entryDate: selectedDate, amount })}
                      disabled={waterMutation.isPending}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {amount >= 1000 ? `${amount / 1000} L` : `${amount} ml`}
                    </Button>
                  ))}
                </div>
                
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tagesziel: 3 Liter</span>
                    <span className="font-semibold">
                      {waterQuery.data ? Math.min(100, Math.round((waterQuery.data / 3000) * 100)) : 0}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${waterQuery.data ? Math.min(100, (waterQuery.data / 3000) * 100) : 0}%` }} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training">
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-chart-3" />
                  Training
                </CardTitle>
                <CardDescription>
                  Erfasse dein Workout für heute
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  trainingMutation.mutate({
                    entryDate: selectedDate,
                    workoutType: formData.get("workoutType") as string,
                    duration: Number(formData.get("duration")) || undefined,
                    caloriesBurned: Number(formData.get("caloriesBurned")) || undefined,
                    intensity: formData.get("intensity") as "light" | "moderate" | "intense" | "maximum" || undefined,
                    notes: formData.get("notes") as string || undefined,
                  });
                }} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="workoutType">Trainingsart</Label>
                      <Select name="workoutType" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Auswählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Krafttraining">Krafttraining</SelectItem>
                          <SelectItem value="Cardio">Cardio</SelectItem>
                          <SelectItem value="HIIT">HIIT</SelectItem>
                          <SelectItem value="Yoga">Yoga</SelectItem>
                          <SelectItem value="Schwimmen">Schwimmen</SelectItem>
                          <SelectItem value="Laufen">Laufen</SelectItem>
                          <SelectItem value="Radfahren">Radfahren</SelectItem>
                          <SelectItem value="Sonstiges">Sonstiges</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Dauer (Minuten)</Label>
                      <Input 
                        id="duration" 
                        name="duration" 
                        type="number" 
                        placeholder="z.B. 60"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="intensity">Intensität</Label>
                      <Select name="intensity">
                        <SelectTrigger>
                          <SelectValue placeholder="Auswählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Leicht</SelectItem>
                          <SelectItem value="moderate">Moderat</SelectItem>
                          <SelectItem value="intense">Intensiv</SelectItem>
                          <SelectItem value="maximum">Maximal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="caloriesBurned">Kalorien verbrannt</Label>
                      <Input 
                        id="caloriesBurned" 
                        name="caloriesBurned" 
                        type="number" 
                        placeholder="z.B. 450"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notizen</Label>
                    <Textarea 
                      id="notes" 
                      name="notes" 
                      placeholder="z.B. Brust & Trizeps, 4 Sätze pro Übung"
                    />
                  </div>
                  
                  <Button type="submit" disabled={trainingMutation.isPending}>
                    {trainingMutation.isPending ? "Speichern..." : "Training speichern"}
                  </Button>
                </form>
                
                {/* Today's trainings */}
                {trainingQuery.data && trainingQuery.data.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="font-semibold mb-4">Heutige Trainings</h4>
                    <div className="space-y-2">
                      {trainingQuery.data.map((training) => (
                        <div key={training.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Dumbbell className="w-4 h-4 text-chart-3" />
                            <span className="font-medium">{training.workoutType}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {training.duration ? `${training.duration} min` : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blood Pressure Tab */}
          <TabsContent value="blood">
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-destructive" />
                  Blutdruck
                </CardTitle>
                <CardDescription>
                  Erfasse deine Blutdruckwerte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Blutdruck-Tracking wird in Kürze verfügbar sein.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition">
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-chart-5" />
                  Ernährung
                </CardTitle>
                <CardDescription>
                  Tracke deine Mahlzeiten und Kalorien
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ernährungs-Tracking wird in Kürze verfügbar sein.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
