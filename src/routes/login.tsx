import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { login, getUser } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (getUser()) throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "Sign in — AI Twin Studio" },
    ],
  }),
  component: LoginScreen,
});

function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pw) return;
    setError("");
    const ok = await login(email, pw);
    if (!ok) { setError("Invalid credentials"); return; }
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
            <Field label="Email" type="email" value={email} onChange={setEmail} />
            <Field label="Password" type="password" value={pw} onChange={setPw} />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              className="w-full mt-2 bg-gradient-primary text-white rounded-lg py-2 text-sm font-medium hover:opacity-90 shadow-glow"
            >
              Sign in
            </button>
          </form>
        </div>
        <p className="text-[11px] text-muted-foreground text-center mt-4">
          No API key configured? Any email/password runs in demo mode.
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}
