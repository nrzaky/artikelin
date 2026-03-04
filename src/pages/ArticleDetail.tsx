import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Twitter, Facebook, Link2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API_URL = "http://localhost:3001";

type Article = {
  id: number;
  title: string;
  slug: string;
  content?: string | null;
  image?: string | null;
  category?: string | null;
  author?: string | null;
  created_at?: string | null;
  status: "draft" | "published";
  meta_title?: string | null;
  meta_description?: string | null;
  views?: number;
};

type Related = {
  id: number;
  title: string;
  slug: string;
  image?: string | null;
};

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Related[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!slug) return;

    fetch(`/api/articles/slug/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data);

        // fetch related (simple latest 3)
        fetch("/api/articles?limit=3")
          .then((r) => r.json())
          .then(setRelated);
      })
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [slug]);

  /* ================= READ TIME ================= */
  const readTime = useMemo(() => {
    if (!article?.content) return 0;
    const text = article.content.replace(/<[^>]+>/g, "");
    const words = text.split(/\s+/).length;
    return Math.ceil(words / 200);
  }, [article]);

  /* ================= TOC ================= */
  const toc = useMemo(() => {
    if (!article?.content) return [];
    const matches = article.content.match(/<h2[^>]*>(.*?)<\/h2>/g) || [];
    return matches.map((h, i) => ({
      id: `section-${i}`,
      text: h.replace(/<[^>]+>/g, ""),
    }));
  }, [article]);

  if (loading)
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="py-32 text-center text-muted-foreground">
          Loading article...
        </div>
        <Footer />
      </div>
    );

  if (!article)
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="py-32 text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Link to="/articles">← Back to articles</Link>
        </div>
        <Footer />
      </div>
    );

  const plainText = article.content
    ? article.content.replace(/<[^>]+>/g, "").slice(0, 160)
    : "";

  const fullUrl = `${window.location.origin}/articles/${article.slug}`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{article.meta_title || article.title}</title>
        <meta
          name="description"
          content={article.meta_description || plainText}
        />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={plainText} />
        <meta property="og:url" content={fullUrl} />
        {article.image && (
          <meta property="og:image" content={`${API_URL}${article.image}`} />
        )}
        <link rel="canonical" href={fullUrl} />
      </Helmet>

      <Navbar />

      {/* HERO */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={
            article.image
              ? `${API_URL}${article.image}`
              : "/placeholder.jpg"
          }
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute bottom-0 left-0 right-0 p-10 max-w-5xl mx-auto text-white">
          {article.category && (
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {article.category}
            </span>
          )}

          <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-4 leading-tight">
            {article.title}
          </h1>

          <div className="flex gap-6 text-sm text-white/80">
            {article.author && <span>{article.author}</span>}
            {article.created_at && (
              <span>
                {new Date(article.created_at).toLocaleDateString()}
              </span>
            )}
            <span>{readTime} min read</span>
            <span>{article.views || 0} views</span>
          </div>
        </div>
      </div>

      {/* BODY */}
<div className="relative">

  {/* SHARE FLOAT DESKTOP */}
  <div className="hidden lg:flex fixed left-6 top-1/3 flex-col gap-4 z-40">
    <a
      href={`https://twitter.com/intent/tweet?url=${fullUrl}`}
      target="_blank"
      className="p-2 rounded-full bg-muted hover:bg-muted/70 transition"
    >
      <Twitter className="w-4 h-4" />
    </a>

    <a
      href={`https://www.facebook.com/sharer/sharer.php?u=${fullUrl}`}
      target="_blank"
      className="p-2 rounded-full bg-muted hover:bg-muted/70 transition"
    >
      <Facebook className="w-4 h-4" />
    </a>

    <button
      onClick={() => navigator.clipboard.writeText(fullUrl)}
      className="p-2 rounded-full bg-muted hover:bg-muted/70 transition"
    >
      <Link2 className="w-4 h-4" />
    </button>
  </div>

  {/* MAIN WRAPPER */}
  <div className="mx-auto px-4 md:px-6 py-20 max-w-7xl">

    <div className="flex flex-col lg:flex-row gap-16 justify-center">

      {/* CONTENT */}
      <article className="w-full max-w-[70ch]">

        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-sm mb-12 text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to articles
        </Link>

        <div
          className="
            prose 
            prose-lg 
            dark:prose-invert 
            max-w-none 
            text-justify
            leading-relaxed
          "
          dangerouslySetInnerHTML={{
            __html: article.content || "",
          }}
        />
      </article>

      {/* TOC (DESKTOP ONLY) */}
      {toc.length > 0 && (
        <aside className="hidden lg:block w-64 sticky top-32 h-fit">
          <div className="border rounded-xl p-6 bg-card">
            <h3 className="font-semibold mb-4">On this page</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {toc.map((item) => (
                <li key={item.id} className="hover:text-foreground transition">
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}

    </div>
  </div>

      {/* SHARE MOBILE BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t flex justify-center gap-10 py-3 z-50">
        <a
          href={`https://twitter.com/intent/tweet?url=${fullUrl}`}
          target="_blank"
        >
          <Twitter className="w-5 h-5" />
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${fullUrl}`}
          target="_blank"
        >
          <Facebook className="w-5 h-5" />
        </a>

        <button onClick={() => navigator.clipboard.writeText(fullUrl)}>
          <Link2 className="w-5 h-5" />
        </button>
      </div>

    </div>

      {/* RELATED */}
      {related.length > 0 && (
        <div className="border-t py-20">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-10">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/articles/${r.slug}`}
                  className="group"
                >
                  <div className="overflow-hidden rounded-xl mb-4">
                    <img
                      src={
                        r.image
                          ? `${API_URL}${r.image}`
                          : "/placeholder.jpg"
                      }
                      className="w-full h-48 object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <h3 className="font-semibold group-hover:text-primary">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ArticleDetail;