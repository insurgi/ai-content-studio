import { createFileRoute, redirect } from "@tanstack/react-router";
import { getToken } from "@/lib/auth";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const authed = typeof window !== "undefined" && !!getToken();
    throw redirect({ to: authed ? "/login" : "/login" });
  },
});
