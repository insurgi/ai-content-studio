import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { login } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Create account — AI Twin Studio" },
      { name: "description", content: "Create your AI Twin Content Studio account." },
    ],
  }),
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !pw) return setErr("All fields required.");
    if (pw !== pw2) return setErr("Passwords do not match.");
    login(email, name);
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
          <h1 className="text-xl font-semibold mb-1">Create your studio</h1>
          <p className="text-sm text-muted-foreground mb-5">Start creating reels in minutes</p>
          <form onSubmit={submit} className="space-y-3">
            <Input label="Name" value={name} onChange={setName} placeholder="Alex Creator" />
            <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="alex@studio.com" />
            <Input label="Password" type="password" value={pw} onChange={setPw} placeholder="••••••••" />
            <Input label="Confirm" type="password" value={pw2} onChange={setPw2} placeholder="••••••••" />
            {err && <div className="text-xs text-destructive">{err}</div>}
            <button
              type="submit"
              className="w-full mt-2 bg-gradient-primary text-white rounded-lg py-2 text-sm font-medium hover:opacity-90 transition shadow-glow"
            >
              Create account
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}