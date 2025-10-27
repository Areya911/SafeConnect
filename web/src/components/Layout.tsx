import React from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bgsoft">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
