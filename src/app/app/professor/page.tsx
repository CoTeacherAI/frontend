"use client";

import { GraduationCap, Users, Settings, BookOpen } from "lucide-react";

export default function ProfessorDashboard() {
  return (
    <div className="min-h-screen pt-24 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <GraduationCap className="h-7 w-7 text-cyan-300" />
        Professor Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-white/15 bg-white/10 p-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-cyan-300" />
            My Courses
          </h2>
          <p className="text-slate-300">Create and manage your courses.</p>
        </div>

        <div className="rounded-xl border border-white/15 bg-white/10 p-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Users className="h-5 w-5 text-cyan-300" />
            Students
          </h2>
          <p className="text-slate-300">View enrolled students and their progress.</p>
        </div>

        <div className="rounded-xl border border-white/15 bg-white/10 p-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-300" />
            AI Settings
          </h2>
          <p className="text-slate-300">Control your AI co-teacher’s behavior.</p>
        </div>
      </div>
    </div>
  );
}