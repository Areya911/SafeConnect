import React from "react";

export default function SOS(){
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">SOS</h1>
        <p className="text-slate-500">Quick emergency actions</p>
      </div>
      <div>
        <button onClick={()=>alert('Demo SOS — no backend')} className="w-40 h-40 rounded-full bg-red-600 text-white text-2xl shadow-lg">SOS</button>
      </div>
    </div>
  );
}
