"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
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
        <div className="rounded-2xl border border-stone-200/60 bg-white/70 p-6 text-stone-900">
          Loading course…
        </div>
      </main>
    );
  }

  if (err || !course) {
    return (
      <main className="mx-auto max-w-7xl px-4 pt-24 pb-28">
        <div className="rounded-2xl border border-stone-200/60 bg-white/70 p-6">
          <p className="text-red-600">{err ?? "Not found"}</p>
          <div className="mt-4">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 hover:border-stone-400 text-stone-700"
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
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-800 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* New layout: LEFT = dropdowns (details/materials/members), RIGHT = big chat */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN */}
        <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
          {/* Course details dropdown */}
          <CourseDetailsDropdown
            course={{
              description: course.description,
              semester: course.semester,
              year: course.year,
              credits: course.credits,
            }}
            courseId={course.id}
          />

          {/* Materials dropdown (unchanged component) */}
          {isOwner ? <MaterialsPanel courseId={course.id} ownerId={course.owner_id} /> : null}

          {/* Members dropdown (updated component below) */}
          <MembersPanel courseId={course.id} isOwner={isOwner} />
        </aside>

        {/* RIGHT COLUMN */}
        <section className="lg:col-span-8 xl:col-span-9">
          <ChatPanel courseId={course.id} />
        </section>
      </div>
    </main>
  );
}

/* ---------- Local: Course Details dropdown ---------- */

function CourseDetailsDropdown({
  course,
  courseId,
}: {
  course: {
    description: string | null;
    semester: Semester | null;
    year: number | null;
    credits: number | null;
  };
  courseId: string;
}) {
  const storageKey = `course_details_open_${courseId}`;
  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return true; // default open
    const saved = window.localStorage.getItem(storageKey);
    return saved === null ? true : saved === "1";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, open ? "1" : "0");
    }
  }, [open, storageKey]);

  return (
    <section className="rounded-2xl border border-stone-200/60 bg-white/70 backdrop-blur-xl">
      {/* Header / Toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4"
        aria-expanded={open}
        aria-controls={`course-details-${courseId}`}
      >
        <div className="text-left">
          <div className="text-base font-semibold text-stone-900">Course details</div>
          <div className="text-xs text-stone-600">
            Overview & description
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 transition-transform text-stone-700 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Body */}
      <div
        id={`course-details-${courseId}`}
        className={`px-5 pb-5 transition-[grid-template-rows] ${
          open ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {course.description ? (
            <p className="text-stone-700">{course.description}</p>
          ) : (
            <p className="text-stone-600 text-sm">No description provided.</p>
          )}

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-stone-200/60 bg-white/60 p-3">
              <div className="text-xs text-stone-600">Semester</div>
              <div className="font-medium text-stone-900">
                {course.semester ? `${course.semester} ${course.year ?? ""}` : "—"}
              </div>
            </div>
            <div className="rounded-lg border border-stone-200/60 bg-white/60 p-3">
              <div className="text-xs text-stone-600">Credits</div>
              <div className="font-medium text-stone-900">
                {typeof course.credits === "number" ? course.credits : "—"}
              </div>
            </div>
            <div className="rounded-lg border border-stone-200/60 bg-white/60 p-3">
              <div className="text-xs text-stone-600">Access</div>
              <div className="font-medium text-stone-900">Members-only</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}