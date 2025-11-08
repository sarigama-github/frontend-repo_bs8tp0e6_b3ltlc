import { useEffect, useMemo, useState } from "react";
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
    if (i % 2 === 0) arr.push(block(d, 10, 30, 11, 30, "Study Session \uD83D\uDCDA", "\uD83D\uDCDA", participants));
    if (i % 3 === 0) arr.push(block(d, 18, 0, 19, 0, "Scrim \u26BD\uFE0F", "\u26BD\uFE0F", participants));
    if (i % 4 === 0) arr.push(block(d, 20, 0, 21, 0, "Hangout \uD83C\uDF5C", "\uD83C\uDF5C", participants));
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

function useHashRoute(defaultRoute = "calendar") {
  const [route, setRoute] = useState(() => (window.location.hash.replace("#", "") || defaultRoute));
  useEffect(() => {
    const handler = () => setRoute(window.location.hash.replace("#", "") || defaultRoute);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, [defaultRoute]);
  const navigate = (r) => {
    if (r !== route) window.location.hash = r;
  };
  return [route, navigate];
}

function App() {
  const [route, navigate] = useHashRoute("calendar");

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(null);
  const [friends, setFriends] = useState(mockFriends());
  const [participants, setParticipants] = useState(["Alex", "Taylor"]);
  const [viewProfile, setViewProfile] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0); // can go as far back/future as desired

  const weekStart = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    const base = new Date(now.getFullYear(), now.getMonth(), diff);
    const shifted = new Date(base);
    shifted.setDate(base.getDate() + weekOffset * 7);
    return shifted;
  }, [weekOffset]);

  const data = useMemo(() => generateMockData(weekStart, participants), [weekStart, participants]);
  const allSuggestions = useMemo(() => data.suggested.flat(), [data]);

  const handleConnect = () => {
    setUser(mockUser());
    alert("Google Calendar connected (mock). Your busy blocks will populate here.");
  };

  const handleImportCalendar = () => {
    handleConnect();
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
    alert("Use Discover to search and add people or share your invite link.");
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

  // Pages
  const CalendarPage = (
    <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your calendar</h1>
          <p className="text-sm text-gray-600">Busy blocks, free slots, and smart suggestions.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset(weekOffset - 1)} className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">Prev</button>
          <div className="text-sm text-gray-500 min-w-[160px] text-center">Week of {weekStart.toLocaleDateString()}</div>
          <button onClick={() => setWeekOffset(weekOffset + 1)} className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">Next</button>
          <button onClick={() => setWeekOffset(0)} className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">Today</button>
        </div>
      </header>

      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <CalendarView weekStart={weekStart} data={data} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={handleImportCalendar} className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl shadow-sm">
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_64dp.png" alt="Google" className="h-4 w-4" />
          Import Google Calendar
        </button>
        <ApprovalNotice />
      </div>
    </main>
  );

  const PlanPage = (
    <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <section className="lg:col-span-3 space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Plan & review suggestions</h1>
            <p className="text-sm text-gray-600">Pick participants and approve meetups.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setWeekOffset(weekOffset - 1)} className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">Prev</button>
            <div className="text-sm text-gray-500 min-w-[160px] text-center">Week of {weekStart.toLocaleDateString()}</div>
            <button onClick={() => setWeekOffset(weekOffset + 1)} className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">Next</button>
            <button onClick={() => setWeekOffset(0)} className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">Today</button>
          </div>
        </header>
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <CalendarView weekStart={weekStart} data={data} />
        </div>
      </section>
      <aside className="lg:col-span-1 space-y-4">
        <PeoplePanel
          friends={friends}
          onAddFriend={handleAddFriend}
          onSelectParticipants={(names) => {
            names.forEach(openPublicProfile);
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
      </aside>
    </main>
  );

  const DiscoverPage = (
    <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Discover & connect</h1>
          <p className="text-sm text-gray-600">Find friends, groups, and build your profile.</p>
        </header>
        <DiscoverPanel onInvite={handleInviteFromDiscover} />
        <GroupsSection />
      </div>
      <div className="lg:col-span-1 space-y-4">
        <ProfilePanel user={user} onSave={handleSaveProfile} />
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar onConnect={handleConnect} user={user} route={route} onNavigate={navigate} />
      {route === "calendar" && CalendarPage}
      {route === "plan" && PlanPage}
      {route === "discover" && DiscoverPage}
      <CreateEventModal open={open} data={pending} onClose={() => setOpen(false)} onConfirm={handleConfirm} />
    </div>
  );
}

function GroupsSection() {
  const [groups, setGroups] = useState([{ id: "g1", name: "Weekend Runners" }, { id: "g2", name: "Product Book Club" }]);
  const [name, setName] = useState("");
  const add = () => {
    if (!name.trim()) return;
    setGroups((g) => [...g, { id: String(g.length + 1), name: name.trim() }]);
    setName("");
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Groups & organizations</h3>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Create a group"
            className="px-3 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
          <button onClick={add} className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white">Add</button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {groups.map((g) => (
          <div key={g.id} className="p-3 rounded-xl border border-gray-200 bg-gray-50">
            <div className="font-medium">{g.name}</div>
            <div className="text-xs text-gray-500">Create events and invite members.</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
