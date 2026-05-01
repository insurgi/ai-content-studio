import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Upload, Download, Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useSubmitBulkBatch, useBatchStatus } from "@/lib/hooks/useBulkReels";

export const Route = createFileRoute("/dashboard/bulk")({
  component: BulkReelBuilder,
});

interface CsvRow {
  script: string;
  platform: string;
  voice_id: string;
}

function parseCsv(text: string): CsvRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const vals = line.split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = vals[i] ?? ""; });
    return {
      script: row.script ?? "",
      platform: row.platform ?? "tiktok",
      voice_id: row.voice_id ?? "pro-female",
    };
  }).filter((r) => r.script);
}

function BulkReelBuilder() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [twinId, setTwinId] = useState("t1");
  const [platform, setPlatform] = useState("tiktok");

  const submitBatch = useSubmitBulkBatch();
  const { data: batchStatus } = useBatchStatus(batchId);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setRows(parseCsv(text));
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith(".csv")) handleFile(file);
  };

  const handleSubmit = async () => {
    if (rows.length === 0) return;
    const csvContent = ["script,platform,voice_id", ...rows.map((r) => `${r.script},${r.platform},${r.voice_id}`)].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const file = new File([blob], "batch.csv");
    try {
      const res = await submitBatch.mutateAsync({ csvFile: file, twinId, platform });
      setBatchId(res.batch_id);
    } catch { /* demo */ }
  };

  const progress = batchStatus?.progress ?? 0;
  const totalRows = batchStatus?.total_rows ?? rows.length;
  const statusDone = batchStatus?.status === "done";

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Bulk Reel Builder</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Upload a CSV with up to 100 rows to generate reels in parallel.</p>
      </div>

      {/* Upload area */}
      <div
        className="rounded-2xl border-2 border-dashed border-border bg-card p-10 text-center hover:border-primary/40 transition cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
        <div className="text-sm font-medium">Drop a CSV file here or click to browse</div>
        <div className="text-xs text-muted-foreground mt-1">Required columns: <code className="bg-secondary px-1 rounded">script</code>, <code className="bg-secondary px-1 rounded">platform</code>, <code className="bg-secondary px-1 rounded">voice_id</code></div>
      </div>

      {/* CSV preview */}
      {rows.length > 0 && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="text-sm font-semibold">{rows.length} rows ready</div>
            <div className="flex items-center gap-3">
              <div>
                <select value={twinId} onChange={(e) => setTwinId(e.target.value)} className="text-xs bg-background border border-border rounded-md px-2 py-1">
                  <option value="t1">Professional Sarah</option>
                  <option value="t2">Energetic Alex</option>
                </select>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitBatch.isPending || !!batchId}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gradient-primary text-white font-medium hover:opacity-90 disabled:opacity-60 shadow-glow"
              >
                {submitBatch.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                {submitBatch.isPending ? "Submitting…" : "Submit Batch"}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-4 py-2 text-muted-foreground font-medium">#</th>
                  <th className="text-left px-4 py-2 text-muted-foreground font-medium">Script</th>
                  <th className="text-left px-4 py-2 text-muted-foreground font-medium">Platform</th>
                  <th className="text-left px-4 py-2 text-muted-foreground font-medium">Voice</th>
                  {batchId && <th className="text-left px-4 py-2 text-muted-foreground font-medium">Status</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const itemStatus = batchStatus?.items?.find((it) => it.row === i + 1);
                  return (
                    <tr key={i} className="border-b border-border/60 hover:bg-secondary/20">
                      <td className="px-4 py-2 text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-2 max-w-xs truncate">{row.script}</td>
                      <td className="px-4 py-2 capitalize">{row.platform}</td>
                      <td className="px-4 py-2">{row.voice_id}</td>
                      {batchId && (
                        <td className="px-4 py-2">
                          <StatusBadge status={itemStatus?.status ?? "queued"} url={itemStatus?.result_url} />
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Batch progress */}
      {batchId && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Batch progress</div>
            <div className="text-xs text-muted-foreground">{progress}% · {totalRows} reels</div>
          </div>
          <Progress value={progress} className="h-2" />
          {statusDone && (
            <div className="flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5 text-xs text-green-400">
                <CheckCircle2 className="h-4 w-4" /> All reels complete
              </span>
              <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-secondary">
                <Download className="h-3.5 w-3.5" /> Download ZIP
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sample CSV */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Sample CSV format</div>
        <pre className="text-xs bg-secondary/40 rounded-lg p-3 overflow-x-auto">{`script,platform,voice_id
"Stop scrolling. 3 productivity hacks.",tiktok,pro-female
"AI tools that save 2 hours daily",instagram,casual-male
"Why most creators fail (and how to fix it)",linkedin,pro-female`}</pre>
      </div>
    </div>
  );
}

function StatusBadge({ status, url }: { status: string; url?: string }) {
  if (status === "done" && url) {
    return (
      <a href={url} download className="flex items-center gap-1 text-green-400 hover:underline">
        <CheckCircle2 className="h-3 w-3" /> Download
      </a>
    );
  }
  if (status === "error") return <span className="flex items-center gap-1 text-destructive"><AlertCircle className="h-3 w-3" /> Error</span>;
  if (status === "processing") return <span className="flex items-center gap-1 text-primary"><Loader2 className="h-3 w-3 animate-spin" /> Rendering</span>;
  return <span className="flex items-center gap-1 text-muted-foreground"><RefreshCw className="h-3 w-3" /> Queued</span>;
}
