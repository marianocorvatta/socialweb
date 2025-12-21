"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] relative overflow-hidden">
      {/* Decorative gradient lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-200 to-transparent opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-pink-200 to-transparent opacity-60" />

      {/* Subtle gradient orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-linear-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-linear-to-br from-orange-100/20 to-yellow-100/20 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 min-h-screen relative z-10">
        {children}
      </main>
    </div>
  );
}
