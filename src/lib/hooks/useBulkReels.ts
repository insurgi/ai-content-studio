import { useQuery, useMutation } from "@tanstack/react-query";
import { apiFetch, getApiKey, isDemoMode } from "@/lib/api";

const BASE = import.meta.env.VITE_AINATIVE_API_URL ?? "https://api.ainative.studio/api/v1/public";

export interface BulkReelItem {
  row: number;
  status: "queued" | "processing" | "done" | "error";
  result_url?: string;
  error?: string;
}

export interface BatchStatus {
  task_id: string;
  batch_id: string;
  status: "queued" | "processing" | "done" | "error";
  progress: number;
  total_rows: number;
  items: BulkReelItem[];
}

export interface SubmitBatchResponse {
  task_id: string;
  batch_id: string;
  status: string;
  progress: number;
  total_rows: number;
}

/**
 * POST /bulk/reels — submit a CSV batch for parallel reel generation.
 * CSV must have columns: script, platform, voice_id.
 * Max 100 rows per batch.
 */
export function useSubmitBulkBatch() {
  return useMutation<SubmitBatchResponse, Error, { csvFile: File; twinId: string; platform: string }>({
    mutationFn: async ({ csvFile, twinId, platform }) => {
      const form = new FormData();
      form.append("csv_file", csvFile);
      form.append("twin_id", twinId);
      form.append("platform", platform);

      const res = await fetch(`${BASE}/bulk/reels`, {
        method: "POST",
        headers: { "X-API-Key": getApiKey() },
        body: form,
      });
      if (!res.ok) throw new Error(`Bulk submit error ${res.status}`);
      return res.json() as Promise<SubmitBatchResponse>;
    },
  });
}

/** GET /bulk/reels/{batch_id} — poll per-item progress for a batch job */
export function useBatchStatus(batchId: string | null) {
  return useQuery<BatchStatus>({
    queryKey: ["batch", batchId],
    queryFn: () => apiFetch<BatchStatus>(`/bulk/reels/${batchId}`),
    enabled: !isDemoMode() && !!batchId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "done" || status === "error" ? false : 5000;
    },
  });
}
