import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { articles } from "@/data/articles";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 md:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Link to="/articles" className="text-primary hover:underline">
            ← Back to articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Cover image */}
      <div className="w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      <article className="container mx-auto px-4 md:px-8 max-w-3xl py-10">
        <Link
          to="/articles"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to articles
        </Link>

        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-badge text-badge-foreground mb-4">
          {article.category}
        </span>

        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
          {article.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-10 pb-8 border-b">
          <span className="font-medium text-foreground">{article.author}</span>
          <span>·</span>
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.readTime}</span>
        </div>

        <div
          className="article-prose"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      <Footer />
    </div>
  );
};

export default ArticleDetail;
