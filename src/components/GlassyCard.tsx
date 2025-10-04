import type { ReactNode } from "react";

export function GlassyCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={
        "rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] " +
        className
      }
    >
      {children}
    </div>
  );
}