import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import AdminAnalytics from "@/components/AdminAnalytics";
import { useArticles, useDeleteArticle } from "@/hooks/useArticles";
import { Article } from "@/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const AdminDashboard = () => {

  const { data: articles = [], isLoading: loading } = useArticles();
  const { mutateAsync: deleteArticleMutation } = useDeleteArticle();
  
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  /* =======================
     FETCH ARTICLES
  ======================= */

  useEffect(() => {
    if (articles.length > 0) {
      /* =======================
         ANALYTICS DATA
      ======================= */
      const top = articles
        .filter(a => a.status === "published")
        .sort((a,b) => (b.views || 0) - (a.views || 0))
        .slice(0,5)
        .map(a => ({
          title: a.title.length > 20
            ? a.title.slice(0,20) + "..."
            : a.title,
          views: a.views || 0
        }));

      setAnalytics(top);
    }
  }, [articles]);

  /* =======================
   DELETE ARTICLE
  ======================= */

  const deleteArticle = async (article: Article) => {
    if (!confirm("Yakin ingin menghapus artikel ini?")) return;

    try {
      await deleteArticleMutation({ id: article.id, image: article.image || undefined });
      toast.success("Artikel berhasil dihapus");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus artikel");
    }
  };


  /* =======================
     FILTER
  ======================= */

  const filteredArticles =
    filter === "all"
      ? articles
      : articles.filter(a => a.status === filter);

  const publishedCount =
    articles.filter(a => a.status === "published").length;

  const draftCount =
    articles.filter(a => a.status === "draft").length;

  const categoryCount = new Set(
    articles.flatMap(a => a.categories || [])
  ).size;

  /* =======================
     RENDER
  ======================= */

  return (

    <div className="bg-background">

      <div className="container mx-auto px-4 md:px-8 py-12">

        {/* HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">

          <div>
            <h1 className="text-3xl font-extrabold mb-1">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage your articles
            </p>
          </div>

          <div className="flex gap-2">

            <Button asChild variant="outline">
              <Link to="/admin/categories">
                Manage Categories
              </Link>
            </Button>

            <Button asChild>
              <Link to="/admin/articles/new">
                + New Article
              </Link>
            </Button>



          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Stat label="Total Articles" value={articles.length} />
          <Stat label="Published" value={publishedCount} />
          <Stat label="Drafts" value={draftCount} />
          <Stat label="Categories" value={categoryCount} />
        </div>

        {/* =======================
            ARTICLE ANALYTICS
        ======================= */}
        <AdminAnalytics />

        {/* FILTER */}

        <div className="flex gap-2 mb-4">

          {(["all", "published", "draft"] as const).map(f => (

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

                <TableHead className="w-[80px]">
                  Image
                </TableHead>

                <TableHead>
                  Title
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead className="hidden md:table-cell">
                  Categories
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

              {!loading &&
                filteredArticles.map(article => {

                  const imageUrl =
                    article.image || "/placeholder.jpg";

                  return (

                    <TableRow key={article.id}>

                      <TableCell>

                        <img
                          src={imageUrl}
                          className="w-14 h-10 rounded-md object-cover border"
                        />

                      </TableCell>

                      <TableCell className="font-medium max-w-[220px] truncate">
                        {article.title}
                      </TableCell>

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

                      <TableCell className="hidden md:table-cell">

                        {article.categories?.length
                          ? article.categories.join(", ")
                          : "-"}

                      </TableCell>

                      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">

                        {article.created_at
                          ? new Date(article.created_at).toLocaleDateString()
                          : "-"}

                      </TableCell>

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
                            onClick={() => deleteArticle(article)}
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

    </div>

  );

};

/* =======================
   STAT CARD
======================= */

const Stat = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => (

  <div className="rounded-xl bg-card shadow-soft p-5">

    <p className="text-sm text-muted-foreground mb-1">
      {label}
    </p>

    <p className="text-2xl font-bold">
      {value}
    </p>

  </div>

);

export default AdminDashboard;