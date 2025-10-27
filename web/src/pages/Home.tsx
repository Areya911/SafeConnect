import React, { useState } from "react";
import ReportModal from "../shared/ReportModal";

export default function Home(){
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-soft">
          <div className="text-xs text-slate-500">Active Alerts</div>
          <div className="text-2xl font-bold text-primary">24</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-soft">
          <div className="text-xs text-slate-500">Community Members</div>
          <div className="text-2xl font-bold text-primary">156</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-soft">
          <div className="text-xs text-slate-500">Trust Score</div>
          <div className="text-2xl font-bold text-primary">4.8</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="h-96 md:h-[40rem] flex items-center justify-center bg-gradient-to-br from-sky-50 to-violet-50">
          {/* placeholder for map; later integrate Google Maps component */}
          <div className="text-slate-600">Interactive Map Placeholder — integrate @react-google-maps/api later</div>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">Recent Alerts</h2>
        <div className="grid gap-3">
          <div className="bg-white p-4 rounded-xl shadow-soft flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">⚠️</div>
            <div>
              <div className="font-semibold">Unsafe Area Reported</div>
              <div className="text-sm text-slate-500">Poor lighting and suspicious activity — Oak Street • 2h</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-soft flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">💬</div>
            <div>
              <div className="font-semibold">Harassment Report</div>
              <div className="text-sm text-slate-500">Verbal harassment reported — Main Square • 6h</div>
            </div>
          </div>
        </div>
      </section>

      <button
        aria-label="Report incident"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-coral to-accent text-white text-2xl shadow-lg flex items-center justify-center"
      >+</button>

      <ReportModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
