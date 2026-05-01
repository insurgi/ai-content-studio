import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useCredits } from "@/lib/hooks/useCredits";
import { mockStats, mockActivity } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/")({
  component: Home,
});

function Home() {
  const { data: credits } = useCredits();
  const creditsDisplay = credits?.remaining_credits ?? mockStats.credits;
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
          <p className="text-sm text-muted-foreground mt-1">Your audience grew 12% in the last 7 days.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Credits" value={creditsDisplay.toLocaleString()} trend="+12%" />
        <Stat label="Content this month" value={String(mockStats.contentThisMonth)} trend="+8%" />
        <Stat label="Scheduled" value={String(mockStats.scheduled)} trend="-3%" neg />
        <Stat label="Reels rendered" value={String(mockStats.rendered)} trend="+24%" />
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold mb-3">Recent activity</h3>
        <ul className="space-y-1">
          {mockActivity.map((a) => (
            <li key={a.id} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-secondary/40">
              <span
                className={`h-2 w-2 rounded-full ${
                  a.status === "success"
                    ? "bg-[oklch(0.7_0.18_145)]"
                    : a.status === "pending"
                    ? "bg-[oklch(0.75_0.15_75)]"
                    : "bg-destructive"
                }`}
              />
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
        <span className={`text-xs font-medium ${neg ? "text-destructive" : "text-[oklch(0.7_0.18_145)]"}`}>
          {trend}
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
