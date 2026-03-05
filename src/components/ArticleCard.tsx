import { Link } from "react-router-dom";

export type Article = {
  categories: any;
  id: number;
  title: string;
  slug: string;
  image?: string | null;
  category?: string;
  excerpt?: string;
  readTime?: string;
  created_at?: string;
};

const ArticleCard = ({ article }: { article: Article }) => {

  console.log("ARTICLE IMAGE:", article.image)
  const imageUrl = article.image
    ? article.image
    : "/placeholder.jpg";

  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group block rounded-xl overflow-hidden bg-card shadow-card hover:shadow-elevated transition-all duration-300"
    >

      {/* IMAGE */}

      <div className="aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "/placeholder.jpg";
          }}
        />
      </div>

      {/* CONTENT */}

      <div className="p-5">

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

        <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {article.excerpt ??
            "Klik untuk membaca artikel selengkapnya."}
        </p>

      </div>

    </Link>
  );
};

export default ArticleCard;