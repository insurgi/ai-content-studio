import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { mockCalendarEvents, platformMeta, type Platform } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/calendar")({
  component: CalendarPage,
  head: () => ({ meta: [{ title: "Calendar — AI Twin Studio" }, { name: "description", content: "Plan and schedule your content calendar." }] }),
});

function CalendarPage() {
  const [cursor, setCursor] = useState(new Date());
  const [events, setEvents] = useState(mockCalendarEvents);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { weeks, monthLabel } = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    while (cells.length % 7 !== 0) cells.push(null);
    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return { weeks, monthLabel: cursor.toLocaleString("en-US", { month: "long", year: "numeric" }) };
  }, [cursor]);

  const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const drop = (date: Date) => {
    if (!draggingId) return;
    setEvents((evs) => evs.map((e) => (e.id === draggingId ? { ...e, date } : e)));
    setDraggingId(null);
  };
  const today = new Date();

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="h-8 w-8 grid place-items-center rounded-lg border border-border hover:bg-card transition"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="h-8 w-8 grid place-items-center rounded-lg border border-border hover:bg-card transition"><ChevronRight className="h-4 w-4" /></button>
          <h2 className="ml-2 text-lg font-semibold">{monthLabel}</h2>
          <button onClick={() => setCursor(new Date())} className="ml-2 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md px-2 py-1">Today</button>
        </div>
        <button onClick={() => { setSelectedDate(new Date()); setDrawerOpen(true); }} className="bg-gradient-primary text-white rounded-lg px-3 py-2 text-sm font-medium hover:opacity-90 transition flex items-center gap-1.5 shadow-glow">
          <Plus className="h-4 w-4" /> New Content
        </button>
      </div>

      <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
        {(Object.keys(platformMeta) as Platform[]).map((p) => (
          <div key={p} className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${platformMeta[p].dot}`} />{platformMeta[p].label}</div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="px-3 py-2 text-xs font-medium text-muted-foreground">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-fr">
          {weeks.flat().map((date, i) => {
            const dayEvents = date ? events.filter((e) => sameDay(e.date, date)) : [];
            const isToday = date && sameDay(date, today);
            return (
              <div key={i}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => date && drop(date)}
                onClick={() => { if (date) { setSelectedDate(date); setDrawerOpen(true); } }}
                className={`min-h-[100px] border-r border-b border-border/60 p-2 cursor-pointer hover:bg-secondary/30 transition ${!date ? "bg-background/40" : ""}`}>
                {date && (
                  <>
                    <div className={`text-xs mb-1.5 ${isToday ? "h-5 w-5 rounded-full bg-primary text-white grid place-items-center font-semibold" : "text-muted-foreground"}`}>{date.getDate()}</div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <div key={ev.id} draggable onDragStart={() => setDraggingId(ev.id)} onClick={(e) => e.stopPropagation()}
                          className={`text-[11px] px-1.5 py-1 rounded border truncate cursor-grab active:cursor-grabbing ${platformMeta[ev.platform].color}`}>
                          <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1 ${platformMeta[ev.platform].dot}`} />{ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (<div className="text-[10px] text-muted-foreground">+{dayEvents.length - 3} more</div>)}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Schedule Content</h3>
              <button onClick={() => setDrawerOpen(false)} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <Field label="Title"><input className="ci" placeholder="e.g. Morning Productivity Hacks" /></Field>
              <Field label="Platforms">
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(platformMeta) as Platform[]).map((p) => (
                    <button key={p} className={`text-xs px-2.5 py-1 rounded-full border ${platformMeta[p].color}`}>{platformMeta[p].label}</button>
                  ))}
                </div>
              </Field>
              <Field label="Date & time"><input type="datetime-local" className="ci" defaultValue={selectedDate?.toISOString().slice(0, 16)} /></Field>
              <Field label="Status"><select className="ci"><option>Draft</option><option>Scheduled</option><option>Published</option></select></Field>
              <button onClick={() => setDrawerOpen(false)} className="w-full mt-2 bg-gradient-primary text-white rounded-lg py-2 text-sm font-medium hover:opacity-90 shadow-glow">Save</button>
            </div>
          </div>
        </div>
      )}

      <style>{`.ci{width:100%;background:var(--background);border:1px solid var(--border);border-radius:.5rem;padding:.5rem .75rem;font-size:.875rem;color:var(--foreground)}.ci:focus{outline:2px solid color-mix(in oklab,var(--primary) 40%,transparent)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><label className="text-xs text-muted-foreground mb-1 block">{label}</label>{children}</div>);
}
