import React, { useState } from "react";
import ReportModal from "../shared/ReportModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-slate-500">Active Alerts</div>
          <div className="text-2xl font-bold text-purple-600">24</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-slate-500">Community Members</div>
          <div className="text-2xl font-bold text-purple-600">156</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-slate-500">Trust Score</div>
          <div className="text-2xl font-bold text-purple-600">4.8</div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="h-96 md:h-128 flex items-center justify-center bg-gradient-to-br from-sky-50 to-violet-50">
          <div className="text-slate-600 text-lg">Interactive map placeholder — integrate Google Maps later</div>
        </div>
      </div>

      {/* Alerts preview */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Recent Alerts</h2>
        <div className="grid gap-3">
          <div className="bg-white p-4 rounded-lg shadow flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">⚠️</div>
            <div>
              <div className="font-semibold">Unsafe Area Reported</div>
              <div className="text-sm text-slate-500">Poor lighting and suspicious activity — Oak Street • 2 hours ago</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">💬</div>
            <div>
              <div className="font-semibold">Harassment Report</div>
              <div className="text-sm text-slate-500">Verbal harassment reported — Main Square • 6 hours ago</div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Report button */}
      <button
        aria-label="Report incident"
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 text-white text-2xl shadow-lg flex items-center justify-center"
      >
        +
      </button>

      <ReportModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
