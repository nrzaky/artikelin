const SESSION_DURATION = 30 * 60 * 1000; // 30 menit

type AdminSession = {
  id: number;
  name: string;
  role: "admin";
  expiresAt: number;
};

export const loginAdmin = (user: {
  id: number;
  name: string;
  role: string;
}) => {
  const session: AdminSession = {
    id: user.id,
    name: user.name,
    role: "admin",
    expiresAt: Date.now() + SESSION_DURATION,
  };

  localStorage.setItem("admin_session", JSON.stringify(session));
};

export const isAdmin = (): boolean => {
  const raw = localStorage.getItem("admin_session");
  if (!raw) return false;

  try {
    const session: AdminSession = JSON.parse(raw);

    if (Date.now() > session.expiresAt) {
      logoutAdmin();
      return false;
    }

    return session.role === "admin";
  } catch {
    return false;
  }
};

export const logoutAdmin = () => {
  localStorage.removeItem("admin_session");
};

export const getAdmin = () => {
  const raw = localStorage.getItem("admin_session");
  return raw ? JSON.parse(raw) : null;
};