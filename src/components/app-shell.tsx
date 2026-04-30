import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Clapperboard,
  Layers,
  Send,
  BarChart3,
  Settings,
  Sparkles,
  Bell,
  LogOut,
  Zap,
} from "lucide-react";
import { getUser, logout } from "@/lib/auth";
import { mockStats } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/scripts", label: "Scripts", icon: FileText },
  { to: "/twins", label: "AI Twins", icon: Users },
  { to: "/studio", label: "Video Studio", icon: Clapperboard },
  { to: "/bulk", label: "Bulk Builder", icon: Layers },
  { to: "/publish", label: "Publish", icon: Send },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

const titles: Record<string, string> = {
  "/dashboard": "Home",
  "/calendar": "Content Calendar",
  "/scripts": "Scripts",
  "/twins": "AI Twins",
  "/studio": "Video Studio",
  "/bulk": "Bulk Reel Builder",
  "/publish": "Publishing",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export function AppShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const user = getUser() ?? { name: "Creator", email: "creator@example.com" };
  const title =
    Object.entries(titles).find(([k]) => path.startsWith(k))?.[1] ?? "AI Twin Studio";

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const creditPct = (mockStats.credits / mockStats.creditsTotal) * 100;

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-sidebar">
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
          {nav.map((item) => {
            const active = path === item.to || path.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
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

        {/* Credits widget */}
        <div className="m-3 rounded-xl border border-border bg-card p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Credits
          </div>
          <div className="mt-1 text-lg font-semibold tabular-nums">
            {mockStats.credits.toLocaleString()}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-gradient-primary"
              style={{ width: `${creditPct}%` }}
            />
          </div>
          <div className="mt-1.5 text-[11px] text-muted-foreground">
            of {mockStats.creditsTotal.toLocaleString()} this month
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center justify-between border-b border-border px-4 md:px-6 bg-background/80 backdrop-blur sticky top-0 z-20">
          <h1 className="text-sm font-semibold tracking-tight">{title}</h1>
          <div className="flex items-center gap-2">
            <button className="h-9 w-9 grid place-items-center rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition">
              <Bell className="h-4 w-4" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg pl-1 pr-2 py-1 hover:bg-card transition">
                  <div className="h-7 w-7 rounded-full bg-gradient-primary grid place-items-center text-xs font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm hidden sm:inline">{user.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 px-4 md:px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}