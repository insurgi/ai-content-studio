import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

type TTSRequest = {
  text: string;
  voice_id: string;
  twin_id?: string;
};

type TTSResponse = {
  audio_url: string;
  duration_ms: number;
};

/** POST /multimodal/tts — generate a voiceover audio clip from text */
export function useTTS() {
  return useMutation({
    mutationFn: (body: TTSRequest) =>
      apiFetch<TTSResponse>("/multimodal/tts", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  });
}
