"use client";
import Link from "next/link";

export function Navbar() {
  return (
    <div className="fixed top-4 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-3">
        <div className="flex items-center justify-between rounded-full border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] px-4 py-2">
          <Link href="/" className="font-semibold tracking-tight">
            <span className="text-lg md:text-xl">
              CoTeacher <span className="text-cyan-300">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/auth/signin"
              className="rounded-full px-4 py-2 text-sm md:text-[0.95rem] border border-white/20 hover:border-white/40 transition"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-full px-4 py-2 text-sm md:text-[0.95rem] bg-cyan-400/90 text-slate-900 font-medium hover:bg-cyan-300 transition"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}