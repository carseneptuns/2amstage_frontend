import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import api, { apiErrorMessage } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { InlineSpinner } from "../components/ui/LoadingScreen";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "/";

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      setSession(res.data.access_token, res.data.user);
      toast.success(`Selamat datang kembali, ${res.data.user.nama.split(" ")[0]}!`);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Email atau password salah."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-spotlight px-5 py-28">
      <div className="pointer-events-none absolute -left-24 top-20 h-[400px] w-[300px] rotate-12 bg-stage/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-[400px] w-[300px] -rotate-12 bg-violet/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md rounded-3xl border border-black/10 bg-surface/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
      >
        <Link to="/" className="flex items-center justify-center gap-2">
          <Zap className="h-6 w-6 text-stage" strokeWidth={2.5} />
          <span className="font-display text-xl tracking-wide">
            2AM<span className="text-stage">STAGE</span>
          </span>
        </Link>

        <h1 className="mt-6 text-center font-display text-3xl tracking-wide">MASUK PANGGUNG</h1>
        <p className="mt-2 text-center text-sm text-mid">
          Belum punya akun?{" "}
          <Link to="/register" className="font-semibold text-stage hover:underline">
            Daftar di sini
          </Link>
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-dim">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" />
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={onChange}
                placeholder="kamu@email.com"
                className="w-full rounded-xl border border-black/10 bg-void/60 py-3 pl-11 pr-4 text-sm text-hi outline-none transition focus:border-stage/50 focus:ring-2 focus:ring-stage/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-dim">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" />
              <input
                type={showPw ? "text" : "password"}
                name="password"
                required
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-black/10 bg-void/60 py-3 pl-11 pr-11 text-sm text-hi outline-none transition focus:border-stage/50 focus:ring-2 focus:ring-stage/20"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dim hover:text-hi"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
            {loading ? <InlineSpinner /> : (
              <>
                Masuk <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
