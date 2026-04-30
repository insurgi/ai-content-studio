import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, FileText, Calendar, Users, Clapperboard, BarChart3, TrendingUp, Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import { login, getUser, logout } from "@/lib/auth";
import { mockStats, mockActivity, mockScripts, platformMeta, streamScript, mockAnalyticsTrend, mockTopVideos } from "@/lib/mock-data";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const Route = createFileRoute("/login")({
  component: AppPage,
  head: () => ({
    meta: [
      { title: "AI Twin Studio — AI-powered short-form content" },
      { name: "description", content: "Create, schedule, render, and publish AI-generated reels in one place." },
    ],
  }),
});

type View = "home" | "scripts" | "calendar" | "twins" | "studio" | "analytics";

function AppPage() {
  const user = getUser();
  if (!user) return <LoginScreen />;
  return <Shell />;
}

function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pw) return;
    login(email, email.split("@")[0]);
    navigate({ to: "/login" });
  };
  return (
    <div className="min-h-screen grid place-items-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <div className="w-full max-w-sm relative">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center shadow-glow"><Sparkles className="h-4 w-4 text-white" /></div>
          <div className="text-base font-semibold">AI Twin Studio</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-glow">
          <h1 className="text-xl font-semibold mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-5">Sign in to your studio</p>
          <form onSubmit={submit} className="space-y-3">
            <Input label="Email" type="email" value={email} onChange={setEmail} />
            <Input label="Password" type="password" value={pw} onChange={setPw} />
            <button type="submit" className="w-full mt-2 bg-gradient-primary text-white rounded-lg py-2 text-sm font-medium hover:opacity-90 shadow-glow">Sign in</button>
          </form>
        </div>
        <p className="text-[11px] text-muted-foreground text-center mt-4">Demo mode — any email/password works</p>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
    </div>
  );
}

