import { Link } from "react-router-dom";

/* =======================
 * TYPE (API FRIENDLY)
 * ======================= */
export type Article = {
  id: number;
  title: string;
  image?: string;
  category?: string;
  excerpt?: string;
  readTime?: string;
  created_at?: string;
};

const API_URL = "http://localhost:3001";

const ArticleCard = ({ article }: { article: Article }) => {
  return (
    <Link
      to={`/articles/${article.id}`}
      className="
        group
        block
        rounded-xl
        overflow-hidden
        bg-card
        shadow-card
        hover:shadow-elevated
        transition-all
        duration-300
      "
    >
      {/* IMAGE */}
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={
            article.image
              ? `${API_URL}${article.image}`
              : "/placeholder.jpg"
          }
          alt={article.title}
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
          loading="lazy"
        />
      </div>

      {/* CONTENT */}
      <div className="p-5">
        {/* META */}
        <div className="flex items-center gap-3 mb-3">
          {article.category && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-badge text-badge-foreground">
              {article.category}
            </span>
          )}

          {article.readTime && (
            <span className="text-xs text-muted-foreground">
              {article.readTime}
            </span>
          )}
        </div>

        {/* TITLE */}
        <h3 className="text-lg font-bold leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>

        {/* EXCERPT */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {article.excerpt ??
            "Klik untuk membaca artikel selengkapnya."}
        </p>
      </div>
    </Link>
  );
};

export default ArticleCard;