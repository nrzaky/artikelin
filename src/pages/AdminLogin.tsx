import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email dan password wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const session = await authService.login(email, password);
      
      if (session) {
        toast.success("Login berhasil");
        navigate("/admin");
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal login: Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Helmet>
        <title>Admin Login - Artikelin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-soft">
        <h1 className="text-2xl font-bold mb-2 text-center">Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-5 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          className="w-full"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </div>
  );
};

export default AdminLogin;