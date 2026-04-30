import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingUp, TrendingDown, Zap, Calendar as CalIcon, Film, FileText, Plus, UserPlus, CalendarPlus, CheckCircle2, Clock, AlertCircle, Sparkles } from "lucide-react";
import { mockStats, mockActivity } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Home — AI Twin Studio" }, { name: "description", content: "Your AI content studio dashboard." }] }),
});

function Dashboard() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="rounded-2xl border border-border bg-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Welcome back
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            You're <span className="text-gradient-primary">2 reels</span> ahead of last week.
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Keep the momentum — your audience grew 12% in the last 7 days.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Zap} label="Credits Remaining" value={mockStats.credits.toLocaleString()} trend={12} sub="vs last 30 days" />
        <StatCard icon={FileText} label="Content This Month" value={mockStats.contentThisMonth.toString()} trend={8} sub="across 4 platforms" />
        <StatCard icon={CalIcon} label="Scheduled Posts" value={mockStats.scheduled.toString()} trend={-3} sub="next: tomorrow 9:00" />
        <StatCard icon={Film} label="Reels Rendered" value={mockStats.rendered.toString()} trend={24} sub="this month" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold mb-3">Quick actions</h3>
            <div className="space-y-2">
              <QuickAction to="/scripts/new" icon={Plus} label="New Script" desc="Generate AI script" />
              <QuickAction to="/twins" icon={UserPlus} label="Create Twin" desc="Build a new persona" />
              <QuickAction to="/calendar" icon={CalendarPlus} label="Schedule Post" desc="Plan content" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Recent activity</h3>
            <span className="text-xs text-muted-foreground">Last 24h</span>
          </div>
          <ul className="space-y-1">
            {mockActivity.map((a) => (
              <li key={a.id} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-secondary/40 transition">
                <StatusIcon status={a.status} />
                <div className="flex-1 min-w-0"><div className="text-sm truncate">{a.label}</div></div>
                <div className="text-xs text-muted-foreground shrink-0">{a.time}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; trend: number; sub: string; }) {
  const positive = trend >= 0;
  return (
    <div className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition">
      <div className="flex items-center justify-between">
        <div className="h-8 w-8 rounded-lg bg-secondary grid place-items-center"><Icon className="h-4 w-4 text-primary" /></div>
        <span className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-[oklch(0.7_0.18_145)]" : "text-destructive"}`}>
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {positive ? "+" : ""}{trend}%
        </span>
      </div>
      <div className="mt-4 text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      <div className="text-[11px] text-muted-foreground mt-2">{sub}</div>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label, desc }: { to: "/scripts/new" | "/twins" | "/calendar"; icon: React.ComponentType<{ className?: string }>; label: string; desc: string; }) {
  return (
    <Link to={to} className="flex items-center gap-3 rounded-lg border border-border bg-background hover:bg-secondary/40 hover:border-primary/30 px-3 py-2.5 transition group">
      <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center shrink-0"><Icon className="h-4 w-4 text-white" /></div>
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </Link>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "success") return <CheckCircle2 className="h-4 w-4 text-[oklch(0.7_0.18_145)]" />;
  if (status === "pending") return <Clock className="h-4 w-4 text-[oklch(0.75_0.15_75)]" />;
  return <AlertCircle className="h-4 w-4 text-destructive" />;
}
