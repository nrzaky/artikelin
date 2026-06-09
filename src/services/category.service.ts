import { supabase } from "@/lib/supabase";
import { Category } from "@/types";

export const categoryService = {
  async getCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id");

    if (error) throw error;
    return data as Category[];
  },
};
