import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { useArticles } from "@/hooks/useArticles";

const Index = () => {
  const { data: articles = [], isLoading: loading } = useArticles("published");

  const featured = articles[0];
  const recent = articles.slice(1, 4);

  return (
    <div className="bg-background">
      <Helmet>
        <title>Artikelin - Platform Artikel Modern</title>
        <meta name="description" content="Kumpulan artikel programming, tutorial, dan wawasan teknologi terbaru di Artikelin." />
        <meta property="og:title" content="Artikelin - Platform Artikel Modern" />
        <meta property="og:description" content="Kumpulan artikel programming, tutorial, dan wawasan teknologi terbaru di Artikelin." />
      </Helmet>

      {/* HERO */}

      <section className="relative overflow-hidden border-b">

        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary opacity-90" />

        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 md:px-6 py-28 md:py-36 text-center text-primary-foreground">

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Artikelin
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            A technology blog covering programming, software development,
            and the latest technology trends for modern developers.
          </p>

          <Link to="/articles">
            <Button size="lg" className="shadow-xl">
              Explore Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

        </div>

      </section>


      {/*   FEATURED ARTICLE */}

      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16">

        <h2 className="text-2xl font-bold mb-10">
          Featured Article
        </h2>

        {loading ? (

          <p className="text-muted-foreground">
            Loading featured article...
          </p>

        ) : featured ? (

          <Link
            to={`/articles/${featured.slug}`}
            className="group block rounded-2xl overflow-hidden border hover:shadow-lg transition"
          >

            <div className="grid md:grid-cols-2">

              <div className="aspect-[16/10] overflow-hidden">

                <img
                  src={featured.image ?? "/placeholder.jpg"}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

              </div>

              <div className="p-8 flex flex-col justify-center">

                {featured.categories?.length > 0 && (

                  <div className="flex flex-wrap gap-2 mb-4">

                    {featured.categories.slice(0,3).map(cat => (

                      <span
                        key={cat}
                        className="text-xs font-semibold px-2.5 py-1 rounded-full bg-badge text-badge-foreground"
                      >
                        {cat}
                      </span>

                    ))}

                  </div>

                )}

                <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition">
                  {featured.title}
                </h3>

                <p className="text-muted-foreground mb-4">
                  Klik untuk membaca artikel selengkapnya.
                </p>

                {featured.created_at && (
                  <span className="text-sm text-muted-foreground">
                    {new Date(featured.created_at).toLocaleDateString()}
                  </span>
                )}

              </div>

            </div>

          </Link>

        ) : (

          <p className="text-muted-foreground">
            No published articles available.
          </p>

        )}

      </section>


      {/* RECENT ARTICLES */}

      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-24">

        <div className="flex items-center justify-between mb-10">

          <h2 className="text-2xl font-bold">
            Recent Articles
          </h2>

          <Link
            to="/articles"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

        </div>

        {loading ? (

          <p className="text-muted-foreground">
            Loading articles...
          </p>

        ) : (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {recent.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
              />
            ))}

          </div>

        )}

      </section>


      {/* TECH STACK */}

      <section className="border-t py-10 bg-muted/30">

        <div className="max-w-5xl mx-auto px-4 text-center">

          <h2 className="text-3xl font-bold mb-10">
            Built With Modern Web Technology
          </h2>

          <div className="flex flex-wrap justify-center gap-4">

            {[
              "React",
              "TypeScript",
              "Vite",
              "TailwindCSS",
              "Supabase",
              "Vercel"
            ].map((tech) => (

              <span
                key={tech}
                className="px-5 py-2 border rounded-full text-sm bg-background shadow-sm"
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