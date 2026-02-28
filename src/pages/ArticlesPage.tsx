import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard, { Article } from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 6;

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  /* =======================
   * FETCH ARTICLES
   * ======================= */
  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* =======================
   * CATEGORIES (UNIQUE)
   * ======================= */
  const categories = useMemo(() => {
    const cats = articles
      .map((a) => a.category)
      .filter((c): c is string => Boolean(c));

    return ["all", ...Array.from(new Set(cats))];
  }, [articles]);

  /* =======================
   * FILTER ARTICLES
   * ======================= */
  const filteredArticles = useMemo(() => {
    if (selectedCategory === "all") return articles;
    return articles.filter(
      (a) => a.category === selectedCategory
    );
  }, [articles, selectedCategory]);

  /* =======================
   * PAGINATION
   * ======================= */
  const totalPages = Math.ceil(
    filteredArticles.length / ITEMS_PER_PAGE
  );

  const paginatedArticles = filteredArticles.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* Reset page when category changes */
  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 md:px-8 py-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold mb-1">
              All Articles
            </h1>
            <p className="text-muted-foreground">
              Explore our latest stories, insights, and ideas.
            </p>
          </div>

          {/* CATEGORY FILTER */}
          <select
            className="border rounded-md px-3 py-2 text-sm w-full md:w-56"
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="text-center py-20 text-muted-foreground">
            Loading articles...
          </p>
        ) : filteredArticles.length === 0 ? (
          <p className="text-center py-20 text-muted-foreground">
            No articles found.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
              />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((p) => Math.max(1, p - 1))
              }
              disabled={page === 1}
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={
                  page === i + 1 ? "default" : "outline"
                }
                size="sm"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ArticlesPage;