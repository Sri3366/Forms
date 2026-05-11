import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setAdminToken } from "../lib/api";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      const { data } = await api.post("/admin/login", { email, password });
      setAdminToken(data.token);
      toast.success("Welcome back");
      nav("/admin");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Invalid credentials");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-2xl p-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37]/15">
            <Lock className="h-4 w-4 text-[#d4af37]" />
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-white/40">Admin Portal</div>
            <h1 className="font-serif text-2xl">Sign in</h1>
          </div>
        </div>

        <label className="text-xs uppercase tracking-[0.25em] text-white/40">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-dark mt-2 mb-5 w-full rounded-lg px-4 py-3"
          data-testid="admin-email-input"
        />

        <label className="text-xs uppercase tracking-[0.25em] text-white/40">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-dark mt-2 mb-8 w-full rounded-lg px-4 py-3"
          data-testid="admin-password-input"
        />

        <button
          type="submit"
          disabled={busy}
          data-testid="admin-login-btn"
          className="btn-gold w-full rounded-full py-3"
        >
          {busy ? "Signing in…" : "Enter Dashboard"}
        </button>
      </form>
    </div>
  );
}