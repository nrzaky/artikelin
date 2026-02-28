import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import ArticleCard from "@/components/ArticleCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { articles } from "@/data/articles";
import { Button } from "@/components/ui/button";

const Index = () => {
  const featured = articles[0];
  const recent = articles.slice(1, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="Artikelin — modern article platform"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="relative container mx-auto px-4 md:px-8 py-24 md:py-36 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground mb-4 animate-fade-in">
            Artikelin
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.15s" }}>
            Stories, insights, and ideas — crafted for the curious mind.
          </p>
          <Link to="/articles">
            <Button size="lg" className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              Browse Articles <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Article */}
      <section className="container mx-auto px-4 md:px-8 py-16">
        <h2 className="text-2xl font-bold mb-8">Featured Article</h2>
        <Link
          to={`/articles/${featured.id}`}
          className="group block rounded-xl overflow-hidden bg-card shadow-card hover:shadow-elevated transition-all duration-300"
        >
          <div className="grid md:grid-cols-2">
            <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6 md:p-10 flex flex-col justify-center">
              <span className="inline-block w-fit text-xs font-semibold px-2.5 py-1 rounded-full bg-badge text-badge-foreground mb-4">
                {featured.category}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                {featured.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">{featured.excerpt}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{featured.author}</span>
                <span>·</span>
                <span>{featured.date}</span>
                <span>·</span>
                <span>{featured.readTime}</span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Recent Articles */}
      <section className="container mx-auto px-4 md:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Recent Articles</h2>
          <Link to="/articles" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
