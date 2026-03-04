import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard, { Article } from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 6;

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  /* =======================
   * FETCH ARTICLES (SEARCH)
   * ======================= */
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/articles?search=${encodeURIComponent(search)}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data: Article[]) => {
        // ✅ ONLY PUBLISHED ARTICLES
        const published = data.filter(
          (a: any) => a.status === "published"
        );

        setArticles(published);
        setPage(1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [search]);

  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const paginated = articles.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 md:px-8 py-12">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold mb-2">
            All Articles
          </h1>
          <p className="text-muted-foreground">
            Explore our latest stories, insights, and ideas.
          </p>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 mb-8 p-3 border rounded-md"
        />

        {/* CONTENT */}
        {loading ? (
          <p className="text-muted-foreground">
            Searching articles...
          </p>
        ) : paginated.length === 0 ? (
          <p className="text-muted-foreground">
            No articles found.
          </p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Prev
                </Button>

                {Array.from(
                  { length: totalPages },
                  (_, i) => (
                    <Button
                      key={i}
                      size="sm"
                      variant={
                        page === i + 1
                          ? "default"
                          : "outline"
                      }
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ArticlesPage;