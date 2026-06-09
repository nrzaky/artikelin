import { supabase } from "@/lib/supabase";

export const authService = {
  async isAdmin(): Promise<boolean> {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error(error);
      return false;
    }
    return !!data.session;
  },

  async getAdmin() {
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  },

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.session;
  },

  async logout() {
    await supabase.auth.signOut();
  }
};
