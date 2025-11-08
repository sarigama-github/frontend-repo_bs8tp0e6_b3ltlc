import { useMemo } from "react";
import { Sparkles, Clock, Users } from "lucide-react";

function SuggestionPanel({ suggestions = [], onPick }) {
  const grouped = useMemo(() => {
    const map = {};
    for (const s of suggestions) {
      const key = `${new Date(s.start).toDateString()}`;
      map[key] = map[key] || [];
      map[key].push(s);
    }
    return Object.entries(map);
  }, [suggestions]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-8 w-8 rounded-xl bg-violet-100 text-violet-600 grid place-items-center">
          <Sparkles size={16} />
        </div>
        <h3 className="font-semibold">Suggested slots</h3>
      </div>
      {grouped.length === 0 && (
        <p className="text-sm text-gray-500">No suggestions yet. Connect calendars and pick friends to compare.</p>
      )}
      <div className="space-y-3">
        {grouped.map(([day, items]) => (
          <div key={day}>
            <div className="text-xs font-medium text-gray-500 mb-1">{day}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {items.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => onPick(s)}
                  className="text-left p-3 rounded-xl border border-violet-200 bg-violet-50 hover:bg-violet-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-violet-900">
                      {s.emoji} {s.title}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-violet-700">
                      <Clock size={14} />
                      {new Date(s.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      -
                      {new Date(s.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-violet-800 flex items-center gap-1">
                    <Users size={14} /> {s.participants?.join(", ")}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuggestionPanel;
