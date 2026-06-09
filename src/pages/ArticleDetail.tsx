import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Copy, Twitter, MessageCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";
import { toast } from "sonner";

import { useArticle, useRelatedArticles } from "@/hooks/useArticles";
import { analyticsService } from "@/services/analytics.service";
import CommentSection from "@/components/CommentSection";
import { Article } from "@/types";

type Related = {
  id: number;
  title: string;
  slug: string;
  image?: string | null;
};

const ArticleDetail = () => {

  const { slug } = useParams<{ slug: string }>();

  const { data: articleData, isLoading: loadingArticle } = useArticle(slug);
  const { data: relatedData } = useRelatedArticles(slug);

  const [article, setArticle] = useState<Article | null>(null);
  const [scrollProgress, setScrollProgress] = useState("0%");

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}%`;
      setScrollProgress(scroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= SHARE ================= */

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!");
    } catch {
      toast.error("Failed to copy link");
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

  useEffect(() => {
    if (articleData) {
      setArticle(articleData);
      
      const incrementView = async () => {
        const newViews = await analyticsService.incrementView(articleData.id, articleData.views || 0);
        setArticle(prev => prev ? { ...prev, views: newViews } : prev);
      };
      incrementView();
    }
  }, [articleData]);

  const related = relatedData || [];
  const loading = loadingArticle;

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

  const plainText = article?.content
    ? article.content.replace(/<[^>]+>/g, "").slice(0, 160)
    : "";

  const fullUrl =
    `${window.location.origin}/articles/${article?.slug}`;

  const sanitizedContent = article?.content
    ? DOMPurify.sanitize(article.content)
    : "";

  const contentWithIds = useMemo(() => {
    const isHtml = /<\/?[a-z][\s\S]*>/i.test(sanitizedContent);
    if (!isHtml) return sanitizedContent;
    let modified = sanitizedContent;
    toc.forEach((t) => {
      const target = `<h2>${t.text}</h2>`;
      modified = modified.replace(target, `<h2 id="${t.id}" class="scroll-mt-24">${t.text}</h2>`);
    });
    return modified;
  }, [sanitizedContent, toc]);

  if (loading)
    return (
      <div className="min-h-screen">

        <div className="py-32 text-center text-muted-foreground">
          Loading article...
        </div>

      </div>
    );

  if (!article)
    return (
      <div className="min-h-screen">

        <div className="py-32 text-center">
          <h1 className="text-2xl font-bold mb-4">
            Article not found
          </h1>
          <Link to="/articles">← Back to articles</Link>
        </div>

      </div>
    );

  const contentIsHtml = /<\/?[a-z][\s\S]*>/i.test(sanitizedContent);

  const contentParagraphs = !contentIsHtml
    ? sanitizedContent
        .split(/\n\s*\n/)
        .filter(Boolean)
    : [];

  return (

    <div className="bg-background">
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-150" 
        style={{ width: scrollProgress }} 
      />

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
        <div className="flex flex-col lg:flex-row gap-16 justify-center max-w-6xl mx-auto">
          <article className="w-full lg:w-[70%] max-w-[80ch]">

            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-sm mb-10 text-muted-foreground hover:text-primary transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to articles
            </Link>

            <header className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <div className="space-y-4">
                <div className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                  {article.categories?.join(" • ")}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-foreground">
                  {article.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {article.author && <span>{article.author}</span>}
                  {article.created_at && (
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                  )}
                  <span>{readTime} min read</span>
                  <span>{article.views || 0} views</span>
                </div>
              </div>
            </header>

            <section className="mt-10 rounded-3xl border border-border bg-card p-8 shadow-sm">
              <div
                className="prose prose-sm md:prose-base lg:prose-lg prose-headings:font-semibold prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-3xl prose-img:shadow-xl prose-img:border prose-img:border-border prose-blockquote:border-l-4 prose-blockquote:border-muted prose-blockquote:bg-muted/10 prose-blockquote:text-muted-foreground prose-code:rounded prose-code:border prose-code:border-border prose-code:bg-muted prose-pre:bg-slate-950 prose-pre:text-slate-100 dark:prose-invert dark:prose-pre:bg-slate-900 dark:prose-code:bg-slate-950 max-w-none"
              >
                {contentIsHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: contentWithIds }} />
                ) : (
                  <>
                    {contentParagraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </>
                )}
              </div>
            </section>
          </article>

          {/* TOC SIDEBAR */}
          {toc.length > 0 && (
            <aside className="hidden lg:block w-[25%] shrink-0 mt-28 sticky top-24 self-start">
              <h3 className="font-bold text-lg mb-4 text-foreground/80 uppercase tracking-wider text-sm">Daftar Isi</h3>
              <ul className="space-y-3 text-sm text-muted-foreground border-l-2 border-border pl-4">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="hover:text-primary transition-colors block">
                      {t.text}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )}

        </div>

        {/* RELATED ARTICLES */}
        {related.length > 0 && (
          <div className="mt-20 pt-10 border-t border-border">
            <h3 className="text-2xl font-bold mb-6">Artikel Terkait</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel: any) => (
                <Link key={rel.id} to={`/articles/${rel.slug}`} className="group block">
                  <div className="aspect-[16/9] rounded-xl overflow-hidden mb-3 bg-muted">
                    <img 
                      src={rel.image || "/placeholder.jpg"} 
                      alt={rel.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="font-bold group-hover:text-primary transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    <CommentSection articleId={article.id} />

</div>

  );

};

export default ArticleDetail;