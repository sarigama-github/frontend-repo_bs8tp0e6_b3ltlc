import { useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import CalendarView from "./components/CalendarView";
import SuggestionPanel from "./components/SuggestionPanel";
import CreateEventModal from "./components/CreateEventModal";

function mockUser() {
  return {
    name: "Alex Kim",
    avatar:
      "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=200&auto=format&fit=crop",
  };
}

function generateMockData(weekStart) {
  // Create busy blocks for the current user and suggestions for overlaps
  const days = Array.from({ length: 7 }, (_, i) => new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i));

  const busy = days.map((d) => {
    const base = new Date(d);
    return [
      block(base, 9, 0, 10, 0, "Team standup"),
      block(base, 13, 0, 14, 0, "Lunch"),
      block(base, 15, 30, 16, 30, "Focus time"),
    ];
  });

  const suggested = days.map((d, i) => {
    const arr = [];
    if (i % 2 === 0) arr.push(block(d, 10, 30, 11, 30, "Study Session 📚", "📚", ["Alex", "Sam"]))
    if (i % 3 === 0) arr.push(block(d, 18, 0, 19, 0, "Scrim ⚽️", "⚽️", ["Team A", "Team B"]))
    if (i % 4 === 0) arr.push(block(d, 20, 0, 21, 0, "Hangout 🍜", "🍜", ["Alex", "Jamie"]))
    return arr;
  });

  const confirmed = days.map((d, i) => (i === 1 ? [block(d, 17, 0, 18, 0, "Confirmed Meeting ✅", "✅")] : []));

  return { busy, suggested, confirmed };
}

function block(day, sh, sm, eh, em, title, emoji = undefined, participants = ["Alex", "Taylor"]) {
  const start = new Date(day);
  start.setHours(sh, sm, 0, 0);
  const end = new Date(day);
  end.setHours(eh, em, 0, 0);
  return { start, end, title, emoji, participants };
}

function App() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(null);

  const weekStart = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    return new Date(now.getFullYear(), now.getMonth(), diff);
  }, []);

  const data = useMemo(() => generateMockData(weekStart), [weekStart]);

  const allSuggestions = useMemo(() => data.suggested.flat(), [data]);

  const handleConnect = () => {
    // Placeholder for Google OAuth flow - UI demo only in this MVP
    setUser(mockUser());
  };

  const handlePick = (s) => {
    setPending(s);
    setOpen(true);
  };

  const handleConfirm = (d) => {
    // In full app, call backend to create Google Calendar events for participants
    setOpen(false);
    alert(`Event created: ${d.title} at ${new Date(d.start).toLocaleString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar onConnect={handleConnect} user={user} />

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="lg:col-span-3 space-y-4">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Your calendar</h1>
              <p className="text-sm text-gray-600">Busy blocks, free slots, and smart suggestions.</p>
            </div>
            <div className="hidden md:block text-sm text-gray-500">
              Week of {weekStart.toLocaleDateString()}
            </div>
          </header>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <CalendarView weekStart={weekStart} data={data} />
          </div>
        </section>
        <aside className="lg:col-span-1 space-y-4">
          <SuggestionPanel suggestions={allSuggestions} onPick={handlePick} />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-semibold mb-2">How LinkUp works</h3>
            <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
              <li>Connect your Google Calendar to see busy and free time.</li>
              <li>Select friends, classmates, or teammates to compare schedules.</li>
              <li>Get smart suggestions tailored to study, sports, or hangouts.</li>
              <li>Click a slot to create a shared event for everyone.</li>
            </ul>
          </div>
        </aside>
      </main>

      <CreateEventModal open={open} data={pending} onClose={() => setOpen(false)} onConfirm={handleConfirm} />
    </div>
  );
}

export default App;
