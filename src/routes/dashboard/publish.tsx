import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import { useConnectedAccounts, connectPlatform, useDisconnectPlatform, useSocialPublish } from "@/lib/hooks/useSocialPublish";
import type { Platform } from "@/lib/hooks/useSocialPublish";

export const Route = createFileRoute("/dashboard/publish")({
  component: PublishDashboard,
});

const PLATFORMS: { id: Platform; label: string; color: string; aspect: string }[] = [
  { id: "instagram", label: "Instagram", color: "bg-pink-500/20 text-pink-300 border-pink-500/30", aspect: "9/16" },
  { id: "tiktok", label: "TikTok", color: "bg-zinc-500/20 text-zinc-200 border-zinc-500/30", aspect: "9/16" },
  { id: "linkedin", label: "LinkedIn", color: "bg-blue-500/20 text-blue-300 border-blue-500/30", aspect: "1/1" },
  { id: "youtube", label: "YouTube", color: "bg-red-500/20 text-red-300 border-red-500/30", aspect: "16/9" },
];

function PublishDashboard() {
  const { data: accounts } = useConnectedAccounts();
  const disconnectMutation = useDisconnectPlatform();
  const publishMutation = useSocialPublish();

  const [reelUrl, setReelUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [twinId, setTwinId] = useState("t1");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [results, setResults] = useState<Array<{ platform: Platform; status: string }>>([]);

  const connectedIds = new Set((accounts ?? []).map((a) => a.platform));
  const togglePlatform = (p: Platform) =>
    setSelectedPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  const handlePublish = async () => {
    if (!reelUrl || selectedPlatforms.length === 0) return;
    try {
      const res = await publishMutation.mutateAsync({
        platforms: selectedPlatforms,
        reel_url: reelUrl,
        caption,
        twin_id: twinId,
      });
      setResults(res.results);
    } catch { /* demo */ }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Platform connector */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold mb-1">Connected Accounts</h3>
        <p className="text-xs text-muted-foreground mb-4">Connect your social platforms to publish directly.</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {PLATFORMS.map((p) => {
            const account = (accounts ?? []).find((a) => a.platform === p.id);
            const isConnected = connectedIds.has(p.id);
            return (
              <div key={p.id} className={`rounded-xl border p-4 ${isConnected ? "border-primary/40 bg-primary/5" : "border-border"}`}>
                <div className={`h-10 w-10 rounded-lg border grid place-items-center text-xs font-semibold uppercase mb-3 ${p.color}`}>
                  {p.id.slice(0, 2)}
                </div>
                <div className="text-sm font-medium">{p.label}</div>
                {account && <div className="text-xs text-muted-foreground mt-0.5">{account.handle}</div>}
                <div className="mt-3">
                  {isConnected ? (
                    <button
                      onClick={() => disconnectMutation.mutate(p.id)}
                      className="text-xs text-destructive hover:underline"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => connectPlatform(p.id, `${window.location.origin}/dashboard/publish`)}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      Connect <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Publish form */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-semibold">Publish a Reel</h3>
          <div>
            <label className="text-xs text-muted-foreground">Reel URL</label>
            <input
              value={reelUrl}
              onChange={(e) => setReelUrl(e.target.value)}
              placeholder="https://example.com/reel.mp4"
              className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              placeholder="Add your caption, hashtags…"
              className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Publish to</label>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map((p) => {
                const active = selectedPlatforms.includes(p.id);
                const connected = connectedIds.has(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => connected && togglePlatform(p.id)}
                    disabled={!connected}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                      active ? "border-primary bg-primary/10" : connected ? "border-border hover:border-primary/40" : "border-border opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <span className={`h-5 w-5 rounded border text-[9px] font-semibold uppercase grid place-items-center ${p.color}`}>
                      {p.id.slice(0, 2)}
                    </span>
                    {p.label}
                    {!connected && <span className="ml-auto text-[10px] text-muted-foreground">not connected</span>}
                  </button>
                );
              })}
            </div>
          </div>
          <button
            onClick={handlePublish}
            disabled={publishMutation.isPending || !reelUrl || selectedPlatforms.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-gradient-primary text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 shadow-glow"
          >
            {publishMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {publishMutation.isPending ? "Publishing…" : `Publish to ${selectedPlatforms.length || ""} platform${selectedPlatforms.length !== 1 ? "s" : ""}`}
          </button>

          {results.length > 0 && (
            <div className="rounded-lg border border-border bg-background/40 p-3 space-y-1.5">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
                  <span className="capitalize font-medium">{r.platform}</span>
                  <span className="text-muted-foreground">— {r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Platform Previews</h3>
          <div className="space-y-4">
            {PLATFORMS.filter((p) => selectedPlatforms.includes(p.id) || (!selectedPlatforms.length)).slice(0, 2).map((p) => (
              <div key={p.id}>
                <div className="text-xs text-muted-foreground mb-1.5">{p.label}</div>
                <div
                  className="bg-black rounded-lg overflow-hidden relative border border-border/40"
                  style={{ aspectRatio: p.aspect, maxHeight: 180 }}
                >
                  {reelUrl ? (
                    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary/20 to-purple-900/30">
                      <div className="text-center text-white">
                        <div className="text-xs font-medium truncate px-4">{caption || "Your caption"}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-muted-foreground text-xs">
                      No reel selected
                    </div>
                  )}
                  <div className={`absolute top-2 left-2 text-[9px] px-1.5 py-0.5 rounded border font-semibold uppercase ${p.color}`}>
                    {p.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
