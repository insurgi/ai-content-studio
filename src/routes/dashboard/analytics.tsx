import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Heart, TrendingUp, Share2 } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import { mockAnalyticsTrend, mockTopVideos, platformMeta } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/analytics")({
  component: Analytics,
});

const platformPalette: Record<string, string> = {
  instagram: "oklch(0.7 0.2 0)",
  tiktok: "oklch(0.85 0.05 250)",
  linkedin: "oklch(0.65 0.18 240)",
  youtube: "oklch(0.65 0.22 25)",
};

function Analytics() {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");
  const { data: analyticsData } = useAnalytics(range);

  const trend = analyticsData?.trend ?? mockAnalyticsTrend.slice(range === "7d" ? -7 : -30);
  const topVideos = analyticsData?.top_videos ?? mockTopVideos;
  const completionRate = analyticsData?.completion_rate ?? 87;

  const platformData = analyticsData?.platform_breakdown
    ? analyticsData.platform_breakdown.map((pb) => ({
        name: platformMeta[pb.platform as keyof typeof platformMeta]?.label ?? pb.platform,
        key: pb.platform,
        views: pb.views,
        fill: platformPalette[pb.platform] ?? "oklch(0.6 0.1 265)",
      }))
    : (Object.keys(platformMeta) as (keyof typeof platformMeta)[]).map((p) => {
        const videos = mockTopVideos.filter((v) => v.platform === p);
        const views = videos.reduce((s, v) => s + v.views, 0) || Math.floor(20000 + p.length * 9000);
        return { name: platformMeta[p].label, key: p, views, fill: platformPalette[p] };
      });

  const completion = [
    { name: "Completed", value: completionRate, fill: "oklch(0.62 0.2 265)" },
    { name: "Remaining", value: 100 - completionRate, fill: "oklch(0.25 0.02 265)" },
  ];

  const totalViews = analyticsData?.views ?? trend.reduce((s, d) => s + d.views, 0);
  const totalLikes = analyticsData?.likes ?? trend.reduce((s, d) => s + (d.likes ?? 0), 0);
  const engRate = analyticsData?.engagement_rate?.toFixed(1) ?? ((totalLikes / totalViews) * 100).toFixed(1);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold">Performance overview</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Aggregated across all connected platforms</p>
        </div>
        <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`text-xs px-3 py-1.5 rounded-md transition ${range === r ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KStat icon={Eye} label="Total views" value={totalViews.toLocaleString()} trend="+18.4%" />
        <KStat icon={Heart} label="Engagements" value={totalLikes.toLocaleString()} trend="+12.1%" />
        <KStat icon={TrendingUp} label="Engagement rate" value={`${engRate}%`} trend="+0.6%" />
        <KStat icon={Share2} label="Shares" value={(analyticsData?.shares ?? Math.floor(totalLikes * 0.08)).toLocaleString()} trend="+22%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Performance over time</h3>
              <p className="text-xs text-muted-foreground">Views & likes</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Views</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[oklch(0.75_0.18_320)]" /> Likes</span>
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
                  <linearGradient id="gLike" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.75 0.18 320)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.75 0.18 320)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="date" stroke="oklch(0.6 0.02 265)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.6 0.02 265)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.02 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="views" stroke="oklch(0.62 0.2 265)" strokeWidth={2} fill="url(#gView)" />
                <Area type="monotone" dataKey="likes" stroke="oklch(0.75 0.18 320)" strokeWidth={2} fill="url(#gLike)" />
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
                <div className="text-3xl font-semibold tabular-nums text-gradient-primary">{completionRate}%</div>
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
            {topVideos.map((v, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3">
                <div className="text-xs font-mono text-muted-foreground w-5">{i + 1}</div>
                <div className={`h-9 w-9 rounded-lg grid place-items-center text-[10px] font-semibold uppercase border ${platformMeta[v.platform].color}`}>
                  {v.platform.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{v.title}</div>
                  <div className="text-[11px] text-muted-foreground">{v.twin}</div>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-3 w-3" /> {(v.views / 1000).toFixed(1)}k
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Heart className="h-3 w-3" /> {(v.likes / 1000).toFixed(1)}k
                  </div>
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

function KStat({ icon: Icon, label, value, trend }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="text-[11px] font-medium text-[oklch(0.7_0.18_145)]">{trend}</span>
      </div>
      <div className="mt-3 text-xl font-semibold tabular-nums">{value}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
