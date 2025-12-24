"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within protected layout");
  }
  return context;
};

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="min-h-screen bg-[#FAFAF8] relative overflow-hidden">
        {/* Decorative gradient lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-200 to-transparent opacity-60" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-pink-200 to-transparent opacity-60" />

        {/* Subtle gradient orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-linear-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-linear-to-br from-orange-100/20 to-yellow-100/20 rounded-full blur-3xl pointer-events-none" />

        {/* Sidebar - oculto en mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content - sin margen en mobile */}
        <main className={`min-h-screen relative z-10 transition-all duration-300 ${isCollapsed ? 'ml-0 md:ml-20' : 'ml-0 md:ml-64'}`}>
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
