import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/app/contexts/AuthContext";
import "./globals.css";
import SiteFooter from "@/components/site-footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh relative antialiased text-white">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />
        {/* Subtle glow layers */}
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1200px_600px_at_50%_-10%,rgba(56,189,248,0.15),transparent),radial-gradient(800px_400px_at_70%_10%,rgba(168,85,247,0.12),transparent)]" />

        {/* App shell */}
        <AuthProvider>
          <div className="relative flex min-h-dvh flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}