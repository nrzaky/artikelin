import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import AdminLayout from "@/components/layout/AdminLayout";

const Index = lazy(() => import("./pages/Index"));
const ArticlesPage = lazy(() => import("./pages/ArticlesPage"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminCreateArticle = lazy(() => import("./pages/AdminCreateArticle"));
const AdminCategories = lazy(() => import("./pages/AdminCategories"));
const AdminEditArticle = lazy(() => import("./pages/AdminEditArticle"));
const About = lazy(() => import("@/pages/About"));

const queryClient = new QueryClient();

const FallbackLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Suspense fallback={<FallbackLoader />}>
        <Routes>
          {/* Public Routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Login (No Layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes with AdminLayout */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/articles/new" element={<AdminCreateArticle />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/articles/edit/:id" element={<AdminEditArticle />} />
          </Route>
        </Routes>
      </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
