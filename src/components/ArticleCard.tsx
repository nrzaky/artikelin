import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { Article } from "@/types";

const ArticleCard = ({ article }: { article: Article }) => {
  const imageUrl = article.image ? article.image : "/placeholder.jpg";

  // Calculate read time from content if available
  const getReadTime = () => {
    if (!article.content) return "3 min read";
    const text = article.content.replace(/<[^>]+>/g, "");
    const words = text.trim().split(/\s+/).length;
    return `${Math.ceil(words / 200)} min read`;
  };

  const readTime = getReadTime();
  const category = article.categories && article.categories.length > 0 ? article.categories[0] : null;
  const excerpt = article.meta_description || "Klik untuk membaca artikel selengkapnya.";

  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group flex flex-col h-full bg-card/50 hover:bg-card border border-border/50 rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-1"
    >
      {/* IMAGE */}
      <div className="aspect-[16/10] overflow-hidden bg-muted/30 relative">
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/placeholder.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* CONTENT */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-4">
          {category && (
            <span className="text-[10px] font-bold tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary uppercase">
              {category}
            </span>
          )}

          <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
            <Clock className="w-3 h-3" />
            {readTime}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
          {article.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
          {excerpt}
        </p>
      </div>
    </Link>
  );
};

export default ArticleCard;