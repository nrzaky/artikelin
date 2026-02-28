export const isAdmin = () => {
  const admin = localStorage.getItem("admin");
  if (!admin) return false;
  return JSON.parse(admin).role === "admin";
};

export const logoutAdmin = () => {
  localStorage.removeItem("admin");
};