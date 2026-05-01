import { isDemoMode, streamChatCompletion } from "@/lib/api";
import { streamScript } from "@/lib/mock-data";

interface ScriptParams {
  topic: string;
  tone: string;
  duration: number;
  platform: string;
}

/**
 * Streams a script from the AINative chat API.
 * Falls back to the local mock generator when no API key is configured.
 */
export async function* streamScriptAI({
  topic,
  tone,
  duration,
  platform,
}: ScriptParams): AsyncGenerator<string> {
  if (isDemoMode()) {
    yield* streamScript(topic, tone, duration, platform);
    return;
  }

  const systemPrompt = [
    `You are an expert short-form content scriptwriter specialising in viral educational reels.`,
    `Write a ${duration}s script on "${topic}" in a ${tone} tone, optimised for ${platform}.`,
    `Format: **Hook:** (first 3 words grab attention), **The Problem:**, **The Shift:**, **3 Steps:**, **CTA:**.`,
    `Be punchy. No filler. Hook must open mid-action.`,
  ].join(" ");

  yield* streamChatCompletion(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: topic },
    ],
    "claude-sonnet-4-6"
  );
}

/** TTS: converts text to a signed audio URL */
export async function synthesiseSpeech(
  text: string,
  voiceId: string
): Promise<string> {
  const { apiFetch } = await import("@/lib/api");
  const { url } = await apiFetch<{ url: string }>("/multimodal/tts", {
    method: "POST",
    body: JSON.stringify({ text, voice_id: voiceId }),
  });
  return url;
}

/** Avatar render: returns a task_id to poll with useTask() */
export async function startAvatarRender(params: {
  twin_id: string;
  script: string;
  voice_id: string;
}): Promise<string> {
  const { apiFetch } = await import("@/lib/api");
  const { task_id } = await apiFetch<{ task_id: string }>(
    "/multimodal/avatar/generate",
    {
      method: "POST",
      body: JSON.stringify(params),
    }
  );
  return task_id;
}

/** Caption generation via Whisper: returns a task_id */
export async function generateCaptions(audioUrl: string): Promise<string> {
  const { apiFetch } = await import("@/lib/api");
  const { task_id } = await apiFetch<{ task_id: string }>(
    "/captions/generate",
    {
      method: "POST",
      body: JSON.stringify({ audio_url: audioUrl }),
    }
  );
  return task_id;
}

/** Bulk import: uploads scripts CSV, returns a job task_id */
export async function bulkImportScripts(csvContent: string): Promise<string> {
  const { apiFetch } = await import("@/lib/api");
  const { task_id } = await apiFetch<{ task_id: string }>(
    "/bulk/import-scripts",
    {
      method: "POST",
      body: JSON.stringify({ csv: csvContent }),
    }
  );
  return task_id;
}
