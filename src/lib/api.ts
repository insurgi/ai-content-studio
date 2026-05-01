const BASE =
  import.meta.env.VITE_AINATIVE_API_URL ??
  "https://api.ainative.studio/api/v1/public";

export function getApiKey(): string {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("ainative_token") ||
    import.meta.env.VITE_AINATIVE_API_KEY ||
    ""
  );
}

/** True when no API key is configured — app runs in demo/mock mode */
export function isDemoMode(): boolean {
  return !getApiKey() || getApiKey().startsWith("mock-jwt-");
}

export function apiBase(): string {
  return BASE;
}

export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "X-API-Key": getApiKey(),
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Async generator that streams an OpenAI-compatible SSE chat completion.
 * Yields token strings as they arrive.
 * Endpoint: POST /chat/completions with { model, messages, stream: true }
 */
export async function* streamChatCompletion(
  messages: Array<{ role: string; content: string }>,
  model = "claude-sonnet-4-6"
): AsyncGenerator<string> {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "X-API-Key": getApiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages, stream: true }),
  });

  if (!res.ok) throw new Error(`Chat API error ${res.status}`);
  if (!res.body) throw new Error("No response body for streaming");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
        // skip malformed chunks
      }
    }
  }
}
