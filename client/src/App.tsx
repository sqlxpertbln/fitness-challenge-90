import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminBlogEdit from "./pages/admin/AdminBlogEdit";
import Progress from "./pages/Progress";
import Export from "./pages/Export";
import Goals from "./pages/Goals";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/progress" component={Progress} />
      <Route path="/export" component={Export} />
      <Route path="/goals" component={Goals} />
      <Route path="/services" component={Services} />
      <Route path="/admin/blog" component={AdminBlog} />
      <Route path="/admin/blog/new" component={AdminBlogEdit} />
      <Route path="/admin/blog/:id" component={AdminBlogEdit} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
