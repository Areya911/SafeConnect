import React, { useState } from "react";

export default function ReportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [category, setCategory] = useState("unsafe");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now: client-only demo. Later: send to Firestore.
    console.log("REPORT", { category, desc, location });
    alert("Report saved to demo console. Integrate backend later.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={submit} className="relative bg-white rounded-t-lg md:rounded-lg w-full md:w-3/5 max-w-2xl p-6 z-10">
        <h3 className="text-xl font-semibold mb-3">Report Incident</h3>

        <label className="block mb-2 text-sm">Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded mb-3">
          <option value="unsafe">Unsafe area</option>
          <option value="harassment">Harassment</option>
          <option value="streetlight">Streetlight issue</option>
          <option value="other">Other</option>
        </select>

        <label className="block mb-2 text-sm">Location (address or landmark)</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 border rounded mb-3" placeholder="e.g., Oak Street near 4th" />

        <label className="block mb-2 text-sm">Description</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full p-2 border rounded mb-3" rows={4} placeholder="Describe what happened..." />

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded bg-purple-600 text-white">Submit</button>
        </div>
      </form>
    </div>
  );
}
