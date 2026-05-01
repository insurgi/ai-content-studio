import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, isDemoMode } from "@/lib/api";

export type Platform = "instagram" | "tiktok" | "linkedin" | "youtube";
export type EventStatus = "scheduled" | "draft" | "published";

export interface CalendarEvent {
  id: string;
  title: string;
  /** ISO 8601 date string */
  date: string;
  platform: Platform;
  status: EventStatus;
  script_id?: string;
  twin_id?: string;
}

export function useCalendar() {
  return useQuery<CalendarEvent[]>({
    queryKey: ["calendar"],
    queryFn: () => apiFetch<CalendarEvent[]>("/content/calendar"),
    enabled: !isDemoMode(),
    staleTime: 60_000,
  });
}

export function useCreateCalendarEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<CalendarEvent, "id">) =>
      apiFetch<CalendarEvent>("/content/calendar", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["calendar"] }),
  });
}

export function useUpdateCalendarEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<CalendarEvent> & { id: string }) =>
      apiFetch<CalendarEvent>(`/content/calendar/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["calendar"] }),
  });
}

export function useDeleteCalendarEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/content/calendar/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["calendar"] }),
  });
}
