import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Link, useParams, useLocation } from "wouter";
import { ArrowLeft, Flame, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { getLoginUrl } from "@/const";

export default function AdminBlogEdit() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, loading } = useAuth();
  const isNew = !id || id === "new";
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "" as "update" | "tips" | "progress" | "nutrition" | "training" | "mindset" | "",
    featuredImageUrl: "",
    videoUrl: "",
    published: false,
  });

  const { data: post, isLoading } = trpc.blog.getById.useQuery(
    { id: Number(id) },
    { enabled: !isNew && isAuthenticated && user?.role === "admin" }
  );

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        slug: post.slug || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        category: (post.category as typeof formData.category) || "",
        featuredImageUrl: post.featuredImageUrl || "",
        videoUrl: post.videoUrl || "",
        published: post.published || false,
      });
    }
  }, [post]);

  const createMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Beitrag erstellt");
      setLocation("/admin/blog");
    },
    onError: (error) => toast.error(`Fehler: ${error.message}`),
  });

  const updateMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Beitrag aktualisiert");
      setLocation("/admin/blog");
    },
    onError: (error) => toast.error(`Fehler: ${error.message}`),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error("Bitte fülle Titel, Slug und Inhalt aus.");
      return;
    }

    const data = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt || undefined,
      content: formData.content,
      category: formData.category || undefined,
      featuredImageUrl: formData.featuredImageUrl || undefined,
      videoUrl: formData.videoUrl || undefined,
      published: formData.published,
    };

    if (isNew) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ id: Number(id), ...data });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[äöüß]/g, (match) => {
        const map: Record<string, string> = { ä: "ae", ö: "oe", ü: "ue", ß: "ss" };
        return map[match] || match;
      })
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  if (loading || (!isNew && isLoading)) {
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
            <CardTitle>Anmeldung erforderlich</CardTitle>
          </CardHeader>
          <CardContent>
            <a href={getLoginUrl()}>
              <Button className="w-full">Anmelden</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle>Zugriff verweigert</CardTitle>
            <CardDescription>Du hast keine Berechtigung für diesen Bereich.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Zur Startseite</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <span className="text-xl font-bold">Admin</span>
            </div>
          </Link>
          
          <Link href="/admin/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </Link>
        </div>
      </nav>

      <main className="container pt-24 pb-16 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">
          {isNew ? "Neuer Beitrag" : "Beitrag bearbeiten"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle>Grunddaten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      title: e.target.value,
                      slug: formData.slug || generateSlug(e.target.value),
                    });
                  }}
                  placeholder="Beitragstitel"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">URL-Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="beitrag-url-slug"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL: /blog/{formData.slug || "..."}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as typeof formData.category })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Auswählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="update">Update</SelectItem>
                      <SelectItem value="tips">Tipps</SelectItem>
                      <SelectItem value="progress">Fortschritt</SelectItem>
                      <SelectItem value="nutrition">Ernährung</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="mindset">Mindset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="published">Status</Label>
                  <div className="flex items-center gap-3 pt-2">
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                    />
                    <Label htmlFor="published" className="font-normal">
                      {formData.published ? "Veröffentlicht" : "Entwurf"}
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt">Kurzbeschreibung</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Kurze Beschreibung für die Vorschau..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="fitness-card">
            <CardHeader>
              <CardTitle>Medien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="featuredImageUrl">Titelbild URL</Label>
                <Input
                  id="featuredImageUrl"
                  value={formData.featuredImageUrl}
                  onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL (YouTube/Instagram)</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="fitness-card">
            <CardHeader>
              <CardTitle>Inhalt *</CardTitle>
              <CardDescription>Markdown wird unterstützt</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Schreibe deinen Beitrag hier... (Markdown wird unterstützt)"
                rows={15}
                required
              />
            </CardContent>
          </Card>

          <div className="flex items-center gap-4">
            <Button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {createMutation.isPending || updateMutation.isPending 
                ? "Speichern..." 
                : isNew ? "Erstellen" : "Aktualisieren"
              }
            </Button>
            <Link href="/admin/blog">
              <Button variant="outline">Abbrechen</Button>
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
