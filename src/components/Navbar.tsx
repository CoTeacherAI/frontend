"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

export function Navbar() {
  const router = useRouter();
  const { user, username, loading, signOut } = useAuth(); // username comes from AuthContext

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/"); // back to landing page
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  const homeHref = user ? "/app" : "/";

  return (
    <div className="fixed top-4 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-3">
        <div className="flex items-center justify-between rounded-full border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] px-4 py-2">
          {/* Logo / Home link */}
          <Link href={homeHref} className="font-semibold tracking-tight">
            <span className="text-lg md:text-xl">
              CoTeacher <span className="text-cyan-300">AI</span>
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* While loading, keep layout stable */}
            {loading ? (
              <div className="h-9 w-28 rounded-full bg-white/10 border border-white/15 animate-pulse" />
            ) : user ? (
              <>
                {/* Username pill */}
                <span className="hidden sm:inline rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-slate-200">
                  {username ?? user.email?.split("@")[0] ?? "you"}
                </span>

                {/* Sign out button */}
                <button
                  onClick={handleSignOut}
                  className="rounded-full px-4 py-2 text-sm md:text-[0.95rem] border border-white/20 hover:border-white/40 transition flex items-center gap-2"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}