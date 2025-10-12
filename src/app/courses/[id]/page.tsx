"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/contexts/AuthContext";
import ChatPanel from "@/components/course/ChatPanel";
import MaterialsPanel from "@/components/course/MaterialsPanel";
import MembersPanel from "@/components/course/MembersPanel";

type Semester = "Fall" | "Spring" | "Summer";

export type Course = {
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

export default function CoursePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const isOwner = useMemo(
    () => Boolean(user && course && user.id === course.owner_id),
    [user, course]
  );

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/auth/signin");
  }, [loading, user, router]);

  const loadCourse = useCallback(async () => {
    if (!id) return;
    setBusy(true);
    setErr(null);

    const { data: c, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !c) {
      setErr(error?.message ?? "Course not found or you don’t have access.");
      setCourse(null);
    } else {
      setCourse(c as Course);
    }
    setBusy(false);
  }, [id]);

  useEffect(() => {
    if (loading || !id) return;
    void loadCourse();
  }, [loading, id, loadCourse]);

  if (busy) {
    return (
      <main className="mx-auto max-w-7xl px-4 pt-24 pb-28">
        <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
          Loading course…
        </div>
      </main>
    );
  }

  if (err || !course) {
    return (
      <main className="mx-auto max-w-7xl px-4 pt-24 pb-28">
        <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
          <p className="text-red-200">{err ?? "Not found"}</p>
          <div className="mt-4">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 hover:border-white/40"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const backHref = isOwner ? "/app/professor" : "/app/student";

  return (
    <main className="mx-auto max-w-[120rem] px-4 pt-24 pb-28">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-slate-300 hover:text-slate-100 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <header className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-cyan-300" />
            {course.name}
          </h1>
          <span className="text-xs rounded-full border border-white/15 bg-white/5 px-2 py-0.5">
            {course.code}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1">
            <Calendar className="h-4 w-4 text-cyan-300" />
            {course.semester ? `${course.semester} ${course.year ?? ""}` : "No term"}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1">
            {typeof course.credits === "number" ? `${course.credits} credits` : "No credits"}
          </span>
        </div>
        {course.description ? (
          <p className="mt-3 text-slate-300/90">{course.description}</p>
        ) : null}
      </header>

      {/* Layout: big chat + slim sidebar */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12 mb-24">
        <section className="lg:col-span-8 xl:col-span-9">
          <ChatPanel courseId={course.id} />
        </section>

        <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
          {isOwner ? <MaterialsPanel courseId={course.id} ownerId={course.owner_id} /> : null}
          <MembersPanel courseId={course.id} isOwner={isOwner} />
        </aside>
      </div>
    </main>
  );
}