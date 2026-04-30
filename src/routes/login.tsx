import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, FileText, Calendar, Users, Clapperboard, BarChart3, TrendingUp, Eye, Heart, MessageCircle, Share2, Upload, Mic, Wand2, Check, Plus, Play, Trash2, X, Pause, SkipBack, SkipForward, Scissors, Type, Music, Image as ImageIcon, Film, Layers, Volume2, Download, Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { login, getUser, logout } from "@/lib/auth";
import { mockStats, mockActivity, mockScripts, platformMeta, streamScript, mockAnalyticsTrend, mockTopVideos, mockTwins } from "@/lib/mock-data";
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
          {view === "twins" && <Twins />}
          {view === "studio" && <Studio />}
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

const platformPalette: Record<string, string> = {
  instagram: "oklch(0.7 0.2 0)",
  tiktok: "oklch(0.85 0.05 250)",
  linkedin: "oklch(0.65 0.18 240)",
  youtube: "oklch(0.65 0.22 25)",
};

function Analytics() {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");
  const trend = mockAnalyticsTrend.slice(range === "7d" ? -7 : range === "30d" ? -30 : -30);

  const platformData = (Object.keys(platformMeta) as (keyof typeof platformMeta)[]).map((p) => {
    const videos = mockTopVideos.filter((v) => v.platform === p);
    const views = videos.reduce((s, v) => s + v.views, 0) || Math.floor(20000 + (p.length * 9000));
    return { name: platformMeta[p].label, key: p, views, fill: platformPalette[p] };
  });

  const completion = [
    { name: "Completed", value: 87, fill: "oklch(0.62 0.2 265)" },
    { name: "Remaining", value: 13, fill: "oklch(0.25 0.02 265)" },
  ];

  const totalViews = trend.reduce((s, d) => s + d.views, 0);
  const totalEng = trend.reduce((s, d) => s + d.engagement, 0);
  const engRate = ((totalEng / totalViews) * 100).toFixed(1);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold">Performance overview</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Aggregated across all connected platforms</p>
        </div>
        <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <button key={r} onClick={() => setRange(r)} className={`text-xs px-3 py-1.5 rounded-md transition ${range === r ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}>{r}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KStat icon={Eye} label="Total views" value={totalViews.toLocaleString()} trend="+18.4%" />
        <KStat icon={Heart} label="Engagements" value={totalEng.toLocaleString()} trend="+12.1%" />
        <KStat icon={TrendingUp} label="Engagement rate" value={`${engRate}%`} trend="+0.6%" />
        <KStat icon={Share2} label="Shares" value={(Math.floor(totalEng * 0.08)).toLocaleString()} trend="+22%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Performance over time</h3>
              <p className="text-xs text-muted-foreground">Views & engagement</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Views</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[oklch(0.75_0.18_320)]" /> Engagement</span>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gView" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.2 265)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.62 0.2 265)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gEng" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.75 0.18 320)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.75 0.18 320)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.6 0.02 265)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.6 0.02 265)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.02 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="views" stroke="oklch(0.62 0.2 265)" strokeWidth={2} fill="url(#gView)" />
                <Area type="monotone" dataKey="engagement" stroke="oklch(0.75 0.18 320)" strokeWidth={2} fill="url(#gEng)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold">Completion rate</h3>
          <p className="text-xs text-muted-foreground">Avg. video watch-through</p>
          <div className="h-[200px] mt-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={completion} dataKey="value" innerRadius={60} outerRadius={85} startAngle={90} endAngle={-270} stroke="none">
                  {completion.map((c, i) => <Cell key={i} fill={c.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="text-center">
                <div className="text-3xl font-semibold tabular-nums text-gradient-primary">87%</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Completion</div>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-border p-2"><div className="text-xs text-muted-foreground">Hook</div><div className="text-sm font-semibold">96%</div></div>
            <div className="rounded-lg border border-border p-2"><div className="text-xs text-muted-foreground">Mid</div><div className="text-sm font-semibold">89%</div></div>
            <div className="rounded-lg border border-border p-2"><div className="text-xs text-muted-foreground">CTA</div><div className="text-sm font-semibold">76%</div></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold mb-1">Top platforms</h3>
          <p className="text-xs text-muted-foreground mb-4">Views by platform</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" horizontal={false} />
                <XAxis type="number" stroke="oklch(0.6 0.02 265)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="oklch(0.6 0.02 265)" fontSize={11} tickLine={false} axisLine={false} width={70} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.02 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="views" radius={[0, 6, 6, 0]}>
                  {platformData.map((p, i) => <Cell key={i} fill={p.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Top performing videos</h3>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
          </div>
          <div className="space-y-2">
            {mockTopVideos.map((v, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3">
                <div className="text-xs font-mono text-muted-foreground w-5">{i + 1}</div>
                <div className={`h-9 w-9 rounded-lg grid place-items-center text-[10px] font-semibold uppercase border ${platformMeta[v.platform].color}`}>{v.platform.slice(0, 2)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{v.title}</div>
                  <div className="text-[11px] text-muted-foreground">{v.twin}</div>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground"><Eye className="h-3 w-3" /> {(v.views / 1000).toFixed(1)}k</div>
                  <div className="flex items-center gap-1 text-muted-foreground"><Heart className="h-3 w-3" /> {(v.likes / 1000).toFixed(1)}k</div>
                  <div className="text-[oklch(0.7_0.18_145)] font-medium tabular-nums w-10 text-right">{v.eng}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KStat({ icon: Icon, label, value, trend }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; trend: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center"><Icon className="h-4 w-4 text-primary" /></div>
        <span className="text-[11px] font-medium text-[oklch(0.7_0.18_145)]">{trend}</span>
      </div>
      <div className="mt-3 text-xl font-semibold tabular-nums">{value}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

type TwinDraft = {
  name: string;
  style: string;
  voice: string;
  accent: string;
  pace: number;
  energy: number;
  formality: number;
  niche: string;
  catchphrase: string;
  source: "upload" | "record" | "preset";
  preset: string;
};

const styleOptions = [
  { id: "Corporate", desc: "Polished, authoritative", grad: "from-blue-500 to-cyan-500" },
  { id: "Bold", desc: "High-energy, punchy", grad: "from-orange-500 to-pink-500" },
  { id: "Minimal", desc: "Calm, confident", grad: "from-emerald-500 to-teal-500" },
  { id: "Neon", desc: "Futuristic, vibrant", grad: "from-fuchsia-500 to-purple-500" },
  { id: "Academic", desc: "Studious, precise", grad: "from-indigo-500 to-blue-500" },
  { id: "Creator", desc: "Casual, relatable", grad: "from-yellow-500 to-orange-500" },
];

const voiceOptions = [
  { id: "Pro Female", desc: "Warm, articulate" },
  { id: "Pro Male", desc: "Deep, grounded" },
  { id: "Casual Female", desc: "Friendly, upbeat" },
  { id: "Casual Male", desc: "Easy, conversational" },
  { id: "Soft Female", desc: "Gentle, calming" },
  { id: "Energetic", desc: "High tempo, hype" },
];

function Twins() {
  const [twins, setTwins] = useState(mockTwins);
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const remove = (id: string) => setTwins((t) => t.filter((x) => x.id !== id));

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold">AI Twins</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{twins.length} personas · Create custom AI presenters for your videos</p>
        </div>
        <button onClick={() => setCreating(true)} className="flex items-center gap-2 bg-gradient-primary text-white rounded-lg px-3.5 py-2 text-sm font-medium hover:opacity-90 shadow-glow">
          <Plus className="h-4 w-4" /> New Twin
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {twins.map((t) => (
          <div key={t.id} className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-all">
            <div className={`h-32 bg-gradient-to-br ${t.color} relative`}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => remove(t.id)} className="h-7 w-7 rounded-lg bg-black/40 backdrop-blur grid place-items-center hover:bg-destructive/80"><Trash2 className="h-3.5 w-3.5 text-white" /></button>
              </div>
              <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur grid place-items-center text-white font-semibold text-lg border-2 border-white/30">
                  {t.name.charAt(0)}
                </div>
                <button className="h-8 w-8 rounded-full bg-white/90 grid place-items-center hover:bg-white"><Play className="h-3.5 w-3.5 text-black ml-0.5" /></button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold truncate">{t.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{t.style}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{t.voice}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.videos} videos</span>
                <button onClick={() => setSelected(t.id)} className="text-primary hover:underline">Edit</button>
              </div>
            </div>
          </div>
        ))}

        <button onClick={() => setCreating(true)} className="rounded-2xl border-2 border-dashed border-border hover:border-primary/40 bg-card/40 hover:bg-card transition-all min-h-[260px] grid place-items-center group">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 grid place-items-center mx-auto mb-2 group-hover:bg-primary/20 transition"><Plus className="h-5 w-5 text-primary" /></div>
            <div className="text-sm font-medium">Create new twin</div>
            <div className="text-xs text-muted-foreground mt-0.5">Upload, record, or pick a preset</div>
          </div>
        </button>
      </div>

      {creating && <TwinCreator onClose={() => setCreating(false)} onCreate={(t) => { setTwins((arr) => [t, ...arr]); setCreating(false); }} />}
      {selected && <TwinCreator existing={twins.find((t) => t.id === selected)} onClose={() => setSelected(null)} onCreate={(t) => { setTwins((arr) => arr.map((x) => x.id === t.id ? t : x)); setSelected(null); }} />}
    </div>
  );
}

function TwinCreator({ onClose, onCreate, existing }: { onClose: () => void; onCreate: (t: typeof mockTwins[number]) => void; existing?: typeof mockTwins[number] }) {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<TwinDraft>({
    name: existing?.name ?? "",
    style: existing?.style ?? "Corporate",
    voice: existing?.voice ?? "Pro Female",
    accent: "American",
    pace: 50,
    energy: 60,
    formality: 70,
    niche: "",
    catchphrase: "",
    source: "preset",
    preset: "Sarah",
  });
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);

  const styleObj = styleOptions.find((s) => s.id === draft.style)!;
  const canNext = step === 1 ? !!draft.source : step === 2 ? !!(draft.style && draft.voice) : step === 3 ? draft.name.trim().length > 0 : true;

  const finalize = async () => {
    setTraining(true);
    for (let p = 0; p <= 100; p += 4) {
      await new Promise((r) => setTimeout(r, 60));
      setProgress(p);
    }
    onCreate({
      id: existing?.id ?? `t${Date.now()}`,
      name: draft.name,
      style: draft.style,
      voice: draft.voice,
      videos: existing?.videos ?? 0,
      color: styleObj.grad,
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-3xl rounded-2xl border border-border bg-card shadow-glow my-8">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center"><Wand2 className="h-4 w-4 text-white" /></div>
            <div>
              <div className="text-sm font-semibold">{existing ? "Edit Twin" : "Create AI Twin"}</div>
              <div className="text-[11px] text-muted-foreground">Step {step} of 4</div>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-secondary grid place-items-center"><X className="h-4 w-4" /></button>
        </div>

        <div className="px-5 pt-4">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? "bg-gradient-primary" : "bg-secondary"}`} />
            ))}
          </div>
        </div>

        <div className="p-5 min-h-[420px]">
          {training ? (
            <div className="grid place-items-center min-h-[400px]">
              <div className="text-center max-w-sm">
                <div className="h-16 w-16 rounded-full bg-gradient-primary grid place-items-center mx-auto mb-4 shadow-glow animate-pulse"><Sparkles className="h-7 w-7 text-white" /></div>
                <h3 className="text-base font-semibold">Training {draft.name}…</h3>
                <p className="text-xs text-muted-foreground mt-1">Analyzing voice, style, and persona traits</p>
                <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-gradient-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-2 text-xs text-muted-foreground tabular-nums">{progress}%</div>
              </div>
            </div>
          ) : step === 1 ? (
            <div>
              <h3 className="text-base font-semibold">How do you want to create this twin?</h3>
              <p className="text-xs text-muted-foreground mt-1">Pick the source we'll use to model your persona</p>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {([
                  { id: "upload", icon: Upload, label: "Upload video", desc: "1-3 min sample" },
                  { id: "record", icon: Mic, label: "Record now", desc: "Use your mic & cam" },
                  { id: "preset", icon: Sparkles, label: "Start from preset", desc: "Pick a template" },
                ] as const).map((s) => {
                  const Icon = s.icon;
                  const active = draft.source === s.id;
                  return (
                    <button key={s.id} onClick={() => setDraft({ ...draft, source: s.id })} className={`text-left rounded-xl border p-4 transition-all ${active ? "border-primary bg-primary/5 shadow-glow" : "border-border hover:border-primary/40"}`}>
                      <div className={`h-10 w-10 rounded-lg grid place-items-center mb-3 ${active ? "bg-gradient-primary" : "bg-secondary"}`}><Icon className={`h-5 w-5 ${active ? "text-white" : "text-muted-foreground"}`} /></div>
                      <div className="text-sm font-medium">{s.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                    </button>
                  );
                })}
              </div>
              {draft.source === "upload" && (
                <div className="mt-4 rounded-xl border-2 border-dashed border-border p-8 text-center hover:border-primary/40 transition cursor-pointer">
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                  <div className="text-sm mt-2">Drop a video here or click to browse</div>
                  <div className="text-xs text-muted-foreground mt-0.5">MP4 or MOV · 1-3 min · Clear face & voice</div>
                </div>
              )}
              {draft.source === "record" && (
                <div className="mt-4 rounded-xl border border-border bg-background/40 p-6 text-center">
                  <div className="h-14 w-14 rounded-full bg-destructive/20 grid place-items-center mx-auto"><Mic className="h-6 w-6 text-destructive" /></div>
                  <div className="text-sm font-medium mt-3">Ready to record</div>
                  <div className="text-xs text-muted-foreground mt-1">Read the on-screen prompt for ~60 seconds</div>
                </div>
              )}
              {draft.source === "preset" && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {["Sarah", "Alex", "Maya", "Kai", "Lin", "Jay"].map((p) => (
                    <button key={p} onClick={() => setDraft({ ...draft, preset: p, name: draft.name || p })} className={`aspect-square rounded-xl border-2 grid place-items-center font-semibold transition ${draft.preset === p ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>{p[0]}</button>
                  ))}
                </div>
              )}
            </div>
          ) : step === 2 ? (
            <div>
              <h3 className="text-base font-semibold">Choose visual style & voice</h3>
              <p className="text-xs text-muted-foreground mt-1">This shapes how your twin looks and sounds</p>
              <div className="mt-4">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Visual style</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {styleOptions.map((s) => {
                    const active = draft.style === s.id;
                    return (
                      <button key={s.id} onClick={() => setDraft({ ...draft, style: s.id })} className={`relative rounded-xl border overflow-hidden text-left transition-all ${active ? "border-primary shadow-glow" : "border-border hover:border-primary/40"}`}>
                        <div className={`h-12 bg-gradient-to-r ${s.grad}`} />
                        <div className="p-2.5">
                          <div className="text-sm font-medium flex items-center gap-1.5">{s.id}{active && <Check className="h-3.5 w-3.5 text-primary" />}</div>
                          <div className="text-[11px] text-muted-foreground">{s.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-5">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Voice</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {voiceOptions.map((v) => {
                    const active = draft.voice === v.id;
                    return (
                      <button key={v.id} onClick={() => setDraft({ ...draft, voice: v.id })} className={`rounded-lg border p-2.5 text-left transition-all ${active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">{v.id}</div>
                          <Play className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{v.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Accent</label>
                  <select value={draft.accent} onChange={(e) => setDraft({ ...draft, accent: e.target.value })} className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                    {["American", "British", "Australian", "Canadian", "Neutral"].map((a) => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ) : step === 3 ? (
            <div>
              <h3 className="text-base font-semibold">Personality traits</h3>
              <p className="text-xs text-muted-foreground mt-1">Fine-tune how your twin delivers content</p>
              <div className="mt-5 space-y-5">
                <Slider label="Pace" left="Slow" right="Fast" value={draft.pace} onChange={(v) => setDraft({ ...draft, pace: v })} />
                <Slider label="Energy" left="Calm" right="Hype" value={draft.energy} onChange={(v) => setDraft({ ...draft, energy: v })} />
                <Slider label="Formality" left="Casual" right="Formal" value={draft.formality} onChange={(v) => setDraft({ ...draft, formality: v })} />
              </div>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Twin name</label>
                  <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Professional Sarah" className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Niche / topic</label>
                  <input value={draft.niche} onChange={(e) => setDraft({ ...draft, niche: e.target.value })} placeholder="Productivity, AI, Marketing" className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground">Signature phrase (optional)</label>
                  <input value={draft.catchphrase} onChange={(e) => setDraft({ ...draft, catchphrase: e.target.value })} placeholder="Let's get into it." className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-base font-semibold">Review & train</h3>
              <p className="text-xs text-muted-foreground mt-1">Confirm details — training takes ~30 seconds</p>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5">
                <div className={`rounded-2xl bg-gradient-to-br ${styleObj.grad} aspect-square grid place-items-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative h-20 w-20 rounded-full bg-white/20 backdrop-blur grid place-items-center text-white font-semibold text-3xl border-2 border-white/30">
                    {draft.name.charAt(0) || "?"}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <Row k="Name" v={draft.name || "—"} />
                  <Row k="Source" v={draft.source === "preset" ? `Preset: ${draft.preset}` : draft.source === "upload" ? "Uploaded video" : "Recorded sample"} />
                  <Row k="Style" v={draft.style} />
                  <Row k="Voice" v={`${draft.voice} · ${draft.accent}`} />
                  <Row k="Pace / Energy / Formality" v={`${draft.pace} / ${draft.energy} / ${draft.formality}`} />
                  <Row k="Niche" v={draft.niche || "—"} />
                  {draft.catchphrase && <Row k="Catchphrase" v={`"${draft.catchphrase}"`} />}
                </div>
              </div>
            </div>
          )}
        </div>

        {!training && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-border">
            <button onClick={() => step > 1 ? setStep(step - 1) : onClose()} className="text-sm px-3 py-2 rounded-lg border border-border hover:bg-secondary">{step > 1 ? "Back" : "Cancel"}</button>
            {step < 4 ? (
              <button onClick={() => setStep(step + 1)} disabled={!canNext} className="text-sm px-4 py-2 rounded-lg bg-gradient-primary text-white font-medium hover:opacity-90 disabled:opacity-40 shadow-glow">Continue</button>
            ) : (
              <button onClick={finalize} className="text-sm px-4 py-2 rounded-lg bg-gradient-primary text-white font-medium hover:opacity-90 shadow-glow flex items-center gap-2"><Sparkles className="h-4 w-4" /> {existing ? "Save changes" : "Train Twin"}</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Slider({ label, left, right, value, onChange }: { label: string; left: string; right: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground tabular-nums">{value}</span>
      </div>
      <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full mt-2 accent-primary" />
      <div className="flex justify-between text-[11px] text-muted-foreground -mt-1"><span>{left}</span><span>{right}</span></div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 border-b border-border/60 last:border-0">
      <div className="text-xs text-muted-foreground">{k}</div>
      <div className="text-sm text-right">{v}</div>
    </div>
  );
}

type Clip = { id: string; track: "video" | "audio" | "text"; start: number; duration: number; label: string; color: string };

const initialClips: Clip[] = [
  { id: "c1", track: "video", start: 0, duration: 4, label: "Hook · Sarah", color: "from-blue-500 to-cyan-500" },
  { id: "c2", track: "video", start: 4, duration: 8, label: "Body · B-roll", color: "from-fuchsia-500 to-purple-500" },
  { id: "c3", track: "video", start: 12, duration: 6, label: "CTA · Sarah", color: "from-blue-500 to-cyan-500" },
  { id: "t1", track: "text", start: 0.5, duration: 3, label: "Stop scrolling.", color: "from-yellow-400 to-orange-500" },
  { id: "t2", track: "text", start: 5, duration: 6, label: "3 productivity hacks", color: "from-yellow-400 to-orange-500" },
  { id: "t3", track: "text", start: 13, duration: 4, label: "Follow for more", color: "from-yellow-400 to-orange-500" },
  { id: "a1", track: "audio", start: 0, duration: 18, label: "Lo-fi beat · 80bpm", color: "from-emerald-500 to-teal-500" },
];

const assetLib = {
  twins: [
    { id: "tw1", name: "Sarah", grad: "from-blue-500 to-cyan-500" },
    { id: "tw2", name: "Alex", grad: "from-orange-500 to-pink-500" },
    { id: "tw3", name: "Maya", grad: "from-emerald-500 to-teal-500" },
    { id: "tw4", name: "Kai", grad: "from-fuchsia-500 to-purple-500" },
  ],
  broll: [
    { id: "b1", label: "City night", grad: "from-indigo-600 to-purple-700" },
    { id: "b2", label: "Workspace", grad: "from-zinc-600 to-zinc-800" },
    { id: "b3", label: "Coffee pour", grad: "from-amber-700 to-orange-900" },
    { id: "b4", label: "Sunrise", grad: "from-orange-400 to-pink-500" },
    { id: "b5", label: "Code editor", grad: "from-slate-700 to-slate-900" },
    { id: "b6", label: "Notebook", grad: "from-stone-400 to-stone-600" },
  ],
  music: [
    { id: "m1", label: "Lo-fi beat", bpm: 80, mood: "Chill" },
    { id: "m2", label: "Cinematic", bpm: 110, mood: "Epic" },
    { id: "m3", label: "Upbeat pop", bpm: 128, mood: "Energetic" },
    { id: "m4", label: "Ambient pad", bpm: 60, mood: "Calm" },
  ],
  text: [
    { id: "tx1", label: "Big Bold", style: "uppercase font-black tracking-tight" },
    { id: "tx2", label: "Subtitle", style: "text-base" },
    { id: "tx3", label: "Highlight", style: "italic font-semibold" },
    { id: "tx4", label: "Caption", style: "text-xs uppercase tracking-widest" },
  ],
};

function Studio() {
  const totalDuration = 18;
  const [clips, setClips] = useState<Clip[]>(initialClips);
  const [selected, setSelected] = useState<string | null>("c1");
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [zoom, setZoom] = useState(40);
  const [tab, setTab] = useState<"twins" | "broll" | "music" | "text">("twins");

  // Playhead animation
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setTime((t) => {
        const n = t + 0.1;
        if (n >= totalDuration) { setPlaying(false); return 0; }
        return n;
      });
    }, 100);
    return () => clearInterval(id);
  }, [playing]);

  const sel = clips.find((c) => c.id === selected) || null;
  const activeText = clips.find((c) => c.track === "text" && time >= c.start && time < c.start + c.duration);
  const activeVideo = clips.find((c) => c.track === "video" && time >= c.start && time < c.start + c.duration);

  const updateClip = (id: string, patch: Partial<Clip>) => setClips((cs) => cs.map((c) => c.id === id ? { ...c, ...patch } : c));
  const removeClip = (id: string) => { setClips((cs) => cs.filter((c) => c.id !== id)); if (selected === id) setSelected(null); };

  const tracks: { id: Clip["track"]; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "video", label: "Video", icon: Film },
    { id: "text", label: "Text", icon: Type },
    { id: "audio", label: "Audio", icon: Music },
  ];

  return (
    <div className="-mx-6 -my-6 h-[calc(100vh-3.5rem)] flex flex-col bg-background">
      {/* Toolbar */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <input defaultValue="Untitled reel · Apr 30" className="bg-transparent text-sm font-medium focus:outline-none focus:bg-secondary/50 rounded px-2 py-1" />
          <span className="text-[11px] text-muted-foreground">9:16 · {totalDuration}s</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-8 px-3 text-xs rounded-lg border border-border hover:bg-secondary flex items-center gap-1.5"><Layers className="h-3.5 w-3.5" /> Templates</button>
          <button className="h-8 px-3 text-xs rounded-lg border border-border hover:bg-secondary flex items-center gap-1.5"><Wand2 className="h-3.5 w-3.5" /> Auto-edit</button>
          <button className="h-8 px-3.5 text-xs rounded-lg bg-gradient-primary text-white font-medium hover:opacity-90 shadow-glow flex items-center gap-1.5"><Download className="h-3.5 w-3.5" /> Render</button>
        </div>
      </div>

      {/* 3-panel body */}
      <div className="flex-1 grid grid-cols-[260px_1fr_300px] min-h-0">
        {/* LEFT: Asset library */}
        <div className="border-r border-border flex flex-col min-h-0">
          <div className="grid grid-cols-4 border-b border-border">
            {([
              { id: "twins", icon: Users, label: "Twins" },
              { id: "broll", icon: ImageIcon, label: "B-roll" },
              { id: "music", icon: Music, label: "Music" },
              { id: "text", icon: Type, label: "Text" },
            ] as const).map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} className={`flex flex-col items-center gap-1 py-2.5 text-[10px] uppercase tracking-wide transition ${active ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  <Icon className="h-4 w-4" />{t.label}
                </button>
              );
            })}
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {tab === "twins" && (
              <div className="grid grid-cols-2 gap-2">
                {assetLib.twins.map((t) => (
                  <button key={t.id} className={`group rounded-lg overflow-hidden border border-border hover:border-primary/40 bg-gradient-to-br ${t.grad} aspect-square relative`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[11px] font-medium text-white drop-shadow">{t.name}</div>
                    <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded bg-black/40 backdrop-blur grid place-items-center opacity-0 group-hover:opacity-100"><Plus className="h-3 w-3 text-white" /></div>
                  </button>
                ))}
              </div>
            )}
            {tab === "broll" && (
              <div className="grid grid-cols-2 gap-2">
                {assetLib.broll.map((b) => (
                  <button key={b.id} className={`group rounded-lg overflow-hidden border border-border hover:border-primary/40 bg-gradient-to-br ${b.grad} aspect-video relative`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-1 left-1.5 text-[10px] text-white/90">{b.label}</div>
                  </button>
                ))}
              </div>
            )}
            {tab === "music" && (
              <div className="space-y-1.5">
                {assetLib.music.map((m) => (
                  <button key={m.id} className="w-full flex items-center gap-3 p-2 rounded-lg border border-border hover:border-primary/40 bg-card text-left">
                    <div className="h-8 w-8 rounded bg-gradient-to-br from-emerald-500 to-teal-500 grid place-items-center"><Music className="h-3.5 w-3.5 text-white" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{m.label}</div>
                      <div className="text-[10px] text-muted-foreground">{m.bpm} bpm · {m.mood}</div>
                    </div>
                    <Play className="h-3 w-3 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
            {tab === "text" && (
              <div className="space-y-1.5">
                {assetLib.text.map((t) => (
                  <button key={t.id} className="w-full p-2.5 rounded-lg border border-border hover:border-primary/40 bg-card text-left">
                    <div className="text-[10px] text-muted-foreground mb-1">{t.label}</div>
                    <div className={`text-sm ${t.style}`}>Aa Sample text</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="p-3 border-t border-border">
            <button className="w-full flex items-center justify-center gap-2 text-xs py-2 rounded-lg border border-dashed border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"><Upload className="h-3.5 w-3.5" /> Upload media</button>
          </div>
        </div>

        {/* CENTER: Preview + transport */}
        <div className="flex flex-col min-h-0 bg-[oklch(0.12_0.01_265)]">
          <div className="flex-1 grid place-items-center p-6 min-h-0">
            <div className="relative bg-black rounded-xl overflow-hidden shadow-glow" style={{ aspectRatio: "9 / 16", height: "min(100%, 70vh)" }}>
              {activeVideo ? (
                <div className={`absolute inset-0 bg-gradient-to-br ${activeVideo.color}`}>
                  <div className="absolute inset-0 bg-black/30" />
                </div>
              ) : (
                <div className="absolute inset-0 grid place-items-center text-muted-foreground text-xs">No clip at playhead</div>
              )}
              {activeText && (
                <div className="absolute inset-x-4 bottom-16 text-center">
                  <div className="inline-block px-3 py-1.5 rounded-md bg-black/50 backdrop-blur text-white text-lg font-bold uppercase tracking-tight drop-shadow">{activeText.label}</div>
                </div>
              )}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] text-white/70 bg-black/40 backdrop-blur rounded px-2 py-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> 9:16 · 1080×1920</div>
              <button className="absolute top-3 right-3 h-7 w-7 rounded bg-black/40 backdrop-blur grid place-items-center text-white/80 hover:bg-black/60"><Maximize2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
          <div className="border-t border-border bg-card/40 px-4 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1">
              <button className="h-8 w-8 grid place-items-center rounded hover:bg-secondary"><SkipBack className="h-4 w-4" /></button>
              <button onClick={() => setPlaying((p) => !p)} className="h-9 w-9 grid place-items-center rounded-full bg-gradient-primary text-white shadow-glow hover:opacity-90">{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}</button>
              <button className="h-8 w-8 grid place-items-center rounded hover:bg-secondary"><SkipForward className="h-4 w-4" /></button>
            </div>
            <div className="text-xs tabular-nums text-muted-foreground">
              <span className="text-foreground">{time.toFixed(1)}s</span> / {totalDuration.toFixed(1)}s
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setZoom((z) => Math.max(20, z - 10))} className="h-8 w-8 grid place-items-center rounded hover:bg-secondary"><ZoomOut className="h-3.5 w-3.5" /></button>
              <span className="text-[10px] text-muted-foreground tabular-nums w-8 text-center">{zoom}px</span>
              <button onClick={() => setZoom((z) => Math.min(80, z + 10))} className="h-8 w-8 grid place-items-center rounded hover:bg-secondary"><ZoomIn className="h-3.5 w-3.5" /></button>
            </div>
          </div>

          {/* Timeline */}
          <div className="border-t border-border bg-card/20 h-[220px] flex flex-col shrink-0">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/60">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Timeline</div>
              <div className="flex items-center gap-1">
                <button className="h-6 px-2 text-[10px] rounded hover:bg-secondary flex items-center gap-1"><Scissors className="h-3 w-3" /> Split</button>
                {selected && <button onClick={() => removeClip(selected)} className="h-6 px-2 text-[10px] rounded hover:bg-destructive/20 hover:text-destructive flex items-center gap-1"><Trash2 className="h-3 w-3" /> Delete</button>}
              </div>
            </div>
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
              <div className="relative" style={{ width: totalDuration * zoom + 80 }}>
                {/* Ruler */}
                <div className="h-5 border-b border-border/60 flex items-end pl-[80px] sticky top-0 bg-card/40">
                  {Array.from({ length: totalDuration + 1 }).map((_, i) => (
                    <div key={i} className="relative" style={{ width: zoom }}>
                      <div className="absolute bottom-0 left-0 h-1.5 w-px bg-border" />
                      <div className="absolute bottom-0 left-0 text-[9px] text-muted-foreground tabular-nums -translate-x-1/2">{i}s</div>
                    </div>
                  ))}
                </div>
                {/* Tracks */}
                {tracks.map((tr) => {
                  const Icon = tr.icon;
                  return (
                    <div key={tr.id} className="flex items-center border-b border-border/60 h-[52px]">
                      <div className="w-[80px] shrink-0 px-2 flex items-center gap-1.5 text-[10px] text-muted-foreground sticky left-0 bg-card/40 h-full border-r border-border/60">
                        <Icon className="h-3 w-3" />{tr.label}
                      </div>
                      <div className="relative flex-1 h-full">
                        {clips.filter((c) => c.track === tr.id).map((c) => {
                          const active = selected === c.id;
                          return (
                            <button
                              key={c.id}
                              onClick={() => setSelected(c.id)}
                              className={`absolute top-1.5 bottom-1.5 rounded-md bg-gradient-to-r ${c.color} text-left px-2 overflow-hidden border-2 transition-all ${active ? "border-white shadow-glow z-10" : "border-transparent hover:border-white/40"}`}
                              style={{ left: c.start * zoom, width: c.duration * zoom }}
                            >
                              <div className="text-[10px] font-medium text-white truncate drop-shadow">{c.label}</div>
                              <div className="text-[9px] text-white/70 tabular-nums">{c.duration}s</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {/* Playhead */}
                <div className="absolute top-0 bottom-0 w-px bg-primary z-20 pointer-events-none" style={{ left: 80 + time * zoom }}>
                  <div className="absolute -top-0.5 -left-1.5 h-3 w-3 rotate-45 bg-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Inspector */}
        <div className="border-l border-border flex flex-col min-h-0">
          <div className="px-4 py-3 border-b border-border">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Inspector</div>
            <div className="text-sm font-semibold mt-0.5">{sel ? sel.label : "No clip selected"}</div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {sel ? (
              <>
                <div className={`h-24 rounded-lg bg-gradient-to-br ${sel.color} grid place-items-center text-white text-xs font-medium`}>
                  {sel.track.toUpperCase()} CLIP
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Start (s)" value={sel.start} onChange={(v) => updateClip(sel.id, { start: v })} />
                  <Field label="Duration (s)" value={sel.duration} onChange={(v) => updateClip(sel.id, { duration: Math.max(0.5, v) })} />
                </div>
                <Slider label="Opacity" left="0" right="100" value={100} onChange={() => {}} />
                <Slider label="Volume" left="0" right="100" value={sel.track === "audio" ? 80 : 100} onChange={() => {}} />
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Transition in</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["None", "Fade", "Slide", "Zoom", "Wipe", "Glitch"].map((t, i) => (
                      <button key={t} className={`text-[11px] py-1.5 rounded border transition ${i === 1 ? "border-primary bg-primary/10" : "border-border hover:border-primary/40 text-muted-foreground"}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Effects</div>
                  <div className="space-y-1.5">
                    {["Auto-captions", "Shake on beat", "Background blur"].map((e, i) => (
                      <label key={e} className="flex items-center justify-between text-xs p-2 rounded-md bg-secondary/40 border border-border">
                        <span>{e}</span>
                        <input type="checkbox" defaultChecked={i === 0} className="accent-primary h-3.5 w-3.5" />
                      </label>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-xs text-muted-foreground text-center py-10">Select a clip in the timeline to edit its properties.</div>
            )}
          </div>
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground"><Volume2 className="h-3.5 w-3.5" /> Master volume</div>
            <input type="range" defaultValue={85} className="w-full mt-1.5 accent-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</label>
      <input type="number" step={0.1} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/40" />
    </div>
  );
}
