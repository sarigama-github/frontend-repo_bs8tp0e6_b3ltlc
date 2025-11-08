import { useMemo } from "react";

function timeToLabel(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function DayColumn({ date, events = [], suggestions = [], confirmed = [] }) {
  // Merge busy blocks and render as gray; suggestions purple; confirmed green
  const hours = Array.from({ length: 24 }, (_, i) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), i));

  return (
    <div className="flex-1 min-w-[180px] border-l border-gray-100">
      <div className="px-3 py-2 text-sm font-medium text-gray-700 sticky top-[52px] bg-white/80 backdrop-blur z-10">
        {date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
      </div>
      <div className="relative">
        {hours.map((h, i) => (
          <div
            key={i}
            className="h-14 border-t border-gray-50 text-[11px] text-gray-400 px-3 flex items-start"
          >
            <span className="translate-y-1">{timeToLabel(h)}</span>
          </div>
        ))}

        {/* Busy blocks */}
        {events.map((e, idx) => (
          <Block key={"b" + idx} data={e} color="bg-gray-300/70" border="border-gray-400/60" />
        ))}
        {/* Suggestions */}
        {suggestions.map((s, idx) => (
          <Block key={"s" + idx} data={s} color="bg-violet-200/70" border="border-violet-400/70" pulse />
        ))}
        {/* Confirmed */}
        {confirmed.map((c, idx) => (
          <Block key={"c" + idx} data={c} color="bg-emerald-200/80" border="border-emerald-400/70" />
        ))}
      </div>
    </div>
  );
}

function minutesFromStartOfDay(date) {
  return date.getHours() * 60 + date.getMinutes();
}

function Block({ data, color, border, pulse }) {
  // data: { start: Date, end: Date, title: string, emoji?: string }
  const startM = minutesFromStartOfDay(new Date(data.start));
  const endM = minutesFromStartOfDay(new Date(data.end));
  const top = (startM / (24 * 60)) * (24 * 56); // 56px per hour (h-14)
  const height = Math.max(24, ((endM - startM) / (24 * 60)) * (24 * 56));

  return (
    <div
      className={`absolute left-3 right-3 ${color} ${border} border rounded-xl shadow-sm overflow-hidden ${
        pulse ? "animate-pulse" : ""
      }`}
      style={{ top, height }}
    >
      <div className="px-3 py-2 text-sm font-medium text-gray-800 truncate">
        {data.emoji ? `${data.emoji} ` : ""}
        {data.title}
      </div>
    </div>
  );
}

function CalendarView({ weekStart, data }) {
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i)), [weekStart]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[960px] grid grid-cols-7">
        {days.map((d, i) => (
          <DayColumn key={i} date={d} events={data.busy?.[i] || []} suggestions={data.suggested?.[i] || []} confirmed={data.confirmed?.[i] || []} />
        ))}
      </div>
    </div>
  );
}

export default CalendarView;