function Shell() {
  const [view, setView] = useState<View>("home");
  const navigate = useNavigate();
  const user = getUser()!;
  const nav: { id: View; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "home", label: "Home", icon: BarChart3 },
    { id: "scripts", label: "Scripts", icon: FileText },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "twins", label: "AI Twins", icon: Users },
    { id: "studio", label: "Studio", icon: Clapperboard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center shadow-glow"><Sparkles className="h-4 w-4 text-white" /></div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">AI Twin</div>
            <div className="text-[11px] text-muted-foreground -mt-0.5">Content Studio</div>
          </div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = view === n.id;
            return (
              <button key={n.id} onClick={() => setView(n.id)} className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${active ? "bg-card text-foreground border-l-2 border-primary pl-[10px] font-medium" : "text-muted-foreground hover:bg-card/60 hover:text-foreground"}`}>
                <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />{n.label}
              </button>
            );
          })}
        </nav>
        <div className="m-3 rounded-xl border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">Credits</div>
          <div className="mt-1 text-lg font-semibold tabular-nums">{mockStats.credits.toLocaleString()}</div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-gradient-primary" style={{ width: `${(mockStats.credits / mockStats.creditsTotal) * 100}%` }} />
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center justify-between border-b border-border px-6 bg-background/80 backdrop-blur sticky top-0 z-20">
          <h1 className="text-sm font-semibold tracking-tight capitalize">{view}</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{user.email}</span>
            <button onClick={() => { logout(); navigate({ to: "/login" }); }} className="text-xs px-2 py-1 rounded-md border border-border hover:bg-card">Sign out</button>
          </div>
        </header>
        <main className="flex-1 px-6 py-6">
          {view === "home" && <Home />}
          {view === "scripts" && <Scripts />}
          {view === "calendar" && <CalendarView />}
          {view === "twins" && <Placeholder title="AI Twins" desc="Manage your AI twin personas. (Coming next iteration.)" />}
          {view === "studio" && <Placeholder title="Video Studio" desc="3-panel render workspace. (Coming next iteration.)" />}
          {view === "analytics" && <Analytics />}
        </main>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="rounded-2xl border border-border bg-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2"><Sparkles className="h-3.5 w-3.5 text-primary" /> Welcome back</div>
          <h2 className="text-2xl font-semibold tracking-tight">You're <span className="text-gradient-primary">2 reels</span> ahead of last week.</h2>
          <p className="text-sm text-muted-foreground mt-1">Your audience grew 12% in the last 7 days.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Credits" value={mockStats.credits.toLocaleString()} trend="+12%" />
        <Stat label="Content this month" value={String(mockStats.contentThisMonth)} trend="+8%" />
        <Stat label="Scheduled" value={String(mockStats.scheduled)} trend="-3%" neg />
        <Stat label="Reels rendered" value={String(mockStats.rendered)} trend="+24%" />
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold mb-3">Recent activity</h3>
        <ul className="space-y-1">
          {mockActivity.map((a) => (
            <li key={a.id} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-secondary/40">
              <span className={`h-2 w-2 rounded-full ${a.status === "success" ? "bg-[oklch(0.7_0.18_145)]" : a.status === "pending" ? "bg-[oklch(0.75_0.15_75)]" : "bg-destructive"}`} />
              <div className="flex-1 text-sm truncate">{a.label}</div>
              <div className="text-xs text-muted-foreground">{a.time}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value, trend, neg }: { label: string; value: string; trend: string; neg?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        <span className={`text-xs font-medium ${neg ? "text-destructive" : "text-[oklch(0.7_0.18_145)]"}`}>{trend}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function Scripts() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Educational");
  const [duration, setDuration] = useState(30);
  const [platform, setPlatform] = useState("tiktok");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true); setOutput("");
    let acc = "";
    for await (const c of streamScript(topic, tone, duration, platform)) { acc += c; setOutput(acc); }
    setLoading(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 h-fit">
        <div>
          <label className="text-xs text-muted-foreground">Topic</label>
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Morning Productivity Hacks" className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Platform</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
            <option value="tiktok">TikTok</option><option value="instagram">Instagram</option><option value="youtube">YouTube</option><option value="linkedin">LinkedIn</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Tone</label>
          <div className="grid grid-cols-2 gap-1.5">
            {["Educational", "Entertaining", "Inspirational", "Professional"].map((t) => (
              <button key={t} onClick={() => setTone(t)} className={`text-xs py-1.5 rounded-md border transition ${tone === t ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>{t}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground flex items-center justify-between mb-1.5"><span>Duration</span><span className="text-foreground">{duration}s</span></label>
          <div className="flex gap-1.5">
            {[15, 30, 60].map((d) => (
              <button key={d} onClick={() => setDuration(d)} className={`flex-1 text-xs py-1.5 rounded-md border transition ${duration === d ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>{d}s</button>
            ))}
          </div>
        </div>
        <button onClick={generate} disabled={loading} className="w-full bg-gradient-primary text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-glow">
          <Sparkles className="h-4 w-4" /> {loading ? "Generating..." : "Generate Script"}
        </button>
        <div className="pt-3 border-t border-border">
          <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Recent</div>
          <div className="space-y-1.5">
            {mockScripts.slice(0, 4).map((s) => (
              <div key={s.id} className="text-xs p-2 rounded-md border border-border bg-background">
                <div className="font-medium truncate">{s.title}</div>
                <div className="text-muted-foreground mt-0.5">{platformMeta[s.platform].label} · {s.duration}s</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card flex flex-col min-h-[600px]">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border text-sm">
          <Sparkles className="h-4 w-4 text-primary" /><span className="font-medium">AI Output</span>
          {loading && (
            <span className="flex gap-1 ml-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
          )}
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          {output ? (
            <div className={`text-sm leading-relaxed whitespace-pre-wrap ${loading ? "typewriter-cursor" : ""}`}>
              {output.split("\n").map((line, i) => {
                const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) => p.startsWith("**") && p.endsWith("**") ? <strong key={j} className="text-foreground font-semibold">{p.slice(2, -2)}</strong> : <span key={j}>{p}</span>);
                return <p key={i}>{parts || <>&nbsp;</>}</p>;
              })}
            </div>
          ) : (
            <div className="h-full grid place-items-center text-center">
              <div>
                <div className="h-12 w-12 rounded-full bg-gradient-primary grid place-items-center mx-auto mb-3 shadow-glow"><Sparkles className="h-5 w-5 text-white" /></div>
                <p className="text-sm text-muted-foreground">Your AI script will stream here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CalendarView() {
  const today = new Date();
  const first = new Date(today.getFullYear(), today.getMonth(), 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  const monthLabel = today.toLocaleString("en-US", { month: "long", year: "numeric" });
  return (
    <div className="max-w-[1400px] mx-auto">
      <h2 className="text-lg font-semibold mb-4">{monthLabel}</h2>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (<div key={d} className="px-3 py-2 text-xs font-medium text-muted-foreground">{d}</div>))}
        </div>
        <div className="grid grid-cols-7 auto-rows-fr">
          {cells.map((d, i) => (
            <div key={i} className={`min-h-[100px] border-r border-b border-border/60 p-2 ${!d ? "bg-background/40" : ""}`}>
              {d && <div className={`text-xs ${d === today.getDate() ? "h-5 w-5 rounded-full bg-primary text-white grid place-items-center font-semibold" : "text-muted-foreground"}`}>{d}</div>}
              {d && d % 5 === 0 && <div className="mt-1 text-[11px] px-1.5 py-0.5 rounded border bg-pink-500/20 text-pink-300 border-pink-500/30 truncate">Reel drop</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Placeholder({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-10 text-center">
      <div className="h-12 w-12 rounded-full bg-gradient-primary grid place-items-center mx-auto mb-3 shadow-glow"><Sparkles className="h-5 w-5 text-white" /></div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
    </div>
  );
}
