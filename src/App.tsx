import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetail from "./pages/ArticleDetail";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import AdminLogin from "@/pages/AdminLogin";
import AdminCreateArticle from "./pages/AdminCreateArticle";
import AdminCategories from "./pages/AdminCategories";
import AdminEditArticle from "./pages/AdminEditArticle";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
       <Routes>
         <Route path="/" element={<Index />} />
         <Route path="/articles" element={<ArticlesPage />} />
         <Route path="/articles/:slug" element={<ArticleDetail />} />
         <Route path="/admin" element={<AdminDashboard />} />
         <Route path="*" element={<NotFound />} />
         <Route path="/admin/login" element={<AdminLogin />} />
         <Route path="/admin" element={<AdminDashboard />} />
         <Route path="/admin/articles/new" element={<AdminCreateArticle />} />
         <Route path="/admin/categories" element={<AdminCategories />} />
         <Route path="/admin/articles/edit/:id" element={<AdminEditArticle />} />
       </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
