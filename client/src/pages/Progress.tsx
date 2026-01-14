import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { 
  ArrowLeft, 
  Calendar,
  Droplets, 
  Dumbbell, 
  Flame, 
  Heart, 
  Moon, 
  Scale,
  TrendingDown,
  TrendingUp,
  Activity,
  LogOut
} from "lucide-react";
import { format, subDays } from "date-fns";
import { de } from "date-fns/locale";
import { getLoginUrl } from "@/const";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

export default function Progress() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  
  // Get data for the last 30 days
  const startDate = format(subDays(new Date(), 30), "yyyy-MM-dd");
  const endDate = format(new Date(), "yyyy-MM-dd");
  
  const bodyQuery = trpc.body.list.useQuery(
    { startDate, endDate },
    { enabled: isAuthenticated }
  );
  
  const sleepQuery = trpc.sleep.list.useQuery(
    { startDate, endDate },
    { enabled: isAuthenticated }
  );
  
  const waterQuery = trpc.water.list.useQuery(
    { date: startDate },
    { enabled: isAuthenticated }
  );
  
  const trainingQuery = trpc.training.list.useQuery(
    { startDate, endDate },
    { enabled: isAuthenticated }
  );

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
              Melde dich an, um deinen Fortschritt zu sehen.
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

  // Prepare chart data
  const weightData = bodyQuery.data?.map((entry) => ({
    date: format(new Date(entry.entryDate), "dd.MM", { locale: de }),
    weight: entry.weight ? parseFloat(entry.weight) : null,
    bodyFat: entry.bodyFat ? parseFloat(entry.bodyFat) : null,
  })).reverse() || [];

  const sleepData = sleepQuery.data?.map((entry) => ({
    date: format(new Date(entry.entryDate), "dd.MM", { locale: de }),
    totalSleep: entry.totalSleep ? entry.totalSleep / 60 : null, // Convert to hours
    deepSleep: entry.deepSleep ? entry.deepSleep / 60 : null,
    remSleep: entry.remSleep ? entry.remSleep / 60 : null,
  })).reverse() || [];

  const waterData = waterQuery.data?.map((entry) => ({
    date: format(new Date(entry.entryDate), "dd.MM", { locale: de }),
    amount: entry.amount / 1000, // Convert to liters
  })).reverse() || [];

  // Calculate stats
  const latestWeight = bodyQuery.data?.[0]?.weight ? parseFloat(bodyQuery.data[0].weight) : null;
  const firstWeight = bodyQuery.data?.[bodyQuery.data.length - 1]?.weight 
    ? parseFloat(bodyQuery.data[bodyQuery.data.length - 1].weight!) 
    : null;
  const weightChange = latestWeight && firstWeight ? latestWeight - firstWeight : null;

  const avgSleep = sleepQuery.data?.length 
    ? sleepQuery.data.reduce((sum, e) => sum + (e.totalSleep || 0), 0) / sleepQuery.data.length / 60
    : null;

  const totalTrainings = trainingQuery.data?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border p-4 hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Flame className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">Fortschritt</span>
        </div>
        
        <nav className="space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Activity className="w-4 h-4" />
              Übersicht
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start gap-2 bg-sidebar-accent">
            <TrendingUp className="w-4 h-4" />
            Fortschritt
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Calendar className="w-4 h-4" />
            Historie
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
            <h1 className="text-2xl font-bold">Dein Fortschritt</h1>
            <p className="text-muted-foreground">
              Übersicht der letzten 30 Tage
            </p>
          </div>
          
          <Link href="/dashboard" className="lg:hidden">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="fitness-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gewicht</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold">
                      {latestWeight ? `${latestWeight.toFixed(1)} kg` : "—"}
                    </p>
                    {weightChange !== null && (
                      <span className={`text-xs flex items-center ${weightChange < 0 ? 'text-chart-3' : 'text-destructive'}`}>
                        {weightChange < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                        {Math.abs(weightChange).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="fitness-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ø Schlaf</p>
                  <p className="text-xl font-bold">
                    {avgSleep ? `${avgSleep.toFixed(1)}h` : "—"}
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
                  <p className="text-sm text-muted-foreground">Wasser-Einträge</p>
                  <p className="text-xl font-bold">
                    {waterQuery.data?.length || 0}
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
                  <p className="text-sm text-muted-foreground">Trainings</p>
                  <p className="text-xl font-bold">{totalTrainings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weight Chart */}
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-chart-1" />
                Gewichtsverlauf
              </CardTitle>
              <CardDescription>Letzte 30 Tage</CardDescription>
            </CardHeader>
            <CardContent>
              {weightData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={weightData}>
                    <defs>
                      <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis domain={['auto', 'auto']} className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="hsl(var(--chart-1))" 
                      fill="url(#weightGradient)" 
                      strokeWidth={2}
                      name="Gewicht (kg)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  Noch keine Gewichtsdaten vorhanden
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sleep Chart */}
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-chart-4" />
                Schlafanalyse
              </CardTitle>
              <CardDescription>Letzte 30 Tage</CardDescription>
            </CardHeader>
            <CardContent>
              {sleepData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={sleepData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="totalSleep" fill="hsl(var(--chart-4))" name="Gesamt (h)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="deepSleep" fill="hsl(var(--chart-5))" name="Tiefschlaf (h)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  Noch keine Schlafdaten vorhanden
                </div>
              )}
            </CardContent>
          </Card>

          {/* Water Chart */}
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-chart-2" />
                Wasseraufnahme
              </CardTitle>
              <CardDescription>Letzte 30 Tage</CardDescription>
            </CardHeader>
            <CardContent>
              {waterData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={waterData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="amount" fill="hsl(var(--chart-2))" name="Liter" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  Noch keine Wasserdaten vorhanden
                </div>
              )}
            </CardContent>
          </Card>

          {/* Training Overview */}
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-chart-3" />
                Trainingsübersicht
              </CardTitle>
              <CardDescription>Letzte 30 Tage</CardDescription>
            </CardHeader>
            <CardContent>
              {trainingQuery.data && trainingQuery.data.length > 0 ? (
                <div className="space-y-3">
                  {trainingQuery.data.slice(0, 5).map((training) => (
                    <div key={training.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Dumbbell className="w-4 h-4 text-chart-3" />
                        <div>
                          <p className="font-medium">{training.workoutType}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(training.entryDate), "d. MMM", { locale: de })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {training.duration && (
                          <p className="font-medium">{training.duration} min</p>
                        )}
                        {training.caloriesBurned && (
                          <p className="text-xs text-muted-foreground">{training.caloriesBurned} kcal</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {trainingQuery.data.length > 5 && (
                    <p className="text-sm text-center text-muted-foreground">
                      + {trainingQuery.data.length - 5} weitere Trainings
                    </p>
                  )}
                </div>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  Noch keine Trainingsdaten vorhanden
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
