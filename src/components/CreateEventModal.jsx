import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarPlus } from "lucide-react";

function CreateEventModal({ open, data, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="fixed inset-x-0 bottom-0 md:inset-0 md:m-auto md:h-fit md:max-w-lg z-50 bg-white rounded-t-3xl md:rounded-2xl shadow-xl p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-600 grid place-items-center">
              <CalendarPlus size={18} />
            </div>
            <h3 className="font-semibold">Create event</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">Title</label>
            <input
              type="text"
              defaultValue={data?.title}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              onChange={(e) => (data.title = e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
            <div>
              <div className="text-xs text-gray-500">Start</div>
              <div className="font-medium">
                {new Date(data.start).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">End</div>
              <div className="font-medium">{new Date(data.end).toLocaleString()}</div>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Participants</div>
            <div className="flex flex-wrap gap-2">
              {data.participants?.map((p) => (
                <span key={p} className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs">
                  {p}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => onConfirm(data)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium"
          >
            Add to Google Calendar
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CreateEventModal;
