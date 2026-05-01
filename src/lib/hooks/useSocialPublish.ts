import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, apiBase, isDemoMode } from "@/lib/api";

export type Platform = "instagram" | "tiktok" | "linkedin" | "youtube";

export interface ConnectedAccount {
  id: string;
  platform: Platform;
  handle: string;
  connected_at: string;
}

export interface PublishRequest {
  platforms: Platform[];
  reel_url: string;
  caption: string;
  twin_id: string;
}

export interface PublishResult {
  results: Array<{ platform: Platform; task_id: string; status: string }>;
}

/** GET /social/accounts — list all OAuth-connected social accounts */
export function useConnectedAccounts() {
  return useQuery<ConnectedAccount[]>({
    queryKey: ["social-accounts"],
    queryFn: () => apiFetch<ConnectedAccount[]>("/social/accounts"),
    enabled: !isDemoMode(),
    staleTime: 60_000,
  });
}

/** POST /social/publish — publish a reel to one or more platforms */
export function useSocialPublish() {
  return useMutation<PublishResult, Error, PublishRequest>({
    mutationFn: (payload) =>
      apiFetch<PublishResult>("/social/publish", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
}

/**
 * GET /social/connect/{platform}?redirect_uri=... — start OAuth flow.
 * Navigates the browser to the platform's OAuth consent screen.
 * The api_key is sent via the X-API-Key header on the redirect, not as a query param.
 */
export function connectPlatform(platform: Platform, redirectUri?: string): void {
  const params = new URLSearchParams();
  if (redirectUri) params.set("redirect_uri", redirectUri);
  window.location.href = `${apiBase()}/social/connect/${platform}?${params.toString()}`;
}

/** DELETE /social/disconnect/{platform} — revoke OAuth tokens for a platform */
export function useDisconnectPlatform() {
  return useMutation<void, Error, Platform>({
    mutationFn: (platform) =>
      apiFetch<void>(`/social/disconnect/${platform}`, { method: "DELETE" }),
  });
}
