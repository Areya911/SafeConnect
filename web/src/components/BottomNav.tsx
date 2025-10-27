import React from "react";
import { Link, useLocation } from "react-router-dom";

const items = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/alerts", label: "Alerts", icon: "⚠️" },
  { to: "/sos", label: "SOS", icon: "🚨" },
  { to: "/profile", label: "Profile", icon: "👤" },
];

export default function BottomNav(){
  const loc = useLocation();
  return (
    <nav className="bg-white border-t py-2 fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto">
      <div className="container mx-auto px-4 flex justify-between md:justify-end md:gap-4">
        {items.map(i => (
          <Link key={i.to} to={i.to} className={`flex-1 md:flex-none md:px-2 py-2 md:rounded-md flex flex-col items-center text-sm ${loc.pathname === i.to ? 'text-primary' : 'text-slate-600'}`}>
            <div className="text-xl">{i.icon}</div>
            <div>{i.label}</div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
