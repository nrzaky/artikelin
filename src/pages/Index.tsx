import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { useArticles } from "@/hooks/useArticles";

const Index = () => {
  const { data: articles = [], isLoading: loading } = useArticles("published");

  const featured = articles[0];
  const recent = articles.slice(1, 7);

  return (
    <div className="bg-background min-h-screen">
      <Helmet>
        <title>Artikelin - Platform Artikel Modern</title>
        <meta name="description" content="Kumpulan artikel programming, tutorial, dan wawasan teknologi terbaru di Artikelin." />
        <meta property="og:title" content="Artikelin - Platform Artikel Modern" />
        <meta property="og:description" content="Kumpulan artikel programming, tutorial, dan wawasan teknologi terbaru di Artikelin." />
        <meta property="og:url" content="https://artikelin.my.id/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Artikelin" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://artikelin.my.id/" />
      </Helmet>

      {/* HERO */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        {/* Subtle grid pattern (fallback to CSS if svg is missing) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        <div className="relative max-w-5xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-medium mb-8 border border-primary/10 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>Discover the future of tech</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-extrabold mb-8 tracking-tighter leading-[1.1] text-foreground">
            Building software, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              one article at a time.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            A premium publication covering programming, software development,
            and the latest technology trends for modern developers.
          </p>

          <Link to="/articles">
            <Button size="lg" className="rounded-full shadow-elevated hover:shadow-none transition-shadow duration-300 px-8 py-6 text-base font-semibold group">
              Start Reading
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Story</h2>
        </div>

        {loading ? (
          <div className="animate-pulse bg-muted rounded-3xl h-[400px] w-full" />
        ) : featured ? (
          <Link
            to={`/articles/${featured.slug}`}
            className="group block rounded-3xl overflow-hidden border border-border/50 bg-card hover:bg-card/80 shadow-soft hover:shadow-elevated transition-all duration-500"
          >
            <div className="grid lg:grid-cols-2 min-h-[450px]">
              <div className="relative overflow-hidden bg-muted/30 order-2 lg:order-1 h-64 lg:h-auto">
                <img
                  src={featured.image ?? "/placeholder.jpg"}
                  alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center order-1 lg:order-2">
                {featured.categories?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featured.categories.slice(0, 3).map((cat: string) => (
                      <span
                        key={cat}
                        className="text-[11px] font-bold tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary uppercase"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                <h3 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight group-hover:text-primary transition-colors leading-[1.15]">
                  {featured.title}
                </h3>

                <p className="text-lg text-muted-foreground mb-8 leading-relaxed line-clamp-3">
                  {featured.meta_description ?? "Klik untuk membaca artikel selengkapnya. Temukan wawasan mendalam mengenai topik ini."}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto">
                  <span className="font-medium text-foreground">{featured.author ?? 'Naufal Raikhan Zaky'}</span>
                  <span className="opacity-50">•</span>
                  {featured.created_at && (
                    <span>{new Date(featured.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <p className="text-muted-foreground">No published articles available.</p>
        )}
      </section>

      {/* RECENT ARTICLES */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-32">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Latest Insights</h2>
            <p className="text-muted-foreground">Stay updated with our newest articles.</p>
          </div>
          <Link
            to="/articles"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group"
          >
            View all articles
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="animate-pulse bg-muted/50 rounded-2xl h-[380px]" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recent.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
        
        <div className="mt-12 sm:hidden flex justify-center">
          <Link
            to="/articles"
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group bg-primary/5 px-6 py-3 rounded-full"
          >
            View all articles
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* TECH STACK CTA */}
      <section className="border-t border-border bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Powered by modern tech
          </h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Built for speed and performance using the latest tools in the ecosystem.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["React", "TypeScript", "Vite", "TailwindCSS", "Supabase", "Vercel"].map((tech) => (
              <span
                key={tech}
                className="px-6 py-2.5 border border-border/50 rounded-full text-sm font-medium bg-background shadow-sm text-foreground/80 hover:border-primary/30 hover:text-primary transition-colors cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;