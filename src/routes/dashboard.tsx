import { createFileRoute, Outlet, Link, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, FileText, Calendar, Users, Clapperboard, BarChart3, Menu, Send, Layers, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getUser, logout } from "@/lib/auth";
import { useCredits } from "@/lib/hooks/useCredits";
import { mockStats } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (!getUser()) throw redirect({ to: "/login" });
  },
  component: DashboardLayout,
});

const navItems = [
  { to: "/dashboard" as const, label: "Home", icon: BarChart3 },
  { to: "/dashboard/scripts" as const, label: "Scripts", icon: FileText },
  { to: "/dashboard/calendar" as const, label: "Calendar", icon: Calendar },
  { to: "/dashboard/twins" as const, label: "AI Twins", icon: Users },
  { to: "/dashboard/studio" as const, label: "Studio", icon: Clapperboard },
  { to: "/dashboard/bulk" as const, label: "Bulk Reels", icon: Layers },
  { to: "/dashboard/publish" as const, label: "Publish", icon: Send },
  { to: "/dashboard/analytics" as const, label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/settings" as const, label: "Settings", icon: Settings },
];

function usePageTitle(pathname: string) {
  if (pathname.includes("/scripts")) return "Scripts";
  if (pathname.includes("/calendar")) return "Calendar";
  if (pathname.includes("/twins")) return "AI Twins";
  if (pathname.includes("/studio")) return "Studio";
  if (pathname.includes("/bulk")) return "Bulk Reels";
  if (pathname.includes("/publish")) return "Publish";
  if (pathname.includes("/analytics")) return "Analytics";
  if (pathname.includes("/settings")) return "Settings";
  return "Home";
}

function SidebarContent({
  pathname,
  creditsRemaining,
  creditsTotal,
  onNavClick,
}: {
  pathname: string;
  creditsRemaining: number;
  creditsTotal: number;
  onNavClick?: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
        <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">AI Twin</div>
          <div className="text-[11px] text-muted-foreground -mt-0.5">Content Studio</div>
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isHome = item.to === "/dashboard";
          const active = isHome
            ? pathname === "/dashboard" || pathname === "/dashboard/"
            : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavClick}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                active
                  ? "bg-card text-foreground border-l-2 border-primary pl-[10px] font-medium"
                  : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="m-3 rounded-xl border border-border bg-card p-3">
        <div className="text-xs text-muted-foreground">Credits</div>
        <div className="mt-1 text-lg font-semibold tabular-nums">{creditsRemaining.toLocaleString()}</div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-gradient-primary"
            style={{ width: `${(creditsRemaining / creditsTotal) * 100}%` }}
          />
        </div>
      </div>
    </>
  );
}

function DashboardLayout() {
  const user = getUser()!;
  const navigate = useNavigate();
  const { location } = useRouterState();
  const { data: credits } = useCredits();
  const creditsRemaining = credits?.remaining_credits ?? mockStats.credits;
  const creditsTotal = credits?.total_credits ?? mockStats.creditsTotal;
  const title = usePageTitle(location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-sidebar">
        <SidebarContent
          pathname={location.pathname}
          creditsRemaining={creditsRemaining}
          creditsTotal={creditsTotal}
        />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center justify-between border-b border-border px-4 md:px-6 bg-background/80 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className="md:hidden h-8 w-8 grid place-items-center rounded-md hover:bg-card"
                  aria-label="Open navigation"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-60 p-0 flex flex-col bg-sidebar">
                <SidebarContent
                  pathname={location.pathname}
                  creditsRemaining={creditsRemaining}
                  creditsTotal={creditsTotal}
                  onNavClick={() => setMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>
            <h1 className="text-sm font-semibold tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-xs text-muted-foreground">{user.email}</span>
            <button
              onClick={() => { logout(); navigate({ to: "/login" }); }}
              className="text-xs px-2 py-1 rounded-md border border-border hover:bg-card"
            >
              Sign out
            </button>
          </div>
        </header>
        <main className="flex-1 px-4 md:px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
