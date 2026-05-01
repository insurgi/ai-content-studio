import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, ExternalLink, LogOut, Zap } from "lucide-react";
import { useCredits } from "@/lib/hooks/useCredits";
import { useConnectedAccounts, connectPlatform, useDisconnectPlatform } from "@/lib/hooks/useSocialPublish";
import { getUser, logout } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { mockStats } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/settings")({
  component: Settings,
});

const PLATFORMS = [
  { id: "instagram" as const, label: "Instagram", color: "bg-pink-500/20 text-pink-300 border-pink-500/30" },
  { id: "tiktok" as const, label: "TikTok", color: "bg-zinc-500/20 text-zinc-200 border-zinc-500/30" },
  { id: "linkedin" as const, label: "LinkedIn", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { id: "youtube" as const, label: "YouTube", color: "bg-red-500/20 text-red-300 border-red-500/30" },
];

function Settings() {
  const user = getUser()!;
  const navigate = useNavigate();
  const { data: credits } = useCredits();
  const { data: accounts } = useConnectedAccounts();
  const disconnectMutation = useDisconnectPlatform();
  const [copied, setCopied] = useState(false);

  const creditsRemaining = credits?.remaining_credits ?? mockStats.credits;
  const creditsTotal = credits?.total_credits ?? mockStats.creditsTotal;
  const maskedKey = `sk_${"•".repeat(32)}`;

  const copyKey = () => {
    const key = import.meta.env.VITE_AINATIVE_API_KEY ?? "";
    if (key) navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const connectedIds = new Set((accounts ?? []).map((a) => a.platform));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Billing */}
      <Section title="Billing" description="Your current credit balance and usage.">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">{creditsRemaining.toLocaleString()} credits remaining</div>
                <div className="text-xs text-muted-foreground">of {creditsTotal.toLocaleString()} total</div>
              </div>
            </div>
            <a
              href="https://ainative.studio/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center gap-1 text-primary hover:underline"
            >
              Add credits <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-gradient-primary transition-all"
              style={{ width: `${(creditsRemaining / creditsTotal) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-3 text-center pt-1">
            <div className="rounded-lg border border-border p-3">
              <div className="text-xs text-muted-foreground">Used</div>
              <div className="text-sm font-semibold mt-0.5">{(creditsTotal - creditsRemaining).toLocaleString()}</div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="text-xs text-muted-foreground">Remaining</div>
              <div className="text-sm font-semibold mt-0.5">{creditsRemaining.toLocaleString()}</div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="text-sm font-semibold mt-0.5">{creditsTotal.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Connected Platforms */}
      <Section title="Connected Platforms" description="Manage social media accounts for publishing.">
        <div className="space-y-2">
          {PLATFORMS.map((p) => {
            const account = (accounts ?? []).find((a) => a.platform === p.id);
            const isConnected = connectedIds.has(p.id);
            return (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-background/40 p-3">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg border grid place-items-center text-xs font-semibold uppercase ${p.color}`}>
                    {p.id.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{p.label}</div>
                    {account && <div className="text-xs text-muted-foreground">{account.handle}</div>}
                  </div>
                </div>
                {isConnected ? (
                  <button
                    onClick={() => disconnectMutation.mutate(p.id)}
                    disabled={disconnectMutation.isPending}
                    className="text-xs px-3 py-1 rounded-md border border-destructive/40 text-destructive hover:bg-destructive/10 transition"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => connectPlatform(p.id, `${window.location.origin}/dashboard/settings`)}
                    className="text-xs px-3 py-1 rounded-md bg-gradient-primary text-white hover:opacity-90"
                  >
                    Connect
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* API Key */}
      <Section title="API Key" description="Your AINative API key. Keep this secret.">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <code className="flex-1 text-xs text-muted-foreground font-mono truncate">{maskedKey}</code>
          <button onClick={copyKey} className="h-7 w-7 grid place-items-center rounded hover:bg-secondary" aria-label="Copy API key">
            {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Manage your key at{" "}
          <a href="https://ainative.studio/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            ainative.studio/dashboard
          </a>
        </p>
      </Section>

      {/* Account */}
      <Section title="Account" description="Your account details.">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">{user.email}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Signed in</div>
          </div>
          <button
            onClick={() => { logout(); navigate({ to: "/login" }); }}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive transition"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );
}
