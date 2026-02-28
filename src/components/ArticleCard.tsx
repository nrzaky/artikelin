import { Link } from "react-router-dom";
import type { Article } from "@/data/articles";

const ArticleCard = ({ article }: { article: Article }) => {
  return (
    <Link
      to={`/articles/${article.id}`}
      className="group block rounded-xl overflow-hidden bg-card shadow-card hover:shadow-elevated transition-all duration-300"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-badge text-badge-foreground">
            {article.category}
          </span>
          <span className="text-xs text-muted-foreground">{article.readTime}</span>
        </div>
        <h3 className="text-lg font-bold leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
};

export default ArticleCard;
