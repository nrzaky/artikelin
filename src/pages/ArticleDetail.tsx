import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Copy, Twitter, MessageCircle, Clock, Eye } from "lucide-react";
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

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

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
    const matches = article.content.match(/<h2[^>]*>(.*?)<\/h2>/g) || [];
    return matches.map((h, i) => ({
      id: `section-${i}`,
      text: h.replace(/<[^>]+>/g, ""),
    }));
  }, [article]);

  const plainText = article?.content
    ? article.content.replace(/<[^>]+>/g, "").slice(0, 160)
    : "";

  const fullUrl = `${window.location.origin}/articles/${article?.slug}`;

  const sanitizedContent = article?.content
    ? DOMPurify.sanitize(article.content)
    : "";

  const contentWithIds = useMemo(() => {
    const isHtml = /<\/?[a-z][\s\S]*>/i.test(sanitizedContent);
    if (!isHtml) return sanitizedContent;
    let modified = sanitizedContent;
    toc.forEach((t) => {
      const target = `<h2>${t.text}</h2>`;
      modified = modified.replace(target, `<h2 id="${t.id}" class="scroll-mt-28">${t.text}</h2>`);
    });
    return modified;
  }, [sanitizedContent, toc]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-64 bg-muted rounded"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );

  if (!article)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Article not found</h1>
          <Link to="/articles" className="text-primary hover:underline">← Back to articles</Link>
        </div>
      </div>
    );

  const contentIsHtml = /<\/?[a-z][\s\S]*>/i.test(sanitizedContent);

  const contentParagraphs = !contentIsHtml
    ? sanitizedContent.split(/\n\s*\n/).filter(Boolean)
    : [];

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Reading Progress */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-[60] transition-all duration-150" 
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
        {article.image && <meta property="og:image" content={article.image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={plainText} />
        <meta name="twitter:image" content={article.image || ""} />
        <link rel="canonical" href={fullUrl} />
      </Helmet>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pt-24 md:pt-32">
        
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-sm mb-8 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to articles
        </Link>

        {/* HEADER */}
        <header className="mb-10 text-center md:text-left">
          {article.categories?.length > 0 && (
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              {article.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs font-bold tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary uppercase"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tighter leading-[1.15] text-foreground">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground font-medium py-6 border-y border-border/50">
            {article.author && <span className="text-foreground">{article.author}</span>}
            <span className="hidden sm:inline opacity-50">•</span>
            {article.created_at && (
              <span>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            )}
            <span className="hidden sm:inline opacity-50">•</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {readTime} min read</span>
            <span className="hidden sm:inline opacity-50">•</span>
            <span className="flex items-center gap-1.5"><Eye className="w-4 h-4"/> {article.views || 0} views</span>
          </div>
        </header>

        {/* IMAGE */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden mb-16 bg-muted shadow-lg border border-border/50">
          <img
            src={article.image || "/placeholder.jpg"}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        {/* BODY & SIDEBAR */}
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* SHARE SIDEBAR (Desktop) */}
          <div className="hidden lg:flex flex-col gap-4 sticky top-32 h-fit shrink-0">
            <button onClick={nativeShare} className="p-3 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors" title="Share">
              <Share2 size={20} />
            </button>
            <button onClick={copyLink} className="p-3 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors" title="Copy Link">
              <Copy size={20} />
            </button>
            <button onClick={shareTwitter} className="p-3 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors" title="Share on Twitter">
              <Twitter size={20} />
            </button>
            <button onClick={shareWhatsapp} className="p-3 rounded-full bg-green-500/10 hover:bg-green-500/20 text-green-500 transition-colors" title="Share on WhatsApp">
              <MessageCircle size={20} />
            </button>
          </div>

          <article className="w-full lg:w-auto flex-grow min-w-0">
            <div className="article-prose">
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

            {/* SHARE BOTTOM (Mobile) */}
            <div className="lg:hidden mt-12 py-6 border-y border-border/50 flex flex-col items-center gap-4">
              <span className="font-bold text-lg tracking-tight">Share this article</span>
              <div className="flex gap-3">
                <button onClick={nativeShare} className="p-3 rounded-full bg-muted text-foreground"><Share2 size={20} /></button>
                <button onClick={copyLink} className="p-3 rounded-full bg-muted text-foreground"><Copy size={20} /></button>
                <button onClick={shareTwitter} className="p-3 rounded-full bg-blue-500/10 text-blue-500"><Twitter size={20} /></button>
                <button onClick={shareWhatsapp} className="p-3 rounded-full bg-green-500/10 text-green-500"><MessageCircle size={20} /></button>
              </div>
            </div>
          </article>

          {/* TOC SIDEBAR */}
          {toc.length > 0 && (
            <aside className="hidden xl:block w-[240px] shrink-0 sticky top-32 h-fit">
              <h3 className="font-bold mb-4 text-foreground tracking-tight">On this page</h3>
              <ul className="space-y-3 text-sm text-muted-foreground border-l border-border/50">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="hover:text-primary transition-colors block pl-4 py-1 hover:border-l hover:border-primary -ml-[1px]">
                      {t.text}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>

        <div className="mt-20">
          <CommentSection articleId={article.id} />
        </div>

        {/* RELATED ARTICLES */}
        {related.length > 0 && (
          <div className="mt-24 pt-16 border-t border-border/50">
            <h3 className="text-3xl font-bold mb-10 tracking-tight">More from us</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((rel: any) => (
                <Link key={rel.id} to={`/articles/${rel.slug}`} className="group block">
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-muted border border-border/50 shadow-sm">
                    <img 
                      src={rel.image || "/placeholder.jpg"} 
                      alt={rel.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h4 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {rel.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;