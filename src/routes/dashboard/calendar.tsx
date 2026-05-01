import { createFileRoute } from "@tanstack/react-router";
import { useCalendar } from "@/lib/hooks/useCalendar";
import { mockCalendarEvents, platformMeta } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/calendar")({
  component: CalendarView,
});

function CalendarView() {
  const { data: apiEvents } = useCalendar();
  const calendarEvents = apiEvents
    ? apiEvents.map((e) => ({ ...e, date: new Date(e.date) }))
    : mockCalendarEvents;

  const today = new Date();
  const first = new Date(today.getFullYear(), today.getMonth(), 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  const monthLabel = today.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="max-w-[1400px] mx-auto">
      <h2 className="text-lg font-semibold mb-4">{monthLabel}</h2>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="px-3 py-2 text-xs font-medium text-muted-foreground">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-fr">
          {cells.map((d, i) => (
            <div
              key={i}
              className={`min-h-[100px] border-r border-b border-border/60 p-2 ${!d ? "bg-background/40" : ""}`}
            >
              {d && (
                <div
                  className={`text-xs ${
                    d === today.getDate()
                      ? "h-5 w-5 rounded-full bg-primary text-white grid place-items-center font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {d}
                </div>
              )}
              {d &&
                calendarEvents
                  .filter((e) => e.date.getMonth() === today.getMonth() && e.date.getDate() === d)
                  .map((e) => (
                    <div
                      key={e.id}
                      className={`mt-1 text-[11px] px-1.5 py-0.5 rounded border truncate ${
                        platformMeta[e.platform as keyof typeof platformMeta]?.color ??
                        "bg-primary/20 text-primary border-primary/30"
                      }`}
                    >
                      {e.title}
                    </div>
                  ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
