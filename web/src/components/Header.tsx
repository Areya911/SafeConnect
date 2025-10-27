import React from "react";
import { Link } from "react-router-dom";

export default function Header(){
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white font-bold">SC</div>
          <div>
            <div className="text-lg font-bold text-navy">SafeConnect</div>
            <div className="text-xs text-slate-500 -mt-1">Community Safety Network</div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 rounded-md text-sm text-slate-600 hover:bg-slate-50">🌐 EN</button>
          <Link to="/profile" className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center">A</Link>
        </div>
      </div>
    </header>
  )
}
