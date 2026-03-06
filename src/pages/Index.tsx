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

  /* ================= FETCH ARTICLES ================= */

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

      <section className="relative overflow-hidden border-b">

        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary opacity-90" />

        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 md:px-6 py-28 md:py-36 text-center text-primary-foreground">

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Artikelin
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Blog teknologi yang membahas dunia pemrograman, software development,
            dan tren teknologi terbaru untuk developer modern.
          </p>

          <Link to="/articles">
            <Button size="lg" className="shadow-xl">
              Explore Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

        </div>

      </section>


      {/* ABOUT WEBSITE */}

      <section className="py-24">

        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">

          {/* TEXT */}

          <div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              About Artikelin
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Artikelin</strong> adalah platform blog teknologi yang
              membahas pemrograman, software development, dan tren teknologi
              terbaru. Website ini dibuat untuk berbagi wawasan, tutorial,
              serta insight dunia coding untuk developer modern.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-4">
              Mulai dari bahasa pemrograman seperti PHP, TypeScript,
              hingga backend modern seperti Golang dan cloud development.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Artikelin dibangun menggunakan teknologi modern seperti
              React, TypeScript, Supabase, dan dideploy menggunakan
              Vercel untuk performa cepat dan scalable.
            </p>

          </div>

          {/* AUTHOR CARD */}

          <div className="border rounded-2xl p-8 bg-card shadow-sm">

            <h3 className="text-xl font-semibold mb-4">
              About the Creator
            </h3>

            <p className="text-muted-foreground mb-4">
              Halo, saya <strong>Naufal Raikhan Zaky</strong>, seorang
              software developer yang berfokus pada backend development
              dan modern web technologies.
            </p>

            <p className="text-muted-foreground mb-6">
              Website ini saya buat sebagai tempat berbagi pengetahuan
              sekaligus sebagai project portfolio untuk menunjukkan
              kemampuan saya dalam membangun aplikasi web modern.
            </p>

            <div className="flex gap-3">

              <a
                href="https://github.com/nrzaky"
                target="_blank"
                className="px-4 py-2 border rounded-lg text-sm hover:bg-muted transition"
              >
                GitHub
              </a>

              <a
                href="https://linkedin.com/in/naufalraikhanz"
                target="_blank"
                className="px-4 py-2 border rounded-lg text-sm hover:bg-muted transition"
              >
                LinkedIn
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* FEATURED ARTICLE */}

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

      <section className="border-t py-24 bg-muted/30">

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


      <Footer />

    </div>

  );

};

export default Index;