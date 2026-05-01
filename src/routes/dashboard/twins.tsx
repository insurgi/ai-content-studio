import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Play, Trash2, X, Wand2, Sparkles, Upload, Mic, Check } from "lucide-react";
import { useTwins, useCreateTwin, useDeleteTwin } from "@/lib/hooks/useTwins";
import { useRenderJob } from "@/lib/hooks/useRenderJob";
import { apiFetch } from "@/lib/api";
import { mockTwins } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/twins")({
  component: Twins,
});

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
  const { data: apiTwins } = useTwins();
  const deleteTwinMutation = useDeleteTwin();
  const [localTwins, setLocalTwins] = useState(mockTwins);
  const twins = apiTwins ?? localTwins;
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const remove = (id: string) => {
    if (apiTwins) {
      deleteTwinMutation.mutate(id);
    } else {
      setLocalTwins((ts) => ts.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold">AI Twins</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {twins.length} personas · Create custom AI presenters for your videos
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 bg-gradient-primary text-white rounded-lg px-3.5 py-2 text-sm font-medium hover:opacity-90 shadow-glow"
        >
          <Plus className="h-4 w-4" /> New Twin
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {twins.map((t) => (
          <div key={t.id} className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-all">
            <div className={`h-32 bg-gradient-to-br ${t.color} relative`}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => remove(t.id)}
                  className="h-7 w-7 rounded-lg bg-black/40 backdrop-blur grid place-items-center hover:bg-destructive/80"
                  aria-label="Delete twin"
                >
                  <Trash2 className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
              <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur grid place-items-center text-white font-semibold text-lg border-2 border-white/30">
                  {t.name.charAt(0)}
                </div>
                <button className="h-8 w-8 rounded-full bg-white/90 grid place-items-center hover:bg-white" aria-label="Preview twin">
                  <Play className="h-3.5 w-3.5 text-black ml-0.5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold truncate">{t.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {t.style}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{t.voice}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.videos} videos</span>
                <button onClick={() => setSelected(t.id)} className="text-primary hover:underline">Edit</button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => setCreating(true)}
          className="rounded-2xl border-2 border-dashed border-border hover:border-primary/40 bg-card/40 hover:bg-card transition-all min-h-[260px] grid place-items-center group"
        >
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 grid place-items-center mx-auto mb-2 group-hover:bg-primary/20 transition">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm font-medium">Create new twin</div>
            <div className="text-xs text-muted-foreground mt-0.5">Upload, record, or pick a preset</div>
          </div>
        </button>
      </div>

      {creating && (
        <TwinCreator
          onClose={() => setCreating(false)}
          onCreate={(t) => { if (!apiTwins) setLocalTwins((arr) => [t, ...arr]); setCreating(false); }}
        />
      )}
      {selected && (
        <TwinCreator
          existing={twins.find((t) => t.id === selected) as (typeof mockTwins)[number] | undefined}
          onClose={() => setSelected(null)}
          onCreate={(t) => { if (!apiTwins) setLocalTwins((arr) => arr.map((x) => x.id === t.id ? t : x)); setSelected(null); }}
        />
      )}
    </div>
  );
}

function TwinCreator({
  onClose,
  onCreate,
  existing,
}: {
  onClose: () => void;
  onCreate: (t: (typeof mockTwins)[number]) => void;
  existing?: (typeof mockTwins)[number];
}) {
  const createTwinMutation = useCreateTwin();
  const renderJobMutation = useRenderJob();
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
  const canNext =
    step === 1 ? !!draft.source :
    step === 2 ? !!(draft.style && draft.voice) :
    step === 3 ? draft.name.trim().length > 0 : true;

  const finalize = async () => {
    setTraining(true);
    const twinId = existing?.id ?? `t${Date.now()}`;
    const localTwin = {
      id: twinId,
      name: draft.name,
      style: draft.style,
      voice: draft.voice,
      videos: existing?.videos ?? 0,
      color: styleObj.grad,
    };

    // Fire real API calls concurrently; fall back silently in demo mode
    const apiCalls = Promise.allSettled([
      createTwinMutation.mutateAsync({
        name: draft.name,
        style: draft.style,
        voice_id: draft.voice.toLowerCase().replace(" ", "-"),
        style_tags: [draft.style, draft.niche].filter(Boolean),
        persona_prompt: draft.catchphrase || undefined,
      }),
      renderJobMutation.mutateAsync({
        twin_id: twinId,
        script: draft.catchphrase || `I'm ${draft.name}. ${draft.style} style creator.`,
        voice_id: draft.voice.toLowerCase().replace(" ", "-"),
      }),
      apiFetch("/agents", {
        method: "POST",
        body: JSON.stringify({
          name: draft.name,
          twin_id: twinId,
          persona_prompt: draft.catchphrase || `${draft.style} creator`,
        }),
      }),
    ]);

    // Animate progress while APIs run
    for (let p = 0; p <= 90; p += 3) {
      await new Promise((r) => setTimeout(r, 55));
      setProgress(p);
    }
    await apiCalls;
    setProgress(100);
    await new Promise((r) => setTimeout(r, 200));
    onCreate(localTwin);
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-3xl rounded-2xl border border-border bg-card shadow-glow my-8">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center">
              <Wand2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold">{existing ? "Edit Twin" : "Create AI Twin"}</div>
              <div className="text-[11px] text-muted-foreground">Step {step} of 4</div>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-secondary grid place-items-center" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
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
                <div className="h-16 w-16 rounded-full bg-gradient-primary grid place-items-center mx-auto mb-4 shadow-glow animate-pulse">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
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
                    <button
                      key={s.id}
                      onClick={() => setDraft({ ...draft, source: s.id })}
                      className={`text-left rounded-xl border p-4 transition-all ${active ? "border-primary bg-primary/5 shadow-glow" : "border-border hover:border-primary/40"}`}
                    >
                      <div className={`h-10 w-10 rounded-lg grid place-items-center mb-3 ${active ? "bg-gradient-primary" : "bg-secondary"}`}>
                        <Icon className={`h-5 w-5 ${active ? "text-white" : "text-muted-foreground"}`} />
                      </div>
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
                  <div className="h-14 w-14 rounded-full bg-destructive/20 grid place-items-center mx-auto">
                    <Mic className="h-6 w-6 text-destructive" />
                  </div>
                  <div className="text-sm font-medium mt-3">Ready to record</div>
                  <div className="text-xs text-muted-foreground mt-1">Read the on-screen prompt for ~60 seconds</div>
                </div>
              )}
              {draft.source === "preset" && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {["Sarah", "Alex", "Maya", "Kai", "Lin", "Jay"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setDraft({ ...draft, preset: p, name: draft.name || p })}
                      className={`aspect-square rounded-xl border-2 grid place-items-center font-semibold transition ${
                        draft.preset === p ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                      }`}
                    >
                      {p[0]}
                    </button>
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
                      <button
                        key={s.id}
                        onClick={() => setDraft({ ...draft, style: s.id })}
                        className={`relative rounded-xl border overflow-hidden text-left transition-all ${active ? "border-primary shadow-glow" : "border-border hover:border-primary/40"}`}
                      >
                        <div className={`h-12 bg-gradient-to-r ${s.grad}`} />
                        <div className="p-2.5">
                          <div className="text-sm font-medium flex items-center gap-1.5">
                            {s.id}{active && <Check className="h-3.5 w-3.5 text-primary" />}
                          </div>
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
                      <button
                        key={v.id}
                        onClick={() => setDraft({ ...draft, voice: v.id })}
                        className={`rounded-lg border p-2.5 text-left transition-all ${active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                      >
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
                  <select
                    value={draft.accent}
                    onChange={(e) => setDraft({ ...draft, accent: e.target.value })}
                    className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                  >
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
                  <input
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder="Professional Sarah"
                    className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Niche / topic</label>
                  <input
                    value={draft.niche}
                    onChange={(e) => setDraft({ ...draft, niche: e.target.value })}
                    placeholder="Productivity, AI, Marketing"
                    className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground">Signature phrase (optional)</label>
                  <input
                    value={draft.catchphrase}
                    onChange={(e) => setDraft({ ...draft, catchphrase: e.target.value })}
                    placeholder="Let's get into it."
                    className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
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
            <button
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
              className="text-sm px-3 py-2 rounded-lg border border-border hover:bg-secondary"
            >
              {step > 1 ? "Back" : "Cancel"}
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canNext}
                className="text-sm px-4 py-2 rounded-lg bg-gradient-primary text-white font-medium hover:opacity-90 disabled:opacity-40 shadow-glow"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={finalize}
                className="text-sm px-4 py-2 rounded-lg bg-gradient-primary text-white font-medium hover:opacity-90 shadow-glow flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {existing ? "Save changes" : "Train Twin"}
              </button>
            )}
          </div>
        )}
      </div>
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
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-2 accent-primary"
      />
      <div className="flex justify-between text-[11px] text-muted-foreground -mt-1">
        <span>{left}</span><span>{right}</span>
      </div>
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
