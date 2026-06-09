import { Outlet, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { authService } from "@/services/auth.service";

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <nav className="border-b bg-card">
          <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <Link to="/admin" className="font-bold text-xl">
              Artikelin Admin
            </Link>
            <div className="flex gap-2">
               <Button variant="ghost" asChild>
                 <Link to="/">View Site</Link>
               </Button>
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    authService.logout();
                    navigate("/admin/login");
                  }}
                >
                  Logout
               </Button>
            </div>
          </div>
        </nav>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
