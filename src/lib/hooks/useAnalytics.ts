import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, isDemoMode } from "@/lib/api";

export type Platform = "instagram" | "tiktok" | "linkedin" | "youtube";

export interface AnalyticsDayPoint {
  platform: Platform;
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  followers_gained: number;
}

export interface AnalyticsSummary {
  views: number;
  likes: number;
  shares: number;
  engagement_rate: number;
  completion_rate: number;
  trend: AnalyticsDayPoint[];
  top_videos: TopVideo[];
  platform_breakdown: Array<{ platform: Platform; views: number }>;
}

export interface AnalyticsSummaryRollup {
  total_views: number;
  total_likes: number;
  total_shares: number;
  total_followers_gained: number;
  engagement_rate: number;
  delta_views: number;
  delta_likes: number;
  delta_shares: number;
}

export interface TopVideo {
  title: string;
  platform: Platform;
  views: number;
  likes: number;
  eng: number;
  twin: string;
}

type Range = "7d" | "30d" | "90d";

/** GET /analytics/social — daily breakdown across all connected platforms */
export function useAnalytics(range: Range = "30d", platform?: Platform, twinId?: string) {
  const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
  const params = new URLSearchParams({ days: String(days) });
  if (platform) params.set("platform", platform);
  if (twinId) params.set("twin_id", twinId);

  return useQuery<AnalyticsSummary>({
    queryKey: ["analytics", range, platform, twinId],
    queryFn: () => apiFetch<AnalyticsSummary>(`/analytics/social?${params}`),
    enabled: !isDemoMode(),
    staleTime: 5 * 60_000,
  });
}

/** GET /analytics/social/summary — aggregated totals and deltas across all platforms */
export function useAnalyticsSummary(range: Range = "30d") {
  const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
  return useQuery<AnalyticsSummaryRollup>({
    queryKey: ["analytics-summary", range],
    queryFn: () => apiFetch<AnalyticsSummaryRollup>(`/analytics/social/summary?days=${days}`),
    enabled: !isDemoMode(),
    staleTime: 5 * 60_000,
  });
}

export interface ExportRequest {
  format: "csv";
  days: number;
  platform?: Platform;
}

export interface ExportJobResponse {
  task_id: string;
}

/**
 * POST /analytics/social/export — kick off a CSV export job.
 * Poll the returned task_id with useTask(); result.download_url is a signed S3 URL (1hr TTL).
 */
export function useExportAnalytics() {
  return useMutation<ExportJobResponse, Error, ExportRequest>({
    mutationFn: (payload) =>
      apiFetch<ExportJobResponse>("/analytics/social/export", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
}
