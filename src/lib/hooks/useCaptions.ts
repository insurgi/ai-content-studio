import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, getApiKey } from "@/lib/api";

const BASE = import.meta.env.VITE_AINATIVE_API_URL ?? "https://api.ainative.studio/api/v1/public";

export interface CaptionSegment {
  start: number;
  end: number;
  text: string;
}

export interface CaptionResult {
  id: string;
  status: "queued" | "processing" | "done" | "error";
  srt?: string;
  vtt?: string;
  segments?: CaptionSegment[];
}

export interface GenerateCaptionsResponse {
  caption_id: string;
  task_id: string;
  status: string;
}

export interface BurnInRequest {
  font_size?: number;
  font_color?: string;
  position?: "top" | "center" | "bottom";
}

export interface BurnInResponse {
  task_id: string;
  status: string;
}

/**
 * POST /captions/generate — generate captions from a reel URL or audio file via Whisper.
 * Returns a caption_id to poll with useCaption().
 */
export function useGenerateCaptions() {
  return useMutation<GenerateCaptionsResponse, Error, { reelUrl?: string; audioFile?: File; language?: string; burnIn?: boolean }>({
    mutationFn: async ({ reelUrl, audioFile, language = "en", burnIn }) => {
      const form = new FormData();
      if (reelUrl) form.append("reel_url", reelUrl);
      if (audioFile) form.append("audio_file", audioFile);
      form.append("language", language);
      if (burnIn !== undefined) form.append("burn_in", String(burnIn));

      const res = await fetch(`${BASE}/captions/generate`, {
        method: "POST",
        headers: { "X-API-Key": getApiKey() },
        body: form,
      });
      if (!res.ok) throw new Error(`Captions error ${res.status}`);
      return res.json() as Promise<GenerateCaptionsResponse>;
    },
  });
}

/** GET /captions/{caption_id} — poll caption result (SRT, VTT, segments) */
export function useCaption(captionId: string | null) {
  return useQuery<CaptionResult>({
    queryKey: ["caption", captionId],
    queryFn: () => apiFetch<CaptionResult>(`/captions/${captionId}`),
    enabled: !!captionId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "done" || status === "error" ? false : 2000;
    },
  });
}

/** POST /captions/{caption_id}/burn-in — render captions into the video. Poll task_id with useTask(). */
export function useBurnInCaptions() {
  return useMutation<BurnInResponse, Error, { captionId: string } & BurnInRequest>({
    mutationFn: ({ captionId, ...body }) =>
      apiFetch<BurnInResponse>(`/captions/${captionId}/burn-in`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
  });
}
