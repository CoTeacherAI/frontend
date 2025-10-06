"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Calendar, GraduationCap, Hash, Users, Settings, Sparkles, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/contexts/AuthContext";

type Semester = "Fall" | "Spring" | "Summer";
type Course = {
  id: string;
  owner_id: string;
  code: string;
  name: string;
  description: string | null;
  semester: Semester | null;
  year: number | null;
  credits: number | null;
  created_at: string;
  updated_at: string;
};

type MemberRow = {
  user_id: string;
  role: "owner" | "ta" | "student";
  // You can expand to include profile.username if you’ve set up a FK relationship
  // and a select like: .select("..., profiles!course_members_user_id_fkey(username)")
  // For now we’ll just show id/role.
};

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const { loading } = useAuth(); // ensures we wait for session

  const [course, setCourse] = useState<Course | null>(null);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setBusy(true);
      setErr(null);

      // 1) Load the course (RLS: must be owner/member to see it)
      const { data: c, error: courseErr } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (courseErr || !c) {
        setErr(courseErr?.message ?? "Course not found or you don’t have access.");
        setBusy(false);
        return;
      }
      setCourse(c as Course);

      // 2) Load a small member list (optional)
      const { data: m, error: memErr } = await supabase
        .from("course_members")
        .select("user_id, role")
        .eq("course_id", id)
        .limit(12);

      if (!memErr && m) setMembers(m as MemberRow[]);

      setBusy(false);
    };

    // wait for auth hydrate, then fetch
    if (!loading) void load();
  }, [id, loading]);

  if (busy) {
    return (
      <main className="mx-auto max-w-5xl px-4 pt-28 md:pt-32">
        <div className="rounded-2xl border border-white/15 bg-white/10 p-6">Loading course…</div>
      </main>
    );
  }

  if (err || !course) {
    return (
      <main className="mx-auto max-w-5xl px-4 pt-28 md:pt-32">
        <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
          <p className="text-red-200">{err ?? "Not found"}</p>
          <div className="mt-4">
            <Link href="/app/professor" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 hover:border-white/40">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pt-28 md:pt-32">
      <Link href="/app/professor" className="inline-flex items-center gap-2 text-slate-300 hover:text-slate-100 transition">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-cyan-300" />
            {course.name}
          </h1>
          <span className="text-xs rounded-full border border-white/15 bg-white/5 px-2 py-0.5">
            {course.code}
          </span>
        </div>

        {course.description && (
          <p className="mt-3 text-slate-300/90">{course.description}</p>
        )}

        {/* Meta */}
        <div className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-200">
              <GraduationCap className="h-4 w-4 text-cyan-300" />
              <span className="font-medium">Department</span>
            </div>
            <div className="mt-1 text-slate-300/90">Computer Science</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-200">
              <Calendar className="h-4 w-4 text-cyan-300" />
              <span className="font-medium">Term</span>
            </div>
            <div className="mt-1 text-slate-300/90">
              {course.semester ? `${course.semester} ${course.year ?? ""}` : "—"}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-200">
              <Hash className="h-4 w-4 text-cyan-300" />
              <span className="font-medium">Credits</span>
            </div>
            <div className="mt-1 text-slate-300/90">{course.credits ?? "—"}</div>
          </div>
        </div>

        {/* Sections */}
        <div className="mt-6 grid lg:grid-cols-3 gap-5">
          {/* Overview */}
          <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/5 p-4 md:p-5">
            <div className="flex items-center gap-2 text-slate-200 mb-2">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              <span className="font-medium">Overview</span>
            </div>
            <p className="text-slate-300/90">
              Welcome to <strong>{course.name}</strong>. Upload materials, manage members, and
              enable the course-tuned AI. (Materials & AI coming soon.)
            </p>
          </div>

          {/* Members */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:p-5">
            <div className="flex items-center gap-2 text-slate-200 mb-2">
              <Users className="h-4 w-4 text-cyan-300" />
              <span className="font-medium">Members</span>
            </div>
            {members.length === 0 ? (
              <p className="text-slate-400 text-sm">No members yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {members.map((m) => (
                  <li key={m.user_id} className="flex items-center justify-between">
                    <span className="text-slate-300">{m.user_id}</span>
                    <span className="text-xs rounded-full border border-white/15 bg-white/5 px-2 py-0.5">
                      {m.role}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Settings hint (professors/owners will see the page via RLS) */}
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 md:p-5">
          <div className="flex items-center gap-2 text-slate-200 mb-2">
            <Settings className="h-4 w-4 text-cyan-300" />
            <span className="font-medium">Course Settings</span>
          </div>
          <p className="text-slate-300/90 text-sm">
            Edit course details from your dashboard. Student management & AI settings will live here
            soon.
          </p>
        </div>
      </div>
    </main>
  );
}