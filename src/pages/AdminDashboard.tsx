import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { articles } from "@/data/articles";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "@/lib/auth";
import { logoutAdmin } from "@/lib/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const navigate = useNavigate();

useEffect(() => {
  if (!isAdmin()) {
    navigate("/admin/login");
  }
}, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold mb-1">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Manage your articles</p>
          </div>
          {isAdmin() && <Button>+ New Article</Button>}
          <Button
            variant="outline"
            onClick={() => {
              logoutAdmin();
              navigate("/admin/login");
            }}
          >
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Articles", value: articles.length },
            { label: "Published", value: articles.length },
            { label: "Drafts", value: 0 },
            { label: "Categories", value: new Set(articles.map((a) => a.category)).size },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-card shadow-soft p-5">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-card shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-14 h-10 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {article.title}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {article.author}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-badge text-badge-foreground">
                      {article.category}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                    {article.date}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/articles/${article.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {isAdmin() && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
