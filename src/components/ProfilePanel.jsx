import { useState } from "react";
import { User, Save, Link as LinkIcon, Pencil } from "lucide-react";

function ProfilePanel({ user, onSave }) {
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(
    user?.avatar ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"
  );
  const [bio, setBio] = useState(user?.bio || "I love meeting up for coffee and evening walks.");
  const [preference, setPreference] = useState(user?.preference || "Evenings");

  const handleSave = () => {
    const updated = { name: name || "Unnamed", avatar, bio, preference };
    onSave?.(updated);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 grid place-items-center">
            <User size={16} />
          </div>
          <h3 className="font-semibold">My profile</h3>
        </div>
        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
          <Pencil size={14} /> editable
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <img src={avatar} alt={name} className="h-12 w-12 rounded-xl object-cover" />
          <div className="flex-1 grid grid-cols-2 gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="col-span-2 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Avatar URL"
              className="col-span-2 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">When I prefer to meet</label>
          <div className="mt-1 grid grid-cols-3 gap-2 text-sm">
            {['Mornings','Afternoons','Evenings'].map((opt) => (
              <button
                key={opt}
                onClick={() => setPreference(opt)}
                className={`px-3 py-1.5 rounded-xl border transition-colors ${
                  preference === opt ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl font-medium"
        >
          <Save size={16} /> Save profile
        </button>

        <div className="pt-2 border-t border-gray-100 text-sm">
          <div className="text-xs text-gray-500">Public link</div>
          <div className="mt-1 flex items-center gap-2">
            <div className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700 flex items-center gap-1">
              <LinkIcon size={14} /> linkup.app/u/{(name || 'me').toLowerCase().replace(/\s+/g,'-')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePanel;
