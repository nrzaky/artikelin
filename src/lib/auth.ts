import { supabase } from "./supabase";

/* =======================
 * CHECK ADMIN SESSION
 * ======================= */
export const isAdmin = async (): Promise<boolean> => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error(error);
    return false;
  }

  return !!data.session;
};

/* =======================
 * GET ADMIN USER
 * ======================= */
export const getAdmin = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
};

/* =======================
 * LOGOUT
 * ======================= */
export const logoutAdmin = async () => {
  await supabase.auth.signOut();
};