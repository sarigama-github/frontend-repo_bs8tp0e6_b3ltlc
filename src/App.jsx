import { useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import CalendarView from "./components/CalendarView";
import SuggestionPanel from "./components/SuggestionPanel";
import CreateEventModal from "./components/CreateEventModal";
import PeoplePanel from "./components/PeoplePanel";
import ApprovalNotice from "./components/ApprovalNotice";
import ProfilePanel from "./components/ProfilePanel";
import DiscoverPanel from "./components/DiscoverPanel";
import PublicProfile from "./components/PublicProfile";

function mockUser() {
  return {
    name: "Alex Kim",
    avatar:
      "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=200&auto=format&fit=crop",
    bio: "Product design, coffee, pickup soccer.",
    preference: "Evenings",
  };
}

function mockFriends() {
  return [
    { id: "1", name: "Sam Lee", status: "Usually free evenings", avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop" },
    { id: "2", name: "Jamie Park", status: "Busy 9–5, weekends open", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop" },
    { id: "3", name: "Taylor Chen", status: "Gym Tue/Thu nights", avatar: "https://images.unsplash.com/photo-1527980965255-7c294a1b9175?q=80&w=200&auto=format&fit=crop" },
  ];
}

function generateMockData(weekStart, participants = ["Alex", "Taylor"]) {
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
    if (i % 2 === 0) arr.push(block(d, 10, 30, 11, 30, "Study Session \uD83D\uDCDA", "\uD83D\uDCDA", participants))
    if (i % 3 === 0) arr.push(block(d, 18, 0, 19, 0, "Scrim \u26BD\uFE0F", "\u26BD\uFE0F", participants))
    if (i % 4 === 0) arr.push(block(d, 20, 0, 21, 0, "Hangout \uD83C\uDF5C", "\uD83C\uDF5C", participants))
    return arr;
  });

  const confirmed = days.map((d, i) => (i === 1 ? [block(d, 17, 0, 18, 0, "Confirmed Meeting \u2705", "\u2705", participants)] : []));

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
  const [friends, setFriends] = useState(mockFriends());
  const [participants, setParticipants] = useState(["Alex", "Taylor"]);
  const [viewProfile, setViewProfile] = useState(null); // another user's public profile

  const weekStart = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    return new Date(now.getFullYear(), now.getMonth(), diff);
  }, []);

  const data = useMemo(() => generateMockData(weekStart, participants), [weekStart, participants]);
  const allSuggestions = useMemo(() => data.suggested.flat(), [data]);

  const handleConnect = () => {
    setUser(mockUser());
  };

  const handlePick = (s) => {
    setPending(s);
    setOpen(true);
  };

  const handleConfirm = (d) => {
    setOpen(false);
    alert(`Event request sent: ${d.title} at ${new Date(d.start).toLocaleString()} — awaiting all approvals`);
  };

  const handleAddFriend = () => {
    alert("Friend discovery is now available below — search and add people or invite via link.");
  };

  const handleSelectParticipants = (names) => {
    setParticipants(["Alex", ...names.filter((n) => n !== "Alex")]);
  };

  const handleSaveProfile = (updated) => {
    setUser((prev) => ({ ...(prev || {}), ...updated }));
  };

  const handleInviteFromDiscover = (personOrLink) => {
    if (typeof personOrLink === "string") {
      navigator.clipboard?.writeText("https://linkup.app/invite/abc123");
      alert("Invite link copied to clipboard");
      return;
    }
    setFriends((prev) => {
      if (prev.some((f) => f.name === personOrLink.name)) return prev;
      return [
        ...prev,
        { id: String(prev.length + 1), name: personOrLink.name, status: personOrLink.status, avatar: personOrLink.avatar },
      ];
    });
  };

  const openPublicProfile = (name) => {
    const f = friends.find((x) => x.name === name) || {
      name,
      avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=200&auto=format&fit=crop",
      bio: "Public profile",
    };
    setViewProfile({ ...f, bio: f.status || "Enjoys meetups", preference: "Evenings" });
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

          <ApprovalNotice />
        </section>

        <aside className="lg:col-span-1 space-y-4">
          <ProfilePanel user={user} onSave={handleSaveProfile} />

          <PeoplePanel
            friends={friends}
            onAddFriend={handleAddFriend}
            onSelectParticipants={(names) => {
              names.forEach(openPublicProfile); // allow quick view of selected people's public calendars
              handleSelectParticipants(names);
            }}
          />

          <SuggestionPanel suggestions={allSuggestions} onPick={handlePick} />

          {viewProfile && (
            <PublicProfile
              profile={viewProfile}
              onAddFriend={() => handleInviteFromDiscover({ name: viewProfile.name, status: viewProfile.bio, avatar: viewProfile.avatar })}
            />
          )}

          <DiscoverPanel onInvite={handleInviteFromDiscover} />
        </aside>
      </main>

      <CreateEventModal open={open} data={pending} onClose={() => setOpen(false)} onConfirm={handleConfirm} />
    </div>
  );
}

export default App;
