import { useMemo, useState } from "react";
import { UserPlus, Search, Users, Check } from "lucide-react";

function PeoplePanel({ friends = [], onAddFriend, onSelectParticipants }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter((f) => f.name.toLowerCase().includes(q));
  }, [friends, query]);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleInvite = () => {
    const picked = friends.filter((f) => selected.includes(f.id));
    onSelectParticipants?.(picked.map((p) => p.name));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-blue-100 text-blue-700 grid place-items-center">
            <Users size={16} />
          </div>
          <h3 className="font-semibold">People</h3>
        </div>
        <button
          onClick={onAddFriend}
          className="inline-flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl"
        >
          <UserPlus size={16} /> Add friend
        </button>
      </div>

      <div className="p-4">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="max-h-56 overflow-auto space-y-2">
          {filtered.length === 0 && (
            <div className="text-sm text-gray-500">No people found.</div>
          )}
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className={`w-full flex items-center justify-between p-2 rounded-xl border transition-colors ${
                selected.includes(p.id)
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <img src={p.avatar} alt={p.name} className="h-8 w-8 rounded-full" />
                <div className="text-left">
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.status}</div>
                </div>
              </div>
              {selected.includes(p.id) && (
                <div className="h-6 w-6 rounded-full bg-blue-600 text-white grid place-items-center">
                  <Check size={14} />
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleInvite}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm"
        >
          Invite selected
        </button>
      </div>
    </div>
  );
}

export default PeoplePanel;
