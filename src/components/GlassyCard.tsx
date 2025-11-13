import type { ReactNode } from "react";

export function GlassyCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={
        "rounded-2xl border border-stone-200/60 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] " +
        className
      }
    >
      {children}
    </div>
  );
}