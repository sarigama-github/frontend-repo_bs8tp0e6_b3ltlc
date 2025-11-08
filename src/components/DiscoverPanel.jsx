import { useMemo, useState } from "react";
import { Search, UserPlus2, Users, Mail } from "lucide-react";

const suggestedPeople = [
  { id: "d1", name: "Riley Brooks", status: "Mutuals: Sam, Taylor", avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop" },
  { id: "d2", name: "Jordan Diaz", status: "Same company, NYC", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop" },
  { id: "d3", name: "Avery Patel", status: "Climbs on weekends", avatar: "https://images.unsplash.com/photo-1527980965255-7c294a1b9175?q=80&w=200&auto=format&fit=crop" },
];

function DiscoverPanel({ onInvite }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suggestedPeople;
    return suggestedPeople.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-violet-100 text-violet-700 grid place-items-center">
            <Users size={16} />
          </div>
          <h3 className="font-semibold">Discover friends</h3>
        </div>
        <button
          onClick={() => onInvite?.("invite-link")}
          className="hidden sm:inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100"
        >
          <Mail size={16} /> Invite via link
        </button>
      </div>

      <div className="p-4">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people or emails"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
        </div>
        <div className="space-y-2 max-h-48 overflow-auto">
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-2 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <img src={p.avatar} alt={p.name} className="h-8 w-8 rounded-full" />
                <div>
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.status}</div>
                </div>
              </div>
              <button
                className="inline-flex items-center gap-2 text-sm bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-xl"
                onClick={() => onInvite?.(p)}
              >
                <UserPlus2 size={16} /> Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DiscoverPanel;
