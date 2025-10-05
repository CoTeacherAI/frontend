"use client";

import { BookOpen, Sparkles, Users } from "lucide-react";

export default function StudentDashboard() {
  return (
    <div className="min-h-screen pt-24 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <BookOpen className="h-7 w-7 text-cyan-300" />
        Student Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-white/15 bg-white/10 p-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-cyan-300" />
            My Courses
          </h2>
          <p className="text-slate-300">View and access your enrolled courses.</p>
        </div>

        <div className="rounded-xl border border-white/15 bg-white/10 p-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-300" />
            AI Tutor
          </h2>
          <p className="text-slate-300">Chat with your AI assistant for study help.</p>
        </div>

        <div className="rounded-xl border border-white/15 bg-white/10 p-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Users className="h-5 w-5 text-cyan-300" />
            Study Groups
          </h2>
          <p className="text-slate-300">Collaborate and discuss with classmates.</p>
        </div>
      </div>
    </div>
  );
}