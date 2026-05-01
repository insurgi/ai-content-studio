import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { mockScripts, platformMeta } from "@/lib/mock-data";
import { streamScriptAI } from "@/lib/hooks/useScriptStream";

export const Route = createFileRoute("/dashboard/scripts")({
  component: Scripts,
});

function Scripts() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Educational");
  const [duration, setDuration] = useState(30);
  const [platform, setPlatform] = useState("tiktok");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      let acc = "";
      for await (const c of streamScriptAI({ topic, tone, duration, platform })) {
        acc += c;
        setOutput(acc);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 h-fit">
        <div>
          <label className="text-xs text-muted-foreground">Topic</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Morning Productivity Hacks"
            className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
          >
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Tone</label>
          <div className="grid grid-cols-2 gap-1.5">
            {["Educational", "Entertaining", "Inspirational", "Professional"].map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`text-xs py-1.5 rounded-md border transition ${
                  tone === t
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground flex items-center justify-between mb-1.5">
            <span>Duration</span>
            <span className="text-foreground">{duration}s</span>
          </label>
          <div className="flex gap-1.5">
            {[15, 30, 60].map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`flex-1 text-xs py-1.5 rounded-md border transition ${
                  duration === d
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="w-full bg-gradient-primary text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-glow"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? "Generating..." : "Generate Script"}
        </button>
        <div className="pt-3 border-t border-border">
          <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Recent</div>
          <div className="space-y-1.5">
            {mockScripts.slice(0, 4).map((s) => (
              <div key={s.id} className="text-xs p-2 rounded-md border border-border bg-background">
                <div className="font-medium truncate">{s.title}</div>
                <div className="text-muted-foreground mt-0.5">
                  {platformMeta[s.platform].label} · {s.duration}s
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card flex flex-col min-h-[600px]">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium">AI Output</span>
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
                const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
                  p.startsWith("**") && p.endsWith("**")
                    ? <strong key={j} className="text-foreground font-semibold">{p.slice(2, -2)}</strong>
                    : <span key={j}>{p}</span>
                );
                return <p key={i}>{parts || <>&nbsp;</>}</p>;
              })}
            </div>
          ) : (
            <div className="h-full grid place-items-center text-center">
              <div>
                <div className="h-12 w-12 rounded-full bg-gradient-primary grid place-items-center mx-auto mb-3 shadow-glow">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm text-muted-foreground">Your AI script will stream here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
