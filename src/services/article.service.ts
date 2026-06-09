import { supabase } from "@/lib/supabase";
import { Article } from "@/types";

export const articleService = {
  async getArticles(status?: "published" | "draft") {
    let query = supabase
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
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data?.map((a: any) => ({
      ...a,
      categories: a.article_categories
        ?.map((c: any) => c.categories?.name)
        .filter(Boolean),
    })) as Article[];
  },

  async getArticleBySlug(slug: string) {
    const { data, error } = await supabase
      .from("articles")
      .select(`
        *,
        article_categories (
          categories (
            name
          )
        )
      `)
      .eq("slug", slug)
      .single();

    if (error) throw error;

    return {
      ...data,
      categories: data.article_categories
        ?.map((c: any) => c.categories?.name)
        .filter(Boolean),
    } as Article;
  },

  async getRelatedArticles(slug: string, limit = 3) {
    const { data, error } = await supabase
      .from("articles")
      .select("id,title,slug,image")
      .eq("status", "published")
      .neq("slug", slug)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async searchArticles(searchQuery: string) {
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
      .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    return data?.map((a: any) => ({
      ...a,
      categories: a.article_categories
        ?.map((c: any) => c.categories?.name)
        .filter(Boolean),
    })) as Article[];
  },

  async deleteArticle(id: number, imagePath?: string) {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) throw error;

    if (imagePath) {
      const fileName = imagePath.split("/").pop();
      if (fileName) {
        await supabase.storage.from("articles").remove([fileName]);
      }
    }
  }
};
