import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCalendar, useCreateCalendarEvent, useUpdateCalendarEvent } from "@/lib/hooks/useCalendar";
import type { CalendarEvent } from "@/lib/hooks/useCalendar";
import { mockCalendarEvents, platformMeta } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/calendar")({
  component: CalendarView,
});

type ViewMode = "month" | "week" | "day";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const PLATFORMS = ["tiktok", "instagram", "youtube", "linkedin"] as const;

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function CalendarView() {
  const { data: apiEvents } = useCalendar();
  const createEvent = useCreateCalendarEvent();
  const updateEvent = useUpdateCalendarEvent();

  const events = apiEvents
    ? apiEvents.map((e) => ({ ...e, date: new Date(e.date) }))
    : mockCalendarEvents;

  const today = new Date();
  const [view, setView] = useState<ViewMode>("month");
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerDate, setDrawerDate] = useState<string>(today.toISOString().slice(0, 10));
  const [form, setForm] = useState({ title: "", platform: "tiktok" as typeof PLATFORMS[number], status: "scheduled" as CalendarEvent["status"] });

  const openDrawer = (dateStr?: string) => {
    setDrawerDate(dateStr ?? today.toISOString().slice(0, 10));
    setForm({ title: "", platform: "tiktok", status: "scheduled" });
    setDrawerOpen(true);
  };

  const saveEvent = async () => {
    if (!form.title.trim()) return;
    try {
      await createEvent.mutateAsync({
        title: form.title,
        date: new Date(drawerDate).toISOString(),
        platform: form.platform,
        status: form.status,
      });
    } catch { /* demo: event added locally via mock */ }
    setDrawerOpen(false);
  };

  const label = view === "month"
    ? cursor.toLocaleString("en-US", { month: "long", year: "numeric" })
    : view === "week"
    ? `Week of ${startOfWeek(cursor).toLocaleString("en-US", { month: "short", day: "numeric" })}`
    : cursor.toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const navigate = (dir: 1 | -1) => {
    const d = new Date(cursor);
    if (view === "month") d.setMonth(d.getMonth() + dir);
    else if (view === "week") d.setDate(d.getDate() + dir * 7);
    else d.setDate(d.getDate() + dir);
    setCursor(d);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="h-8 w-8 grid place-items-center rounded-lg border border-border hover:bg-card" aria-label="Previous">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="text-sm font-semibold min-w-[200px] text-center">{label}</h2>
          <button onClick={() => navigate(1)} className="h-8 w-8 grid place-items-center rounded-lg border border-border hover:bg-card" aria-label="Next">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))} className="text-xs px-2.5 py-1 rounded-md border border-border hover:bg-card ml-1">
            Today
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            {(["month", "week", "day"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => { setView(v); setCursor(view === "month" ? today : cursor); }}
                className={`text-xs px-3 py-1.5 rounded-md capitalize transition ${view === v ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            onClick={() => openDrawer()}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gradient-primary text-white font-medium hover:opacity-90 shadow-glow"
          >
            <Plus className="h-3.5 w-3.5" /> New Content
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {view === "month" && <MonthGrid cursor={cursor} today={today} events={events} onDayClick={(d) => openDrawer(d)} />}
        {view === "week" && <WeekGrid cursor={cursor} today={today} events={events} onDayClick={(d) => openDrawer(d)} />}
        {view === "day" && <DayGrid cursor={cursor} events={events} onNewClick={() => openDrawer(cursor.toISOString().slice(0, 10))} />}
      </div>

      {/* Schedule Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="text-base">Schedule Content</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto py-5 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Morning Productivity Hacks"
                className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Date</label>
              <input
                type="date"
                value={drawerDate}
                onChange={(e) => setDrawerDate(e.target.value)}
                className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Platform</label>
              <div className="grid grid-cols-2 gap-1.5">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setForm({ ...form, platform: p })}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all capitalize ${
                      form.platform === p ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <span className={`h-4 w-4 rounded border text-[8px] font-semibold uppercase grid place-items-center ${platformMeta[p].color}`}>
                      {p.slice(0, 2)}
                    </span>
                    {platformMeta[p].label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Status</label>
              <div className="flex gap-1.5">
                {(["scheduled", "draft", "published"] as CalendarEvent["status"][]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setForm({ ...form, status: s })}
                    className={`flex-1 text-xs py-1.5 rounded-md border capitalize transition ${
                      form.status === s ? "border-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-4 flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(false)}
              className="flex-1 text-sm py-2 rounded-lg border border-border hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              onClick={saveEvent}
              disabled={!form.title.trim() || createEvent.isPending}
              className="flex-1 text-sm py-2 rounded-lg bg-gradient-primary text-white font-medium hover:opacity-90 disabled:opacity-50 shadow-glow"
            >
              {createEvent.isPending ? "Saving…" : "Schedule"}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

type EventWithDate = Omit<CalendarEvent, "date"> & { date: Date };

function EventPill({ event }: { event: EventWithDate }) {
  const meta = platformMeta[event.platform as keyof typeof platformMeta];
  return (
    <div className={`text-[11px] px-1.5 py-0.5 rounded border truncate ${meta?.color ?? "bg-primary/20 text-primary border-primary/30"}`}>
      {event.title}
    </div>
  );
}

function MonthGrid({ cursor, today, events, onDayClick }: { cursor: Date; today: Date; events: EventWithDate[]; onDayClick: (d: string) => void }) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);

  return (
    <>
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAYS.map((d) => <div key={d} className="px-3 py-2 text-xs font-medium text-muted-foreground">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 auto-rows-fr">
        {cells.map((d, i) => {
          const cellDate = d ? new Date(cursor.getFullYear(), cursor.getMonth(), d) : null;
          const dayEvents = cellDate ? events.filter((e) => isSameDay(e.date, cellDate)) : [];
          return (
            <div
              key={i}
              onClick={() => d && cellDate && onDayClick(cellDate.toISOString().slice(0, 10))}
              className={`min-h-[100px] border-r border-b border-border/60 p-2 ${!d ? "bg-background/40" : "cursor-pointer hover:bg-secondary/30 transition-colors"}`}
            >
              {d && (
                <div className={`text-xs mb-1 ${isSameDay(cellDate!, today) ? "h-5 w-5 rounded-full bg-primary text-white grid place-items-center font-semibold" : "text-muted-foreground"}`}>
                  {d}
                </div>
              )}
              <div className="space-y-0.5">
                {dayEvents.map((e) => <EventPill key={e.id} event={e} />)}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function WeekGrid({ cursor, today, events, onDayClick }: { cursor: Date; today: Date; events: EventWithDate[]; onDayClick: (d: string) => void }) {
  const weekStart = startOfWeek(cursor);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  return (
    <>
      <div className="grid grid-cols-7 border-b border-border">
        {days.map((d, i) => (
          <div key={i} className={`px-3 py-2 text-center ${isSameDay(d, today) ? "bg-primary/10" : ""}`}>
            <div className="text-xs text-muted-foreground">{WEEKDAYS[d.getDay()]}</div>
            <div className={`text-sm font-semibold mt-0.5 ${isSameDay(d, today) ? "text-primary" : ""}`}>{d.getDate()}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 min-h-[400px]">
        {days.map((d, i) => {
          const dayEvents = events.filter((e) => isSameDay(e.date, d));
          return (
            <div
              key={i}
              onClick={() => onDayClick(d.toISOString().slice(0, 10))}
              className={`border-r border-border/60 p-2 cursor-pointer hover:bg-secondary/30 transition-colors ${isSameDay(d, today) ? "bg-primary/5" : ""}`}
            >
              <div className="space-y-1">
                {dayEvents.map((e) => <EventPill key={e.id} event={e} />)}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function DayGrid({ cursor, events, onNewClick }: { cursor: Date; events: EventWithDate[]; onNewClick: () => void }) {
  const dayEvents = events.filter((e) => isSameDay(e.date, cursor));
  return (
    <div className="p-6">
      {dayEvents.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">No content scheduled for this day.</p>
          <button onClick={onNewClick} className="mt-3 text-xs text-primary hover:underline flex items-center gap-1 mx-auto">
            <Plus className="h-3 w-3" /> Schedule something
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {dayEvents.map((e) => (
            <div key={e.id} className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3">
              <div className={`h-8 w-8 rounded border grid place-items-center text-[10px] font-semibold uppercase ${platformMeta[e.platform as keyof typeof platformMeta]?.color}`}>
                {e.platform.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{e.title}</div>
                <div className="text-xs text-muted-foreground capitalize">{e.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
