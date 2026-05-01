import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Film, Type, Music, Users, Image as ImageIcon, Wand2, Layers, Scissors, Trash2,
  Upload, Plus, Play, Pause, SkipBack, SkipForward, ZoomIn, ZoomOut,
  Download, Maximize2, Volume2, Mic, CheckCircle2, AlertCircle, Loader2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useRenderJob } from "@/lib/hooks/useRenderJob";
import { useTask } from "@/lib/hooks/useTask";
import { useTTS } from "@/lib/hooks/useTTS";
import { useGenerateCaptions, useCaption } from "@/lib/hooks/useCaptions";

export const Route = createFileRoute("/dashboard/studio")({
  component: Studio,
});

type Clip = {
  id: string;
  track: "video" | "audio" | "text";
  start: number;
  duration: number;
  label: string;
  color: string;
};

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

const tracks: { id: Clip["track"]; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "video", label: "Video", icon: Film },
  { id: "text", label: "Text", icon: Type },
  { id: "audio", label: "Audio", icon: Music },
];

function RenderProgress({ jobId, onClose }: { jobId: string; onClose: () => void }) {
  const { data: task } = useTask<{ url?: string; download_url?: string }>(jobId);
  const progress = task?.progress ?? 0;
  const status = task?.status ?? "queued";
  const downloadUrl = task?.result?.url ?? task?.result?.download_url;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur px-6 py-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            {status === "done" ? (
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            ) : status === "error" ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
            {status === "done" ? "Render complete" : status === "error" ? "Render failed" : "Rendering reel…"}
          </div>
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">Dismiss</button>
        </div>
        <Progress value={progress} className="h-1.5" />
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>{progress}% complete</span>
          {downloadUrl && (
            <a
              href={downloadUrl}
              download
              className="flex items-center gap-1 text-primary font-medium hover:underline"
            >
              <Download className="h-3.5 w-3.5" /> Download MP4
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Studio() {
  const totalDuration = 18;
  const [clips, setClips] = useState<Clip[]>(initialClips);
  const [selected, setSelected] = useState<string | null>("c1");
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [zoom, setZoom] = useState(40);
  const [tab, setTab] = useState<"twins" | "broll" | "music" | "text">("twins");
  const [jobId, setJobId] = useState<string | null>(null);
  const [ttsText, setTtsText] = useState("Stop scrolling. Here are three productivity hacks.");
  const [captionId, setCaptionId] = useState<string | null>(null);

  const renderJob = useRenderJob();
  const tts = useTTS();
  const generateCaptions = useGenerateCaptions();
  const { data: captionResult } = useCaption(captionId);

  useEffect(() => {
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

  const updateClip = (id: string, patch: Partial<Clip>) =>
    setClips((cs) => cs.map((c) => c.id === id ? { ...c, ...patch } : c));
  const removeClip = (id: string) => {
    setClips((cs) => cs.filter((c) => c.id !== id));
    if (selected === id) setSelected(null);
  };

  const handleRender = async () => {
    try {
      const res = await renderJob.mutateAsync({
        twin_id: "t1",
        script: clips.filter((c) => c.track === "text").map((c) => c.label).join(" "),
        voice_id: "pro-female",
        caption_style: "overlay",
      });
      setJobId(res.job_id);
    } catch {
      // demo mode — show mock progress
      setJobId("demo-job");
    }
  };

  const handleGenerateVoiceover = async () => {
    try {
      const res = await tts.mutateAsync({ text: ttsText, voice_id: "pro-female" });
      if (res.audio_url) window.open(res.audio_url, "_blank");
    } catch { /* demo mode */ }
  };

  const handleAutoCaptions = async (enabled: boolean) => {
    if (!enabled || captionId) return;
    try {
      const res = await generateCaptions.mutateAsync({
        reelUrl: "https://example.com/demo-reel.mp4",
        language: "en",
      });
      setCaptionId(res.caption_id);
    } catch { /* demo mode */ }
  };

  return (
    <div className="-mx-4 md:-mx-6 -my-6 h-[calc(100vh-3.5rem)] flex flex-col bg-background">
      {/* Toolbar */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <input
            defaultValue="Untitled reel · Apr 30"
            className="bg-transparent text-sm font-medium focus:outline-none focus:bg-secondary/50 rounded px-2 py-1"
          />
          <span className="text-[11px] text-muted-foreground">9:16 · {totalDuration}s</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-8 px-3 text-xs rounded-lg border border-border hover:bg-secondary flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" /> Templates
          </button>
          <button className="h-8 px-3 text-xs rounded-lg border border-border hover:bg-secondary flex items-center gap-1.5">
            <Wand2 className="h-3.5 w-3.5" /> Auto-edit
          </button>
          <button
            onClick={handleRender}
            disabled={renderJob.isPending}
            className="h-8 px-3.5 text-xs rounded-lg bg-gradient-primary text-white font-medium hover:opacity-90 shadow-glow flex items-center gap-1.5 disabled:opacity-60"
          >
            {renderJob.isPending
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Download className="h-3.5 w-3.5" />
            }
            {renderJob.isPending ? "Submitting…" : "Render"}
          </button>
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
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex flex-col items-center gap-1 py-2.5 text-[10px] uppercase tracking-wide transition ${
                    active ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
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
                    <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded bg-black/40 backdrop-blur grid place-items-center opacity-0 group-hover:opacity-100">
                      <Plus className="h-3 w-3 text-white" />
                    </div>
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
                    <div className="h-8 w-8 rounded bg-gradient-to-br from-emerald-500 to-teal-500 grid place-items-center">
                      <Music className="h-3.5 w-3.5 text-white" />
                    </div>
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
            <button className="w-full flex items-center justify-center gap-2 text-xs py-2 rounded-lg border border-dashed border-border hover:border-primary/40 text-muted-foreground hover:text-foreground">
              <Upload className="h-3.5 w-3.5" /> Upload media
            </button>
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
                  <div className="inline-block px-3 py-1.5 rounded-md bg-black/50 backdrop-blur text-white text-lg font-bold uppercase tracking-tight drop-shadow">
                    {activeText.label}
                  </div>
                </div>
              )}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] text-white/70 bg-black/40 backdrop-blur rounded px-2 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> 9:16 · 1080×1920
              </div>
              <button className="absolute top-3 right-3 h-7 w-7 rounded bg-black/40 backdrop-blur grid place-items-center text-white/80 hover:bg-black/60" aria-label="Fullscreen">
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="border-t border-border bg-card/40 px-4 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1">
              <button className="h-8 w-8 grid place-items-center rounded hover:bg-secondary" aria-label="Skip back">
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPlaying((p) => !p)}
                className="h-9 w-9 grid place-items-center rounded-full bg-gradient-primary text-white shadow-glow hover:opacity-90"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>
              <button className="h-8 w-8 grid place-items-center rounded hover:bg-secondary" aria-label="Skip forward">
                <SkipForward className="h-4 w-4" />
              </button>
            </div>
            <div className="text-xs tabular-nums text-muted-foreground">
              <span className="text-foreground">{time.toFixed(1)}s</span> / {totalDuration.toFixed(1)}s
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setZoom((z) => Math.max(20, z - 10))} className="h-8 w-8 grid place-items-center rounded hover:bg-secondary" aria-label="Zoom out">
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="text-[10px] text-muted-foreground tabular-nums w-8 text-center">{zoom}px</span>
              <button onClick={() => setZoom((z) => Math.min(80, z + 10))} className="h-8 w-8 grid place-items-center rounded hover:bg-secondary" aria-label="Zoom in">
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="border-t border-border bg-card/20 h-[220px] flex flex-col shrink-0">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/60">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Timeline</div>
              <div className="flex items-center gap-1">
                <button className="h-6 px-2 text-[10px] rounded hover:bg-secondary flex items-center gap-1">
                  <Scissors className="h-3 w-3" /> Split
                </button>
                {selected && (
                  <button onClick={() => removeClip(selected)} className="h-6 px-2 text-[10px] rounded hover:bg-destructive/20 hover:text-destructive flex items-center gap-1">
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
              <div className="relative" style={{ width: totalDuration * zoom + 80 }}>
                <div className="h-5 border-b border-border/60 flex items-end pl-[80px] sticky top-0 bg-card/40">
                  {Array.from({ length: totalDuration + 1 }).map((_, i) => (
                    <div key={i} className="relative" style={{ width: zoom }}>
                      <div className="absolute bottom-0 left-0 h-1.5 w-px bg-border" />
                      <div className="absolute bottom-0 left-0 text-[9px] text-muted-foreground tabular-nums -translate-x-1/2">{i}s</div>
                    </div>
                  ))}
                </div>
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
                              className={`absolute top-1.5 bottom-1.5 rounded-md bg-gradient-to-r ${c.color} text-left px-2 overflow-hidden border-2 transition-all ${
                                active ? "border-white shadow-glow z-10" : "border-transparent hover:border-white/40"
                              }`}
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
                  <NumField label="Start (s)" value={sel.start} onChange={(v) => updateClip(sel.id, { start: v })} />
                  <NumField label="Duration (s)" value={sel.duration} onChange={(v) => updateClip(sel.id, { duration: Math.max(0.5, v) })} />
                </div>
                <Slider label="Opacity" left="0" right="100" value={100} onChange={() => {}} />
                <Slider label="Volume" left="0" right="100" value={sel.track === "audio" ? 80 : 100} onChange={() => {}} />

                {/* TTS Voiceover — shown for audio clips */}
                {sel.track === "audio" && (
                  <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-2">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Generate Voiceover</div>
                    <textarea
                      value={ttsText}
                      onChange={(e) => setTtsText(e.target.value)}
                      rows={3}
                      className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <button
                      onClick={handleGenerateVoiceover}
                      disabled={tts.isPending}
                      className="w-full flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-md bg-primary text-white hover:opacity-90 disabled:opacity-60"
                    >
                      {tts.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Mic className="h-3 w-3" />}
                      {tts.isPending ? "Generating…" : "Generate"}
                    </button>
                    {tts.isSuccess && (
                      <p className="text-[10px] text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Audio ready
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Transition in</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["None", "Fade", "Slide", "Zoom", "Wipe", "Glitch"].map((t, i) => (
                      <button key={t} className={`text-[11px] py-1.5 rounded border transition ${i === 1 ? "border-primary bg-primary/10" : "border-border hover:border-primary/40 text-muted-foreground"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Effects</div>
                  <div className="space-y-1.5">
                    {["Auto-captions", "Shake on beat", "Background blur"].map((effect, i) => (
                      <label key={effect} className="flex items-center justify-between text-xs p-2 rounded-md bg-secondary/40 border border-border">
                        <span>{effect}</span>
                        <input
                          type="checkbox"
                          defaultChecked={i === 0}
                          className="accent-primary h-3.5 w-3.5"
                          onChange={i === 0 ? (e) => handleAutoCaptions(e.target.checked) : undefined}
                        />
                      </label>
                    ))}
                  </div>
                  {captionId && captionResult && (
                    <div className="mt-2 text-[10px] text-muted-foreground rounded-md bg-secondary/40 p-2">
                      {captionResult.status === "done" ? (
                        <span className="text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Captions ready · {captionResult.segments?.length ?? 0} segments
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" /> Generating captions…
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-xs text-muted-foreground text-center py-10">
                Select a clip in the timeline to edit its properties.
              </div>
            )}
          </div>
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Volume2 className="h-3.5 w-3.5" /> Master volume
            </div>
            <input type="range" defaultValue={85} className="w-full mt-1.5 accent-primary" />
          </div>
        </div>
      </div>

      {jobId && <RenderProgress jobId={jobId} onClose={() => setJobId(null)} />}
    </div>
  );
}

function Slider({ label, left, right, value, onChange }: {
  label: string; left: string; right: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground tabular-nums">{value}</span>
      </div>
      <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full mt-2 accent-primary" />
      <div className="flex justify-between text-[11px] text-muted-foreground -mt-1">
        <span>{left}</span><span>{right}</span>
      </div>
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</label>
      <input type="number" step={0.1} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/40" />
    </div>
  );
}
