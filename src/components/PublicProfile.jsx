import { Users, Calendar } from "lucide-react";

function PublicProfile({ profile, onAddFriend }) {
  if (!profile) return null;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={profile.avatar} alt={profile.name} className="h-10 w-10 rounded-xl object-cover" />
          <div>
            <div className="font-semibold">{profile.name}</div>
            <div className="text-xs text-gray-500">{profile.bio}</div>
          </div>
        </div>
        <button
          onClick={onAddFriend}
          className="inline-flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl"
        >
          <Users size={16} /> Add friend
        </button>
      </div>

      <div className="p-4">
        <div className="text-xs text-gray-500 mb-2">Public calendar (busy shown)</div>
        <div className="h-40 rounded-xl border border-gray-100 bg-gray-50 grid grid-cols-7 gap-2 p-2">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="h-6 rounded bg-gray-200" />
          ))}
        </div>
        <div className="mt-3 text-xs text-gray-500 inline-flex items-center gap-1">
          <Calendar size={14} /> Busy blocks are shown; details hidden.
        </div>
      </div>
    </div>
  );
}

export default PublicProfile;
