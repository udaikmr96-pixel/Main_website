import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Loader2, Trash2, Mail, Building2, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/lib/api";

const TOKEN_KEY = "is_admin_token";

function LoginCard({ onLogin }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error("Enter the admin password.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/admin/login", { password });
      localStorage.setItem(TOKEN_KEY, data.token);
      toast.success("Signed in.");
      onLogin(data.token);
    } catch (err) {
      const detail = err?.response?.data?.detail || "Login failed.";
      toast.error(typeof detail === "string" ? detail : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#050505]">
      <form
        onSubmit={submit}
        data-testid="admin-login-form"
        className="w-full max-w-md border border-white/10 bg-[#0a0a0a] p-10"
      >
        <Link
          to="/"
          data-testid="admin-back-home"
          className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition mb-8"
        >
          <ArrowLeft size={14} />
          Back to site
        </Link>
        <span className="text-xs tracking-[0.25em] uppercase text-neutral-500 font-semibold">
          Admin
        </span>
        <h1 className="font-display mt-4 text-3xl md:text-4xl tracking-tight font-light">
          Individual Stake
        </h1>
        <p className="mt-2 text-sm text-neutral-400">Sign in to review submissions.</p>

        <div className="mt-8">
          <Label
            htmlFor="admin-password"
            className="text-xs uppercase tracking-[0.2em] text-neutral-400"
          >
            Password
          </Label>
          <Input
            id="admin-password"
            data-testid="admin-password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-2 bg-transparent border-white/15 focus:border-white text-white placeholder:text-neutral-600 h-12 rounded-none"
          />
        </div>

        <Button
          type="submit"
          data-testid="admin-login-submit"
          disabled={loading}
          className="mt-6 w-full bg-white text-black hover:bg-neutral-200 h-12 rounded-full text-sm font-medium disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </div>
  );
}

function Dashboard({ token, onLogout }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(data);
      if (data.length && !selected) setSelected(data[0]);
    } catch (err) {
      if (err?.response?.status === 401) {
        onLogout();
      } else {
        toast.error("Could not load submissions.");
      }
    } finally {
      setLoading(false);
    }
  }, [token, onLogout, selected]);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteOne = async (id) => {
    if (!window.confirm("Delete this submission permanently?")) return;
    try {
      await api.delete(`/admin/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const next = items.filter((i) => i.id !== id);
      setItems(next);
      if (selected?.id === id) setSelected(next[0] || null);
      toast.success("Submission deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10 px-6 md:px-10 h-16 flex items-center justify-between sticky top-0 bg-black/70 backdrop-blur-xl z-40">
        <Link to="/" className="flex items-center gap-2">
          <span className="block w-2 h-2 bg-white rounded-full" />
          <span className="font-display tracking-tight font-medium">
            Individual Stake · Admin
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span
            data-testid="admin-count"
            className="text-xs text-neutral-500 uppercase tracking-[0.2em]"
          >
            {items.length} submission{items.length === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            onClick={onLogout}
            data-testid="admin-logout-button"
            className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white border border-white/15 hover:border-white px-4 py-2 rounded-full transition"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
        {loading ? (
          <div className="flex items-center gap-3 text-neutral-400 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        ) : items.length === 0 ? (
          <div
            data-testid="admin-empty-state"
            className="border border-white/10 bg-[#0a0a0a] p-16 text-center"
          >
            <h2 className="font-display text-2xl font-light">No submissions yet</h2>
            <p className="text-neutral-500 mt-2 text-sm">
              When someone fills the contact form, it will show up here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <ul
              data-testid="admin-submission-list"
              className="lg:col-span-5 border border-white/10 bg-[#0a0a0a] divide-y divide-white/10 max-h-[75vh] overflow-y-auto"
            >
              {items.map((s) => {
                const isActive = selected?.id === s.id;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(s)}
                      data-testid={`admin-row-${s.id}`}
                      className={`w-full text-left p-5 transition ${
                        isActive
                          ? "bg-white/[0.04] border-l-2 border-white"
                          : "hover:bg-white/[0.02] border-l-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-display font-medium text-base">
                          {s.name}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                          {s.service_interest}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-neutral-500 truncate">
                        {s.email}
                      </div>
                      <div className="mt-3 text-xs text-neutral-400 line-clamp-2">
                        {s.message}
                      </div>
                      <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                        {formatDate(s.created_at)}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            <section
              data-testid="admin-submission-detail"
              className="lg:col-span-7 border border-white/10 bg-[#0a0a0a] p-8 md:p-10"
            >
              {selected ? (
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                      Submission
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteOne(selected.id)}
                      data-testid="admin-delete-button"
                      className="inline-flex items-center gap-2 text-xs text-red-300 hover:text-red-200 border border-red-300/20 hover:border-red-300/60 px-3 py-1.5 rounded-full transition"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                  <h2 className="font-display mt-4 text-3xl md:text-4xl tracking-tight font-light">
                    {selected.name}
                  </h2>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Mail size={14} className="mt-1 text-neutral-500" />
                      <a
                        href={`mailto:${selected.email}`}
                        className="text-white hover:underline break-all"
                      >
                        {selected.email}
                      </a>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building2 size={14} className="mt-1 text-neutral-500" />
                      <span className="text-neutral-300">
                        {selected.company || "—"}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar size={14} className="mt-1 text-neutral-500" />
                      <span className="text-neutral-300">
                        {formatDate(selected.created_at)}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                        Service
                      </span>
                      <span className="text-neutral-300">
                        {selected.service_interest}
                      </span>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div className="text-xs uppercase tracking-[0.25em] text-neutral-500 mb-3">
                      Message
                    </div>
                    <div className="whitespace-pre-wrap text-neutral-200 leading-relaxed border-l-2 border-white/30 pl-4">
                      {selected.message}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-neutral-500 text-sm">
                  Select a submission to view details.
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const navigate = useNavigate();

  // Validate stored token on mount
  useEffect(() => {
    if (!token) return;
    api
      .get("/admin/me", { headers: { Authorization: `Bearer ${token}` } })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      });
  }, [token]);

  const logout = useCallback(() => {
    if (token) {
      api
        .post(
          "/admin/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    toast.message("Signed out.");
    navigate("/admin");
  }, [token, navigate]);

  if (!token) return <LoginCard onLogin={setToken} />;
  return <Dashboard token={token} onLogout={logout} />;
}
