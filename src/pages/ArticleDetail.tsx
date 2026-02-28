import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API_URL = "http://localhost:3001";

type Article = {
  id: number;
  title: string;
  content: string;
  image?: string;
  category?: string;
  author?: string;
  created_at?: string;
  readTime?: string;
};

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  /* =======================
   * FETCH ARTICLE
   * ======================= */
  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch(() => {
        setArticle(null);
        setLoading(false);
      });
  }, [id]);

  /* =======================
   * STATES
   * ======================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 md:px-8 py-20 text-center text-muted-foreground">
          Loading article...
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 md:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">
            Article not found
          </h1>
          <Link
            to="/articles"
            className="text-primary hover:underline"
          >
            ← Back to articles
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* COVER IMAGE */}
      <div className="w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden bg-muted">
        <img
          src={
            article.image
              ? `${API_URL}${article.image}`
              : "/placeholder.jpg"
          }
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <article className="container mx-auto px-4 md:px-8 max-w-3xl py-10">
        <Link
          to="/articles"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to articles
        </Link>

        {article.category && (
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-badge text-badge-foreground mb-4">
            {article.category}
          </span>
        )}

        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
          {article.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-10 pb-8 border-b">
          {article.author && (
            <span className="font-medium text-foreground">
              {article.author}
            </span>
          )}
          {article.created_at && (
            <>
              <span>·</span>
              <span>
                {new Date(
                  article.created_at
                ).toLocaleDateString()}
              </span>
            </>
          )}
          {article.readTime && (
            <>
              <span>·</span>
              <span>{article.readTime}</span>
            </>
          )}
        </div>

        <div
          className="article-prose"
          dangerouslySetInnerHTML={{
            __html: article.content,
          }}
        />
      </article>

      <Footer />
    </div>
  );
};

export default ArticleDetail;