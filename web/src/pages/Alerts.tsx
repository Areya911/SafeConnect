import React from "react";

export default function Alerts() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">All Alerts</h1>
      <p className="text-slate-600 mb-6">List of all recent reports (demo client-side).</p>
      {/* duplicate card examples */}
      <div className="space-y-3">
        <div className="bg-white p-4 rounded-lg shadow">Sample alert card</div>
      </div>
    </div>
  );
}
