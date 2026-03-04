import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { isAdmin, logoutAdmin } from "@/lib/auth";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Article = {
  id: number;
  title: string;
  slug: string;
  content: string;
  image?: string | null;
  category?: string | null;
  author?: string | null;
  created_at?: string | null;
  status: "draft" | "published";
};

const API_URL = "http://localhost:3001";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = isAdmin();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoverImage, setHoverImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  /* =======================
   * AUTH GUARD
   * ======================= */
  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    }
  }, [admin, navigate]);

  /* =======================
   * FETCH ARTICLES
   * ======================= */
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articles?admin=true");
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("Failed to fetch articles", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  /* =======================
   * DELETE ARTICLE
   * ======================= */
  const deleteArticle = async (id: number) => {
    if (!confirm("Yakin ingin menghapus artikel ini?")) return;

    try {
      await fetch(`/api/articles/${id}`, { method: "DELETE" });
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Gagal menghapus artikel");
    }
  };

  /* =======================
   * FILTERED DATA
   * ======================= */
  const filteredArticles =
    filter === "all"
      ? articles
      : articles.filter((a) => a.status === filter);

  const publishedCount = articles.filter(
    (a) => a.status === "published"
  ).length;

  const draftCount = articles.filter(
    (a) => a.status === "draft"
  ).length;

  /* =======================
   * RENDER
   * ======================= */
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 md:px-8 py-12">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold mb-1">Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Manage your articles
            </p>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/admin/categories">Manage Categories</Link>
            </Button>

            <Button asChild>
              <Link to="/admin/articles/new">+ New Article</Link>
            </Button>

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
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Stat label="Total Articles" value={articles.length} />
          <Stat label="Published" value={publishedCount} />
          <Stat label="Drafts" value={draftCount} />
          <Stat
            label="Categories"
            value={
              new Set(
                articles
                  .map((a) => a.category)
                  .filter((c): c is string => Boolean(c))
              ).size
            }
          />
        </div>

        {/* FILTER */}
        <div className="flex gap-2 mb-4">
          {(["all", "published", "draft"] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* TABLE */}
        <div className="rounded-xl border bg-card shadow-soft">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Category
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  Date
                </TableHead>
                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Loading articles...
                  </TableCell>
                </TableRow>
              )}

              {!loading && filteredArticles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    No articles found
                  </TableCell>
                </TableRow>
              )}

              {filteredArticles.map((article) => {
                const imageUrl = article.image
                  ? `${API_URL}${article.image}`
                  : null;

                return (
                  <TableRow key={article.id}>
                    {/* IMAGE */}
                    <TableCell className="relative">
                      <img
                        src={imageUrl ?? "/placeholder.jpg"}
                        className="w-14 h-10 rounded-md object-cover border cursor-pointer"
                        onMouseEnter={() =>
                          imageUrl && setHoverImage(imageUrl)
                        }
                        onMouseLeave={() => setHoverImage(null)}
                      />

                      {hoverImage === imageUrl && (
                        <div className="absolute left-16 top-0 z-50">
                          <img
                            src={hoverImage}
                            className="w-80 max-h-80 object-cover rounded-xl shadow-2xl border bg-white"
                          />
                        </div>
                      )}
                    </TableCell>

                    {/* TITLE */}
                    <TableCell className="font-medium max-w-[220px] truncate">
                      {article.title}
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          article.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {article.status}
                      </span>
                    </TableCell>

                    {/* CATEGORY */}
                    <TableCell className="hidden md:table-cell">
                      {article.category || "-"}
                    </TableCell>

                    {/* DATE */}
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                      {article.created_at
                        ? new Date(article.created_at).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    {/* ACTION */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link to={`/articles/${article.slug}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Link to={`/admin/articles/edit/${article.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => deleteArticle(article.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <Footer />
    </div>
  );
};

/* =======================
 * STAT COMPONENT
 * ======================= */
const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl bg-card shadow-soft p-5">
    <p className="text-sm text-muted-foreground mb-1">
      {label}
    </p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default AdminDashboard;