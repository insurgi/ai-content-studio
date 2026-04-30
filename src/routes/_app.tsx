import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { getToken } from "@/lib/auth";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getToken()) {
      throw redirect({ to: "/login" });
    }
  },
  component: AppShell,
});