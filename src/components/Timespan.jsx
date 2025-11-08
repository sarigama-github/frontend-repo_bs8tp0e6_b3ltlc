// Utility display for perfectly aligned time labels inside their boxes
export default function Timespan({ start, end }) {
  const startStr = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endStr = new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className="inline-flex items-center gap-1 text-xs font-medium tabular-nums">
      <span className="px-1 rounded bg-white/70 text-current border border-current/20 leading-5 h-5 inline-flex items-center justify-center">
        {startStr}
      </span>
      <span aria-hidden className="text-current">—</span>
      <span className="px-1 rounded bg-white/70 text-current border border-current/20 leading-5 h-5 inline-flex items-center justify-center">
        {endStr}
      </span>
    </div>
  );
}
