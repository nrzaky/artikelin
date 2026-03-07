import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Copy, Twitter, MessageCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import CommentSection from "@/components/CommentSection";

type Article = {
  id: number;
  title: string;
  slug: string;
  content?: string | null;
  image?: string | null;
  categories?: string[];
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

  /* ================= SHARE ================= */

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied!");
    } catch {
      alert("Failed to copy link");
    }
  };

  const shareWhatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`);
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(article?.title || "")}`
    );
  };

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: article?.title,
        url: shareUrl,
      });
    }
  };

  /* ================= FETCH ================= */

  useEffect(() => {

    const fetchArticle = async () => {

      if (!slug) return;

      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          article_categories (
            categories (
              name
            )
          )
        `)
        .eq("slug", slug)
        .single();

      if (error || !data) {
        setArticle(null);
        setLoading(false);
        return;
      }

      const formatted = {
        ...data,
        categories: data.article_categories
          ?.map((c: any) => c.categories?.name)
          .filter(Boolean),
      };

      setArticle(formatted);

      /* ================= VIEW TRACKING ================= */

      const viewedKey = `viewed_${data.id}`;

      if (!sessionStorage.getItem(viewedKey)) {

        sessionStorage.setItem(viewedKey, "true");

        await supabase
          .from("articles")
          .update({ views: (data.views || 0) + 1 })
          .eq("id", data.id);

        await supabase
          .from("article_views")
          .insert({
            article_id: data.id
          });

        setArticle(prev =>
          prev ? { ...prev, views: (prev.views || 0) + 1 } : prev
        );

      }

      /* ================= RELATED ================= */

      const { data: relatedData } = await supabase
        .from("articles")
        .select("id,title,slug,image")
        .eq("status", "published")
        .neq("slug", slug)
        .order("created_at", { ascending: false })
        .limit(3);

      setRelated(relatedData || []);

      setLoading(false);

    };

    fetchArticle();

  }, [slug]);

  /* ================= READ TIME ================= */

  const readTime = useMemo(() => {

    if (!article?.content) return 0;

    const text = article.content.replace(/<[^>]+>/g, "");

    const words = text.trim().split(/\s+/).length;

    return Math.ceil(words / 200);

  }, [article]);

  /* ================= TOC ================= */

  const toc = useMemo(() => {

    if (!article?.content) return [];

    const matches =
      article.content.match(/<h2[^>]*>(.*?)<\/h2>/g) || [];

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
          <h1 className="text-2xl font-bold mb-4">
            Article not found
          </h1>
          <Link to="/articles">← Back to articles</Link>
        </div>
        <Footer />
      </div>
    );

  const plainText = article.content
    ? article.content.replace(/<[^>]+>/g, "").slice(0, 160)
    : "";

  const fullUrl =
    `${window.location.origin}/articles/${article.slug}`;

  return (

    <div className="min-h-screen bg-background">

      <Helmet>

        <title>{article.meta_title || article.title}</title>
        <meta name="description" content={article.meta_description || plainText} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={plainText} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:site_name" content="Artikelin" />

        {article.image && (
        <meta property="og:image" content={article.image} />
        )}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={plainText} />
        <meta name="twitter:image" content={article.image || ""} />

        <link rel="canonical" href={fullUrl} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.meta_description || plainText,
            image: article.image ? [article.image] : [],
            author: {
              "@type": "Person",
              name: article.author || "Naufal Raikhan Zaky"
            },
            publisher: {
              "@type": "Organization",
              name: "Artikelin",
              logo: {
                "@type": "ImageObject",
                url: "https://artikelin.my.id/logo-artikelin.png"
              }
            },
            datePublished: article.created_at,
            dateModified: article.created_at,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": fullUrl
            }
          })}
        </script>

      </Helmet>

      <Navbar />

      {/* HERO */}

      <div className="relative h-[420px] md:h-[500px] overflow-hidden">

        <img
          src={article.image || "/placeholder.jpg"}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-5xl mx-auto text-white">

          {article.categories?.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-3">
              {article.categories.map((cat) => (
                <span
                  key={cat}
                  className="bg-white/20 px-3 py-1 rounded-full text-sm"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mt-4 mb-4 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-white/80 items-center">

            {article.author && <span>{article.author}</span>}

            {article.created_at && (
              <span>
                {new Date(article.created_at).toLocaleDateString()}
              </span>
            )}

            <span>{readTime} min read</span>

            <span>{article.views || 0} views</span>

          </div>

          {/* SHARE */}

          <div className="flex flex-wrap gap-2 mt-4">

            <button
              onClick={nativeShare}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black text-white text-sm"
            >
              <Share2 size={16} /> Share
            </button>

            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/20 text-sm"
            >
              <Copy size={16} /> Copy
            </button>

            <button
              onClick={shareWhatsapp}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500 text-sm"
            >
              <MessageCircle size={16} /> WhatsApp
            </button>

            <button
              onClick={shareTwitter}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-sm"
            >
              <Twitter size={16} /> Twitter
            </button>

          </div>

        </div>

      </div>

      {/* BODY */}

      <div className="mx-auto px-4 md:px-6 py-16 max-w-7xl">

        <div className="flex flex-col lg:flex-row gap-16 justify-center">

          <article className="w-full max-w-[70ch]">

            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-sm mb-12 text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to articles
            </Link>

            <div
              className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(article.content || "")
              }}
            />

          </article>

        </div>

      </div>
      <CommentSection articleId={article.id} />

      <Footer />

    </div>

  );

};

export default ArticleDetail;