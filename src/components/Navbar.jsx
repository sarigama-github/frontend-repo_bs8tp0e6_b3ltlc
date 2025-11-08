import { User, Calendar } from "lucide-react";

function Navbar({ onConnect, user }) {
  return (
    <nav className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-violet-100 text-violet-600 grid place-items-center">
            <Calendar size={18} />
          </div>
          <span className="text-xl font-semibold tracking-tight">LinkUp</span>
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
    </nav>
  );
}

export default Navbar;
