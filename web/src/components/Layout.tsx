import React from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-extrabold text-purple-600">SafeConnect</div>
            <div className="text-sm text-slate-500 hidden md:block">Community Safety Network</div>
          </div>

          <nav className="flex items-center gap-3">
            <Link to="/" className="text-sm px-3 py-2 rounded hover:bg-slate-100">Home</Link>
            <Link to="/alerts" className="text-sm px-3 py-2 rounded hover:bg-slate-100">Alerts</Link>
            <Link to="/sos" className="text-sm px-3 py-2 rounded hover:bg-slate-100">SOS</Link>
            <Link to="/profile" className="text-sm px-3 py-2 rounded bg-purple-600 text-white">Profile</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>

      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-4 text-sm text-slate-500">
          © {new Date().getFullYear()} SafeConnect — built with community in mind
        </div>
      </footer>
    </div>
  );
}
