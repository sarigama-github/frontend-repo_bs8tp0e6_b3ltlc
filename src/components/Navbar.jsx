import { User, Calendar, Stars, Users } from "lucide-react";

function NavLink({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
        active ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function Navbar({ onConnect, user, route = "calendar", onNavigate }) {
  return (
    <nav className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-violet-100 text-violet-600 grid place-items-center">
            <Calendar size={18} />
          </div>
          <span className="text-xl font-semibold tracking-tight">LinkUp</span>
          <div className="hidden md:flex items-center gap-1 ml-2">
            <NavLink active={route === "calendar"} onClick={() => onNavigate?.("calendar")}>
              Calendar
            </NavLink>
            <NavLink active={route === "plan"} onClick={() => onNavigate?.("plan")}>
              <span className="inline-flex items-center gap-1"><Stars size={14} /> Plan</span>
            </NavLink>
            <NavLink active={route === "discover"} onClick={() => onNavigate?.("discover")}>
              <span className="inline-flex items-center gap-1"><Users size={14} /> Discover</span>
            </NavLink>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!user ? (
            <button
              onClick={onConnect}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl shadow-sm transition-colors"
            >
              <img
                src="https://www.gstatic.com/images/branding/product/1x/gsa_64dp.png"
                alt="Google"
                className="h-4 w-4"
              />
              Connect Google
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full ring-2 ring-violet-100"
              />
              <span className="text-sm text-gray-700">{user.name}</span>
              <button
                className="ml-2 p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                title="Account"
              >
                <User size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Mobile tabs */}
      <div className="md:hidden px-4 pb-3 flex gap-2">
        <NavLink active={route === "calendar"} onClick={() => onNavigate?.("calendar")}>Calendar</NavLink>
        <NavLink active={route === "plan"} onClick={() => onNavigate?.("plan")}>Plan</NavLink>
        <NavLink active={route === "discover"} onClick={() => onNavigate?.("discover")}>Discover</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
