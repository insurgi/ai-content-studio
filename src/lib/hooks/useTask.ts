import { useQuery } from "@tanstack/react-query";
import { apiFetch, isDemoMode } from "@/lib/api";

export type TaskStatus = "queued" | "processing" | "done" | "error";

export interface TaskResult<T = unknown> {
  task_id: string;
  status: TaskStatus;
  /** 0-100 */
  progress: number;
  result?: T;
  error?: string;
}

export function useTask<T = unknown>(taskId: string | null) {
  return useQuery<TaskResult<T>>({
    queryKey: ["task", taskId],
    queryFn: () => apiFetch<TaskResult<T>>(`/tasks/${taskId}`),
    enabled: !isDemoMode() && !!taskId,
    refetchInterval: (query) => {
      const s = query.state.data?.status;
      return s === "done" || s === "error" ? false : 2000;
    },
  });
}
