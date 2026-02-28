import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/data/articles";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 6;

const ArticlesPage = () => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const paginated = articles.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl font-extrabold mb-2">All Articles</h1>
        <p className="text-muted-foreground mb-10">Explore our latest stories, insights, and ideas.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
