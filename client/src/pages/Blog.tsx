import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ArrowLeft, Calendar, Tag, Play, ArrowRight, Flame } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

const categoryLabels: Record<string, string> = {
  update: "Update",
  tips: "Tipps",
  progress: "Fortschritt",
  nutrition: "Ernährung",
  training: "Training",
  mindset: "Mindset",
};

const categoryColors: Record<string, string> = {
  update: "bg-primary/10 text-primary",
  tips: "bg-accent/10 text-accent-foreground",
  progress: "bg-chart-3/10 text-chart-3",
  nutrition: "bg-chart-5/10 text-chart-5",
  training: "bg-chart-1/10 text-chart-1",
  mindset: "bg-chart-4/10 text-chart-4",
};

export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.list.useQuery();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Challenge Blog</h1>
            <p className="text-lg text-muted-foreground">
              Updates, Tipps und Fortschrittsberichte aus der 90-Tage Fitness Challenge.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="fitness-card">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="fitness-card cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        {post.category && (
                          <Badge variant="secondary" className={categoryColors[post.category] || ""}>
                            <Tag className="w-3 h-3 mr-1" />
                            {categoryLabels[post.category] || post.category}
                          </Badge>
                        )}
                        {post.videoUrl && (
                          <Badge variant="outline" className="gap-1">
                            <Play className="w-3 h-3" />
                            Video
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {post.publishedAt 
                          ? format(new Date(post.publishedAt), "d. MMMM yyyy", { locale: de })
                          : format(new Date(post.createdAt), "d. MMMM yyyy", { locale: de })
                        }
                      </CardDescription>
                    </CardHeader>
                    {post.excerpt && (
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                        <div className="flex items-center gap-1 mt-4 text-primary font-medium">
                          Weiterlesen
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="fitness-card">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Noch keine Blog-Beiträge vorhanden. Schau bald wieder vorbei!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
