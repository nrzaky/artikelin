export type Article = {
  id: number;
  title: string;
  slug: string;
  content?: string | null;
  image?: string | null;
  categories?: string[];
  author?: string | null;
  created_at?: string | null;
  status: "draft" | "published";
  meta_title?: string | null;
  meta_description?: string | null;
  views?: number;
};

export type Category = {
  id: number;
  name: string;
};
