import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductSidebar } from "@/components/ProductSidebar";
import { MainContent } from "@/components/MainContent";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import "./globals.css";
import SiteFooter from "@/components/site-footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh relative antialiased text-stone-900">
        {/* Background gradient - warm light tones */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-orange-50/30 to-amber-50/20" />
        {/* Subtle warm tint overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 via-transparent to-amber-100/15" />
        {/* Warm glow layers - soft orange/amber */}
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1200px_600px_at_50%_-10%,rgba(251,146,60,0.08),transparent),radial-gradient(800px_400px_at_70%_10%,rgba(245,158,11,0.06),transparent)]" />

        {/* App shell */}
        <AuthProvider>
          <SidebarProvider>
            <div className="relative flex min-h-dvh flex-col">
              <Navbar />
              <div className="flex flex-1 relative">
                <ProductSidebar />
                <MainContent>{children}</MainContent>
              </div>
              <SiteFooter />
            </div>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}