import { AlertTriangle } from "lucide-react";

function ApprovalNotice() {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 shrink-0 rounded-xl bg-amber-100 text-amber-700 grid place-items-center">
          <AlertTriangle size={18} />
        </div>
        <div>
          <h4 className="font-semibold leading-tight">Meetup approval required</h4>
          <p className="text-sm leading-snug mt-1">
            Every meetup must be approved by all invited participants. Until everyone
            accepts, the event will remain in a pending state and won’t appear as confirmed on the calendar.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ApprovalNotice;
