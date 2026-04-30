import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { login } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in — AI Twin Studio" },
      { name: "description", content: "Sign in to your AI Twin Content Studio account." },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErr("Please enter email and password.");
      return;
    }
    login(email, email.split("@")[0]);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <div className="w-full max-w-sm relative">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="text-base font-semibold">AI Twin Studio</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-glow">
          <h1 className="text-xl font-semibold mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-5">Sign in to your studio</p>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="creator@studio.com"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="••••••••"
              />
            </div>
            {err && <div className="text-xs text-destructive">{err}</div>}
            <button
              type="submit"
              className="w-full mt-2 bg-gradient-primary text-white rounded-lg py-2 text-sm font-medium hover:opacity-90 transition shadow-glow"
            >
              Sign in
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            No account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
        <p className="text-[11px] text-muted-foreground text-center mt-4">
          Demo mode — any email/password works
        </p>
      </div>
    </div>
  );
}