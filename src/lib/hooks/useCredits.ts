import { useQuery } from "@tanstack/react-query";
import { apiFetch, isDemoMode } from "@/lib/api";

export interface Credits {
  remaining_credits: number;
  total_credits: number;
  used_credits: number;
}

export function useCredits() {
  return useQuery<Credits>({
    queryKey: ["credits"],
    queryFn: () => apiFetch<Credits>("/credits/balance"),
    enabled: !isDemoMode(),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
