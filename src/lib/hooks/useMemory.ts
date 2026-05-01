import { useQuery, useMutation } from "@tanstack/react-query";
import { apiFetch, isDemoMode } from "@/lib/api";

export interface MemoryEntry {
  id: string;
  content: string;
  score?: number;
  tags?: string[];
}

/** Semantic recall of memories matching a query within a namespace */
export function useMemoryRecall(namespace: string, query: string) {
  return useQuery<MemoryEntry[]>({
    queryKey: ["memory", "recall", namespace, query],
    queryFn: () =>
      apiFetch<MemoryEntry[]>("/memory/v2/recall", {
        method: "POST",
        body: JSON.stringify({ namespace, query, top_k: 5 }),
      }),
    enabled: !isDemoMode() && !!namespace && !!query,
    staleTime: 60_000,
  });
}

/** Store a memory entry in a namespace */
export function useMemoryStore(namespace: string) {
  return useMutation({
    mutationFn: (content: string) =>
      apiFetch<{ id: string }>("/memory/v2/remember", {
        method: "POST",
        body: JSON.stringify({ namespace, content }),
      }),
  });
}
