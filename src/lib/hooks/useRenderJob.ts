import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

type RenderJobRequest = {
  twin_id: string;
  script: string;
  voice_id: string;
  caption_style?: "burned-in" | "overlay";
};

type RenderJobResponse = {
  job_id: string;
};

/**
 * POST /multimodal/avatar/generate — submit a full reel render job.
 * Poll the returned job_id with useTask() to track progress.
 */
export function useRenderJob() {
  return useMutation({
    mutationFn: (body: RenderJobRequest) =>
      apiFetch<RenderJobResponse>("/multimodal/avatar/generate", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  });
}
