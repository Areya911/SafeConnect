import React from "react";

export default function Profile(){
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <div className="bg-white p-4 rounded-xl shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">A</div>
          <div>
            <div className="text-lg font-semibold">Alex</div>
            <div className="text-sm text-slate-500">Member since Oct 2025</div>
          </div>
        </div>
      </div>
    </div>
  );
}
