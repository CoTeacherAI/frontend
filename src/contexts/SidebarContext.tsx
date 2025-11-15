"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SidebarContextType {
  isMinimized: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isMinimized, setIsMinimized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-minimized");
    if (saved !== null) {
      setIsMinimized(saved === "true");
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("sidebar-minimized", String(isMinimized));
  }, [isMinimized]);

  const toggleSidebar = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isMinimized, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

