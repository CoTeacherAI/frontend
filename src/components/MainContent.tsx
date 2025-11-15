"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useMemo } from "react";

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isMinimized } = useSidebar();

  // Check if sidebar should be visible
  const sidebarVisible = useMemo(() => {
    if (!user) return false;
    return pathname?.startsWith("/products/");
  }, [user, pathname]);

  const marginLeft = useMemo(() => {
    if (!sidebarVisible) return "ml-0";
    return isMinimized ? "ml-0" : "ml-0 lg:ml-64";
  }, [sidebarVisible, isMinimized]);

  return (
    <main className={`flex-1 transition-all duration-300 ${marginLeft}`}>
      {children}
    </main>
  );
}

