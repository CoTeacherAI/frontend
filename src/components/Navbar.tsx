"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, GraduationCap, BookOpen } from "lucide-react";

export function Navbar() {
  const { user, userRole, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-3">
        <div className="flex items-center justify-between rounded-full border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] px-4 py-2">
          <Link href={user ? "/app" : "/"} className="font-semibold tracking-tight">
            <span className="text-lg md:text-xl">
              CoTeacher <span className="text-cyan-300">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-slate-700/50 p-2">
                    {userRole === 'professor' ? (
                      <GraduationCap className="h-4 w-4" />
                    ) : (
                      <BookOpen className="h-4 w-4" />
                    )}
                  </div>
                  <div className="hidden md:block">
                    <span className="text-sm text-slate-200">
                      {user.email}
                    </span>
                    <span className="text-xs text-slate-400 block">
                      {userRole === 'professor' ? 'Professor' : 'Student'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="rounded-full px-4 py-2 text-sm md:text-[0.95rem] border border-white/20 hover:border-white/40 transition flex items-center gap-2"
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