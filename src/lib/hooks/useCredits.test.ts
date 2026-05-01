import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { useCredits } from "./useCredits";

// VITE_AINATIVE_API_KEY is set in vitest.config.ts env, so isDemoMode() returns false

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return createElement(QueryClientProvider, { client: qc }, children);
}

describe("useCredits", () => {
  it("returns remaining_credits from the API", async () => {
    const { result } = renderHook(() => useCredits(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.remaining_credits).toBe(8500);
    expect(result.current.data?.total_credits).toBe(10000);
  });

  it("starts in a loading state before the API responds", () => {
    const { result } = renderHook(() => useCredits(), { wrapper });
    expect(result.current.isLoading).toBe(true);
  });
});
