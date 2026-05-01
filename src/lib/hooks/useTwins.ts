import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, isDemoMode } from "@/lib/api";

export interface Twin {
  id: string;
  name: string;
  avatar_url?: string;
  voice_id: string;
  style_tags: string[];
  persona_prompt?: string;
  platform_defaults?: Record<string, unknown>;
  memory_namespace?: string;
  style: string;
  voice: string;
  videos?: number;
  color?: string;
  created_at?: string;
}

export function useTwins() {
  return useQuery<Twin[]>({
    queryKey: ["twins"],
    queryFn: () => apiFetch<Twin[]>("/twins"),
    enabled: !isDemoMode(),
    staleTime: 60_000,
  });
}

export function useTwin(id: string) {
  return useQuery<Twin>({
    queryKey: ["twins", id],
    queryFn: () => apiFetch<Twin>(`/twins/${id}`),
    enabled: !isDemoMode() && !!id,
  });
}

export function useCreateTwin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Twin>) =>
      apiFetch<Twin>("/twins", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["twins"] }),
  });
}

export function useUpdateTwin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Twin> & { id: string }) =>
      apiFetch<Twin>(`/twins/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["twins"] }),
  });
}

export function useDeleteTwin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/twins/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["twins"] }),
  });
}
