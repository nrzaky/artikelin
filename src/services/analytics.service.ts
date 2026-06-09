import { supabase } from "@/lib/supabase";

export const analyticsService = {
  async incrementView(articleId: number, currentViews: number) {
    const viewedKey = `viewed_${articleId}`;
    if (!sessionStorage.getItem(viewedKey)) {
      sessionStorage.setItem(viewedKey, "true");

      await supabase
        .from("articles")
        .update({ views: currentViews + 1 })
        .eq("id", articleId);

      await supabase
        .from("article_views")
        .insert({
          article_id: articleId
        });
        
      return currentViews + 1;
    }
    return currentViews;
  }
};
