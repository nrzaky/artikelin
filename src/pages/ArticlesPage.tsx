import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Search } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { useArticles, useSearchArticles } from "@/hooks/useArticles";

const ITEMS_PER_PAGE = 9;

const ArticlesPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: allArticles = [], isLoading: loadingAll } = useArticles("published");
  const { data: searchResults = [], isLoading: loadingSearch } = useSearchArticles(debouncedSearch);

  const articles = debouncedSearch ? searchResults : allArticles;
  const loading = debouncedSearch ? loadingSearch : loadingAll;

  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);

  const paginated = articles.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-background min-h-screen pb-24">
      <Helmet>
        <title>All Articles - Artikelin</title>
        <meta name="description" content="Temukan berbagai artikel menarik seputar web development, programming, dan teknologi di Artikelin." />
        <meta property="og:title" content="All Articles - Artikelin" />
      </Helmet>

      {/* HEADER SECTION */}
      <div className="bg-muted/30 border-b border-border/50 pt-32 pb-16 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-foreground">
            Explore All Articles
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Dive into our latest stories, insights, and ideas on programming and technology.
          </p>

          {/* SEARCH */}
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search articles by title or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-11 pr-4 py-4 bg-background border border-border rounded-full text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-sm transition-shadow"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CONTENT */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-muted rounded-2xl h-[380px] w-full" />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-2">No articles found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms.</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginated.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={{
                    ...article,
                    image: article.image ?? "/placeholder.jpg",
                  }}
                />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-20">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-6"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1 mx-4 hidden sm:flex">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        page === i + 1 
                          ? "bg-primary text-primary-foreground shadow-sm" 
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                
                <span className="sm:hidden text-sm text-muted-foreground mx-4">
                  Page {page} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-6"
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
    </div>
  );
};

export default ArticlesPage;