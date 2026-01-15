import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import { 
  ArrowLeft, 
  Check,
  Droplets, 
  Dumbbell, 
  Flame, 
  Moon, 
  Plus,
  Scale,
  Target,
  Trash2,
  TrendingUp,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { getLoginUrl } from "@/const";

const goalTypeConfig = {
  weight: { label: "Gewicht", icon: Scale, unit: "kg", color: "text-orange-500" },
  water: { label: "Wasseraufnahme", icon: Droplets, unit: "L", color: "text-blue-500" },
  sleep: { label: "Schlaf", icon: Moon, unit: "h", color: "text-purple-500" },
  training: { label: "Training", icon: Dumbbell, unit: "Sessions/Woche", color: "text-green-500" },
  calories: { label: "Kalorien", icon: Flame, unit: "kcal", color: "text-red-500" },
  steps: { label: "Schritte", icon: TrendingUp, unit: "Schritte", color: "text-teal-500" },
  body_fat: { label: "Körperfett", icon: Target, unit: "%", color: "text-yellow-500" },
};

export default function Goals() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const goalsQuery = trpc.goals.list.useQuery(undefined, { enabled: isAuthenticated });
  
  const createGoalMutation = trpc.goals.create.useMutation({
    onSuccess: () => {
      toast.success("Ziel erstellt");
      goalsQuery.refetch();
      setIsDialogOpen(false);
    },
    onError: () => toast.error("Fehler beim Erstellen"),
  });
  
  const updateGoalMutation = trpc.goals.update.useMutation({
    onSuccess: () => {
      toast.success("Ziel aktualisiert");
      goalsQuery.refetch();
    },
    onError: () => toast.error("Fehler beim Aktualisieren"),
  });
  
  const completeGoalMutation = trpc.goals.complete.useMutation({
    onSuccess: () => {
      toast.success("Ziel als erreicht markiert!");
      goalsQuery.refetch();
    },
    onError: () => toast.error("Fehler"),
  });
  
  const deleteGoalMutation = trpc.goals.delete.useMutation({
    onSuccess: () => {
      toast.success("Ziel gelöscht");
      goalsQuery.refetch();
    },
    onError: () => toast.error("Fehler beim Löschen"),
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
              <Target className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle>Anmeldung erforderlich</CardTitle>
            <CardDescription>
              Melde dich an, um deine Ziele zu verwalten.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Jetzt anmelden</a>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Zur Startseite</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calculateProgress = (goal: any) => {
    if (!goal.startValue || !goal.currentValue || !goal.targetValue) return 0;
    const start = parseFloat(goal.startValue);
    const current = parseFloat(goal.currentValue);
    const target = parseFloat(goal.targetValue);
    
    // For weight/body_fat, lower is better
    if (goal.goalType === "weight" || goal.goalType === "body_fat") {
      if (start <= target) return 0;
      const progress = ((start - current) / (start - target)) * 100;
      return Math.min(Math.max(progress, 0), 100);
    }
    
    // For other goals, higher is better
    if (target <= start) return 0;
    const progress = ((current - start) / (target - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">Meine Ziele</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Neues Ziel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Neues Ziel erstellen</DialogTitle>
                  <DialogDescription>
                    Definiere ein neues Fitness- oder Gesundheitsziel.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const goalType = formData.get("goalType") as keyof typeof goalTypeConfig;
                  createGoalMutation.mutate({
                    goalType,
                    targetValue: Number(formData.get("targetValue")),
                    startValue: Number(formData.get("startValue")) || undefined,
                    currentValue: Number(formData.get("currentValue")) || undefined,
                    unit: goalTypeConfig[goalType]?.unit || "",
                    startDate: formData.get("startDate") as string,
                    targetDate: formData.get("targetDate") as string || undefined,
                    notes: formData.get("notes") as string || undefined,
                  });
                }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goalType">Ziel-Typ</Label>
                    <Select name="goalType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Auswählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(goalTypeConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <config.icon className={`w-4 h-4 ${config.color}`} />
                              {config.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startValue">Startwert</Label>
                      <Input 
                        id="startValue" 
                        name="startValue" 
                        type="number" 
                        step="0.1"
                        placeholder="z.B. 85"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetValue">Zielwert *</Label>
                      <Input 
                        id="targetValue" 
                        name="targetValue" 
                        type="number" 
                        step="0.1"
                        placeholder="z.B. 75"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Startdatum *</Label>
                      <Input 
                        id="startDate" 
                        name="startDate" 
                        type="date" 
                        defaultValue={format(new Date(), "yyyy-MM-dd")}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetDate">Zieldatum</Label>
                      <Input 
                        id="targetDate" 
                        name="targetDate" 
                        type="date" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notizen</Label>
                    <Input 
                      id="notes" 
                      name="notes" 
                      placeholder="z.B. Motivation, Strategie..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={createGoalMutation.isPending}>
                    {createGoalMutation.isPending ? "Erstellen..." : "Ziel erstellen"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {goalsQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : goalsQuery.data && goalsQuery.data.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goalsQuery.data.map((goal) => {
              const config = goalTypeConfig[goal.goalType as keyof typeof goalTypeConfig];
              const Icon = config?.icon || Target;
              const progress = calculateProgress(goal);
              
              return (
                <Card key={goal.id} className="fitness-card">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${config?.color || "text-primary"}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{config?.label || goal.goalType}</CardTitle>
                          <CardDescription>
                            Ziel: {goal.targetValue} {goal.unit}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-green-500 hover:text-green-600"
                          onClick={() => completeGoalMutation.mutate({ id: goal.id })}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteGoalMutation.mutate({ id: goal.id })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fortschritt</span>
                        <span className="font-medium">{progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-muted-foreground">Start</p>
                        <p className="font-semibold">{goal.startValue || "—"}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-primary/10">
                        <p className="text-muted-foreground">Aktuell</p>
                        <p className="font-semibold text-primary">{goal.currentValue || "—"}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-muted-foreground">Ziel</p>
                        <p className="font-semibold">{goal.targetValue}</p>
                      </div>
                    </div>
                    
                    {/* Update current value */}
                    <div className="flex gap-2">
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="Neuer Wert"
                        className="flex-1"
                        id={`update-${goal.id}`}
                      />
                      <Button 
                        variant="outline"
                        onClick={() => {
                          const input = document.getElementById(`update-${goal.id}`) as HTMLInputElement;
                          const value = parseFloat(input.value);
                          if (!isNaN(value)) {
                            updateGoalMutation.mutate({ id: goal.id, currentValue: value });
                            input.value = "";
                          }
                        }}
                      >
                        Aktualisieren
                      </Button>
                    </div>
                    
                    {goal.targetDate && (
                      <p className="text-xs text-muted-foreground text-center">
                        Zieldatum: {format(new Date(goal.targetDate), "d. MMMM yyyy", { locale: de })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Noch keine Ziele</h3>
              <p className="text-muted-foreground mb-4">
                Erstelle dein erstes Ziel, um deinen Fortschritt zu tracken.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Erstes Ziel erstellen
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
