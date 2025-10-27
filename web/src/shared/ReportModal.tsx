import React, { useEffect } from "react";

export default function ReportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent){ if(e.key === 'Escape') onClose(); }
    if(open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if(!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={(e)=>{ e.preventDefault(); alert('Demo: reported (client only)'); onClose(); }} className="relative bg-white rounded-t-xl md:rounded-xl w-full md:w-3/5 max-w-2xl p-6 z-10">
        <h3 className="text-xl font-semibold mb-3">Report Incident</h3>
        <label className="block text-sm mb-1">Category</label>
        <select className="w-full p-2 border rounded mb-3">
          <option>Unsafe area</option>
          <option>Harassment</option>
          <option>Streetlight</option>
          <option>Other</option>
        </select>

        <label className="block text-sm mb-1">Location</label>
        <input className="w-full p-2 border rounded mb-3" placeholder="Address or landmark" />

        <label className="block text-sm mb-1">Description</label>
        <textarea className="w-full p-2 border rounded mb-3" rows={4} placeholder="What happened?" />

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded bg-primary text-white">Submit</button>
        </div>
      </form>
    </div>
  );
}
