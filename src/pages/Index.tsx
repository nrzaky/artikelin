import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard, { Article } from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const Index = () => {

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  /* =======================
     FETCH ARTICLES
  ======================= */

  useEffect(() => {

    const fetchArticles = async () => {

      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          article_categories (
            categories (
              id,
              name
            )
          )
        `)
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const formatted =
        data?.map((a: any) => ({
          ...a,
          categories: a.article_categories
            ?.map((c: any) => c.categories?.name)
            .filter(Boolean)
        })) || [];

      setArticles(formatted);
      setLoading(false);

    };

    fetchArticles();

  }, []);

  const featured = articles[0];
  const recent = articles.slice(1, 4);

  return (

    <div className="min-h-screen bg-background">

      <Navbar />

      {/* HERO */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary" />

        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 md:px-8 py-24 md:py-36 text-center text-primary-foreground">

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Artikelin
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Stories, insights, and ideas — crafted for the curious mind.
          </p>

          <Link to="/articles">
            <Button size="lg" className="shadow-lg">
              Browse Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

        </div>

      </section>

      {/* FEATURED */}

      <section className="container mx-auto px-4 md:px-8 py-16">

        <h2 className="text-2xl font-bold mb-8">
          Featured Article
        </h2>

        {loading ? (

          <p className="text-muted-foreground">
            Loading featured article...
          </p>

        ) : featured ? (

          <Link
            to={`/articles/${featured.slug}`}
            className="group block rounded-xl overflow-hidden bg-card shadow-card hover:shadow-elevated transition-all duration-300"
          >

            <div className="grid md:grid-cols-2">

              {/* IMAGE */}

              <div className="aspect-[16/10] md:aspect-auto overflow-hidden bg-muted">

                <img
                  src={featured.image ?? "/placeholder.jpg"}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

              </div>

              {/* CONTENT */}

              <div className="p-6 md:p-10 flex flex-col justify-center">

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

                <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {featured.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed mb-4">
                  Klik untuk membaca artikel selengkapnya.
                </p>

                {featured.created_at && (
                  <div className="text-sm text-muted-foreground">
                    {new Date(featured.created_at).toLocaleDateString()}
                  </div>
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

      {/* RECENT */}

      <section className="container mx-auto px-4 md:px-8 pb-16">

        <div className="flex items-center justify-between mb-8">

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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {recent.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
              />
            ))}

          </div>

        )}

      </section>

      <Footer />

    </div>

  );

};

export default Index;