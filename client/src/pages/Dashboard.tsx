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
  Download,
  Droplets, 
  Dumbbell, 
  Flame, 
  Heart, 
  Moon, 
  Plus,
  Scale,
  Target,
  Thermometer,
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
  const saunaQuery = trpc.sauna.list.useQuery({ startDate: selectedDate, endDate: selectedDate }, { enabled: isAuthenticated });
  
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

  // Blood Pressure
  const bloodPressureQuery = trpc.bloodPressure.list.useQuery(
    { startDate: selectedDate, endDate: selectedDate },
    { enabled: isAuthenticated }
  );
  
  const bloodPressureMutation = trpc.bloodPressure.create.useMutation({
    onSuccess: () => {
      toast.success("Blutdruck gespeichert");
      bloodPressureQuery.refetch();
    },
    onError: () => toast.error("Fehler beim Speichern"),
  });

  // Nutrition
  const nutritionQuery = trpc.nutrition.list.useQuery(
    { date: selectedDate },
    { enabled: isAuthenticated }
  );
  
  const nutritionMutation = trpc.nutrition.create.useMutation({
    onSuccess: () => {
      toast.success("Mahlzeit gespeichert");
      nutritionQuery.refetch();
    },
    onError: () => toast.error("Fehler beim Speichern"),
  });

  // Sauna
  const saunaMutation = trpc.sauna.create.useMutation({
    onSuccess: () => {
      toast.success("Sauna-Besuch gespeichert");
      saunaQuery.refetch();
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
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
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
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
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
<Link href="/goals">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Target className="w-5 h-5" />
            Meine Ziele
          </Button>
        </Link>
        
        <Link href="/export">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Download className="w-5 h-5" />
            Daten Export
          </Button>
        </Link>
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
            <TabsTrigger value="sauna" className="gap-2">
              <Thermometer className="w-4 h-4" />
              <span className="hidden sm:inline">Sauna</span>
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
                  Erfasse deine Blutdruckwerte vom Blutdruckmessgerät
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const systolic = Number(formData.get("systolic"));
                  const diastolic = Number(formData.get("diastolic"));
                  if (!systolic || !diastolic) {
                    toast.error("Systolisch und Diastolisch sind erforderlich");
                    return;
                  }
                  bloodPressureMutation.mutate({
                    entryDate: selectedDate,
                    systolic,
                    diastolic,
                    pulse: Number(formData.get("pulse")) || undefined,
                    position: formData.get("position") as "sitting" | "standing" | "lying" || undefined,
                    arm: formData.get("arm") as "left" | "right" || undefined,
                    notes: formData.get("notes") as string || undefined,
                  });
                  e.currentTarget.reset();
                }} className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="systolic">Systolisch (mmHg) *</Label>
                      <Input 
                        id="systolic" 
                        name="systolic" 
                        type="number" 
                        placeholder="z.B. 120"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diastolic">Diastolisch (mmHg) *</Label>
                      <Input 
                        id="diastolic" 
                        name="diastolic" 
                        type="number" 
                        placeholder="z.B. 80"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pulse">Puls (bpm)</Label>
                      <Input 
                        id="pulse" 
                        name="pulse" 
                        type="number" 
                        placeholder="z.B. 72"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Select name="position">
                        <SelectTrigger>
                          <SelectValue placeholder="Auswählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sitting">Sitzend</SelectItem>
                          <SelectItem value="standing">Stehend</SelectItem>
                          <SelectItem value="lying">Liegend</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="arm">Arm</Label>
                      <Select name="arm">
                        <SelectTrigger>
                          <SelectValue placeholder="Auswählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Links</SelectItem>
                          <SelectItem value="right">Rechts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notizen</Label>
                      <Input 
                        id="notes" 
                        name="notes" 
                        placeholder="z.B. Nach dem Aufstehen"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={bloodPressureMutation.isPending}>
                    {bloodPressureMutation.isPending ? "Speichern..." : "Blutdruck speichern"}
                  </Button>
                </form>
                
                {/* Today's measurements */}
                {bloodPressureQuery.data && bloodPressureQuery.data.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="font-semibold mb-4">Heutige Messungen</h4>
                    <div className="space-y-2">
                      {bloodPressureQuery.data.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Heart className="w-4 h-4 text-destructive" />
                            <span className="font-medium">{entry.systolic}/{entry.diastolic} mmHg</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {entry.pulse ? `${entry.pulse} bpm` : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  nutritionMutation.mutate({
                    entryDate: selectedDate,
                    mealType: formData.get("mealType") as "breakfast" | "lunch" | "dinner" | "snack" || undefined,
                    description: formData.get("description") as string || undefined,
                    calories: Number(formData.get("calories")) || undefined,
                    protein: formData.get("protein") as string || undefined,
                    carbs: formData.get("carbs") as string || undefined,
                    fat: formData.get("fat") as string || undefined,
                    notes: formData.get("notes") as string || undefined,
                  });
                  e.currentTarget.reset();
                }} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mealType">Mahlzeit</Label>
                      <Select name="mealType">
                        <SelectTrigger>
                          <SelectValue placeholder="Auswählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breakfast">Frühstück</SelectItem>
                          <SelectItem value="lunch">Mittagessen</SelectItem>
                          <SelectItem value="dinner">Abendessen</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Beschreibung</Label>
                      <Input 
                        id="description" 
                        name="description" 
                        placeholder="z.B. Haferflocken mit Banane"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="calories">Kalorien (kcal)</Label>
                      <Input 
                        id="calories" 
                        name="calories" 
                        type="number" 
                        placeholder="z.B. 450"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="protein">Protein (g)</Label>
                      <Input 
                        id="protein" 
                        name="protein" 
                        placeholder="z.B. 25"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="carbs">Kohlenhydrate (g)</Label>
                      <Input 
                        id="carbs" 
                        name="carbs" 
                        placeholder="z.B. 60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fat">Fett (g)</Label>
                      <Input 
                        id="fat" 
                        name="fat" 
                        placeholder="z.B. 15"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notizen</Label>
                    <Input 
                      id="notes" 
                      name="notes" 
                      placeholder="z.B. Selbst gekocht, viel Gemüse"
                    />
                  </div>
                  
                  <Button type="submit" disabled={nutritionMutation.isPending}>
                    {nutritionMutation.isPending ? "Speichern..." : "Mahlzeit speichern"}
                  </Button>
                </form>
                
                {/* Today's meals */}
                {nutritionQuery.data && nutritionQuery.data.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="font-semibold mb-4">Heutige Mahlzeiten</h4>
                    <div className="space-y-2">
                      {nutritionQuery.data.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Target className="w-4 h-4 text-chart-5" />
                            <div>
                              <span className="font-medium capitalize">
                                {entry.mealType === "breakfast" ? "Frühstück" :
                                 entry.mealType === "lunch" ? "Mittagessen" :
                                 entry.mealType === "dinner" ? "Abendessen" :
                                 entry.mealType === "snack" ? "Snack" : "Mahlzeit"}
                              </span>
                              {entry.description && (
                                <span className="text-sm text-muted-foreground ml-2">
                                  - {entry.description}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {entry.calories ? `${entry.calories} kcal` : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Daily summary */}
                    <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Tagesgesamt</span>
                        <span className="font-bold text-primary">
                          {nutritionQuery.data.reduce((sum, e) => sum + (e.calories || 0), 0)} kcal
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sauna Tab */}
          <TabsContent value="sauna">
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                  Sauna
                </CardTitle>
                <CardDescription>
                  Erfasse deine Sauna-Besuche und Wellness-Aktivitäten
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const duration = Number(formData.get("duration"));
                  if (!duration) {
                    toast.error("Bitte gib die Dauer an");
                    return;
                  }
                  saunaMutation.mutate({
                    entryDate: selectedDate,
                    duration,
                    temperature: Number(formData.get("temperature")) || undefined,
                    saunaType: formData.get("saunaType") as "finnish" | "bio" | "steam" | "infrared" | undefined,
                    rounds: Number(formData.get("rounds")) || undefined,
                    notes: formData.get("notes") as string || undefined,
                  });
                  e.currentTarget.reset();
                }} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="saunaType">Sauna-Typ</Label>
                      <Select name="saunaType">
                        <SelectTrigger>
                          <SelectValue placeholder="Auswählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="finnish">Finnische Sauna</SelectItem>
                          <SelectItem value="bio">Bio-Sauna</SelectItem>
                          <SelectItem value="steam">Dampfbad</SelectItem>
                          <SelectItem value="infrared">Infrarot-Sauna</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperatur (°C)</Label>
                      <Input 
                        id="temperature" 
                        name="temperature" 
                        type="number" 
                        placeholder="z.B. 85"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Gesamtdauer (Minuten)</Label>
                      <Input 
                        id="duration" 
                        name="duration" 
                        type="number" 
                        placeholder="z.B. 45"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rounds">Anzahl Gänge</Label>
                      <Input 
                        id="rounds" 
                        name="rounds" 
                        type="number" 
                        placeholder="z.B. 3"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notizen</Label>
                    <Textarea 
                      id="notes" 
                      name="notes" 
                      placeholder="z.B. Aufguss mit Eukalyptus, danach Eisbecken"
                    />
                  </div>
                  
                  <Button type="submit" disabled={saunaMutation.isPending}>
                    {saunaMutation.isPending ? "Speichern..." : "Sauna-Besuch speichern"}
                  </Button>
                </form>
                
                {/* Today's sauna sessions */}
                {saunaQuery.data && saunaQuery.data.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="font-semibold mb-4">Heutige Sauna-Besuche</h4>
                    <div className="space-y-2">
                      {saunaQuery.data.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                            <span className="font-medium">
                              {entry.saunaType === "finnish" ? "Finnische Sauna" :
                               entry.saunaType === "bio" ? "Bio-Sauna" :
                               entry.saunaType === "steam" ? "Dampfbad" :
                               entry.saunaType === "infrared" ? "Infrarot" : "Sauna"}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            {entry.temperature && <span>{entry.temperature}°C</span>}
                            {entry.duration && <span>{entry.duration} min</span>}
                            {entry.rounds && <span>{entry.rounds} Gänge</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
