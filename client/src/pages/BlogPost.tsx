import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar, Tag, Flame } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Streamdown } from "streamdown";

const categoryLabels: Record<string, string> = {
  update: "Update",
  tips: "Tipps",
  progress: "Fortschritt",
  nutrition: "Ernährung",
  training: "Training",
  mindset: "Mindset",
};

function extractVideoEmbed(url: string): { type: "youtube" | "instagram" | null; embedUrl: string | null } {
  if (!url) return { type: null, embedUrl: null };
  
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}` };
  }
  
  // Instagram
  const instagramMatch = url.match(/instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/);
  if (instagramMatch) {
    return { type: "instagram", embedUrl: `https://www.instagram.com/p/${instagramMatch[1]}/embed` };
  }
  
  return { type: null, embedUrl: null };
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery({ slug: slug || "" });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
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
          </div>
        </nav>
        <main className="container pt-24 pb-16">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-8" />
            <Skeleton className="h-64 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
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
          </div>
        </nav>
        <main className="container pt-24 pb-16">
          <div className="max-w-3xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Beitrag nicht gefunden</h1>
            <p className="text-muted-foreground mb-6">
              Der gesuchte Blog-Beitrag existiert nicht oder wurde entfernt.
            </p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück zum Blog
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const videoEmbed = post.videoUrl ? extractVideoEmbed(post.videoUrl) : null;

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
          
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Alle Beiträge
            </Button>
          </Link>
        </div>
      </nav>

      <main className="container pt-24 pb-16">
        <article className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {post.category && (
                <Badge variant="secondary">
                  <Tag className="w-3 h-3 mr-1" />
                  {categoryLabels[post.category] || post.category}
                </Badge>
              )}
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {post.publishedAt 
                  ? format(new Date(post.publishedAt), "d. MMMM yyyy", { locale: de })
                  : format(new Date(post.createdAt), "d. MMMM yyyy", { locale: de })
                }
              </span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground">{post.excerpt}</p>
            )}
          </header>

          {/* Featured Image */}
          {post.featuredImageUrl && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img 
                src={post.featuredImageUrl} 
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Video Embed */}
          {videoEmbed?.embedUrl && (
            <div className="mb-8 rounded-xl overflow-hidden aspect-video">
              <iframe
                src={videoEmbed.embedUrl}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <Streamdown>{post.content}</Streamdown>
          </div>

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-border">
            <Link href="/blog">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück zum Blog
              </Button>
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
