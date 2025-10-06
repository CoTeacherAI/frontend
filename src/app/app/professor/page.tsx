"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Users,
  Settings,
  BookOpen,
  Plus,
  X,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Semester = "Fall" | "Spring" | "Summer" | "";

type Course = {
  id: string;
  owner_id: string;
  code: string;
  name: string;
  description: string | null;
  semester: Exclude<Semester, ""> | null; // stored null or "Fall|Spring|Summer"
  year: number | null;
  credits: number | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
};

export default function ProfessorDashboard() {
  const router = useRouter();
  const { user, userRole, loading } = useAuth();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEditFor, setOpenEditFor] = useState<Course | null>(null);
  const [openDeleteFor, setOpenDeleteFor] = useState<Course | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [fetching, setFetching] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth/signin");
    } else if (userRole !== "professor") {
      router.replace("/app");
    }
  }, [user, userRole, loading, router]);

  const canUsePage = useMemo(() => !!user && userRole === "professor", [user, userRole]);

  const loadCourses = async () => {
    if (!user) return;
    setFetching(true);
    setErr(null);
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("owner_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error(error);
      setErr("Failed to load courses");
    } else {
      setCourses((data as Course[]) ?? []);
    }
    setFetching(false);
  };

  useEffect(() => {
    if (!canUsePage) return;
    void loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUsePage]);

  return (
    <div className="min-h-screen pt-24 px-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-cyan-300" />
          Professor Dashboard
        </h1>

        {canUsePage && (
          <button
            onClick={() => setOpenCreate(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-400/90 text-slate-900 font-semibold px-4 py-2 hover:bg-cyan-300 transition"
          >
            <Plus className="h-4 w-4" />
            Create course
          </button>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
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

        <div className="rounded-xl border border-white/15 bg-white/10 p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-300" />
            AI Settings
          </h2>
          <p className="text-slate-300">Control your AI co-teacher behavior.</p>
        </div>
      </div>

      {/* Courses list */}
      <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your courses</h3>
          <button
            onClick={() => setOpenCreate(true)}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-1.5 hover:border-white/40 transition"
          >
            <Plus className="h-4 w-4" />
            New
          </button>
        </div>

        {err && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/15 text-red-200 px-3 py-2 text-sm">
            {err}
          </div>
        )}

        {fetching ? (
          <div className="text-slate-300">Loading…</div>
        ) : courses.length === 0 ? (
          <div className="text-slate-300">
            No courses yet. Click <span className="text-cyan-300 font-medium">Create course</span> to add your first.
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c) => (
              <li
                key={c.id}
                className="relative rounded-xl border border-white/15 bg-white/5 p-4 hover:bg-white/10 transition"
              >
                {/* Full-card click target */}
                <Link
                  href={`/courses/${c.id}`}
                  className="absolute inset-0"
                  aria-label={`Open ${c.name}`}
                />

                {/* Content stays above the click overlay */}
                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs rounded-full border border-white/15 bg-white/5 px-2 py-0.5">
                        {c.code}
                      </div>
                      {c.semester && c.year ? (
                        <div className="text-xs text-slate-400">
                          {c.semester} {c.year}
                        </div>
                      ) : null}
                    </div>
                    <h4 className="mt-2 font-semibold">{c.name}</h4>
                  </div>

                  {/* Action buttons remain clickable via z-index */}
                  <div className="relative z-10 flex items-center gap-2">
                    <button
                      onClick={() => setOpenEditFor(c)}
                      className="rounded-lg border border-white/15 hover:border-white/40 px-2 py-1 transition"
                      title="Edit course"
                      aria-label={`Edit ${c.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setOpenDeleteFor(c)}
                      className="rounded-lg border border-red-400/30 text-red-300 hover:border-red-400/60 px-2 py-1 transition"
                      title="Delete course"
                      aria-label={`Delete ${c.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {c.description ? (
                  <p className="relative z-10 mt-2 text-sm text-slate-300 line-clamp-3">{c.description}</p>
                ) : (
                  <p className="relative z-10 mt-2 text-sm text-slate-400">No description</p>
                )}

                <div className="relative z-10 mt-3 text-sm text-slate-400">
                  {typeof c.credits === "number" ? `${c.credits} credits` : "—"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modals */}
      {openCreate && canUsePage && (
        <CreateCourseModal
          onClose={() => setOpenCreate(false)}
          onCreated={() => {
            setOpenCreate(false);
            void loadCourses();
          }}
        />
      )}

      {openEditFor && canUsePage && (
        <EditCourseModal
          course={openEditFor}
          onClose={() => setOpenEditFor(null)}
          onUpdated={() => {
            setOpenEditFor(null);
            void loadCourses();
          }}
        />
      )}

      {openDeleteFor && canUsePage && (
        <ConfirmDeleteModal
          course={openDeleteFor}
          onClose={() => setOpenDeleteFor(null)}
          onDeleted={() => {
            setOpenDeleteFor(null);
            void loadCourses();
          }}
        />
      )}
    </div>
  );
}

/** ---------- Create Course ---------- */
function CreateCourseModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { user } = useAuth();

  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [semester, setSemester] = useState<Semester>("");
  const [year, setYear] = useState<string>("");
  const [credits, setCredits] = useState<string>("3");

  const [busy, setBusy] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setErr(null);

    if (!name.trim() || !code.trim()) {
      setErr("Course name and code are required");
      return;
    }

    setBusy(true);
    try {
      const { data: course, error: courseErr } = await supabase
        .from("courses")
        .insert({
          owner_id: user.id,
          name: name.trim(),
          code: code.trim().toUpperCase(),
          description: description.trim() || null,
          semester: semester ? (semester as Exclude<Semester, "">) : null,
          year: year ? Number(year) : null,
          credits: credits ? Number(credits) : null,
        })
        .select("*")
        .single();

      if (courseErr) {
        setErr(courseErr.message);
        setBusy(false);
        return;
      }

      const { error: memErr } = await supabase.from("course_members").insert({
        course_id: course.id,
        user_id: user.id,
        role: "owner",
        added_by: user.id,
      });
      if (memErr) console.warn("Owner membership insert warning:", memErr.message);

      onCreated();
    } catch {
      setErr("Unexpected error creating course");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalShell title="Create a course" onClose={onClose}>
      {err && <AlertError message={err} />}
      <form onSubmit={handleCreate} className="space-y-4">
        <TwoCol>
          <Field label="Course name">
            <Input value={name} onChange={setName} placeholder="Operating Systems" required />
          </Field>
          <Field label="Course code">
            <Input value={code} onChange={setCode} placeholder="CS223" required />
          </Field>
        </TwoCol>

        <Field label="Description">
          <Textarea value={description} onChange={setDescription} placeholder="Brief overview…" />
        </Field>

        <ThreeCol>
          <Field label="Semester">
            <Select<Semester>
              value={semester}
              onChange={setSemester}
              options={["", "Fall", "Spring", "Summer"] as const}
            />
          </Field>
          <Field label="Year">
            <Input value={year} onChange={(v) => setYear(v.replace(/[^\d]/g, ""))} placeholder="2025" />
          </Field>
          <Field label="Credits">
            <Input value={credits} onChange={(v) => setCredits(v.replace(/[^\d]/g, ""))} placeholder="3" />
          </Field>
        </ThreeCol>

        <FooterButtons
          onCancel={onClose}
          primaryLabel={busy ? "Creating…" : "Create course"}
          primaryDisabled={busy}
        />
      </form>
    </ModalShell>
  );
}

/** ---------- Edit Course ---------- */
function EditCourseModal({
  course,
  onClose,
  onUpdated,
}: {
  course: Course;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [name, setName] = useState<string>(course.name);
  const [code, setCode] = useState<string>(course.code);
  const [description, setDescription] = useState<string>(course.description ?? "");
  const [semester, setSemester] = useState<Semester>((course.semester ?? "") as Semester);
  const [year, setYear] = useState<string>(course.year ? String(course.year) : "");
  const [credits, setCredits] = useState<string>(course.credits ? String(course.credits) : "");

  const [busy, setBusy] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !code.trim()) {
      setErr("Course name and code are required");
      return;
    }

    setBusy(true);
    setErr(null);
    try {
      const { error } = await supabase
        .from("courses")
        .update({
          name: name.trim(),
          code: code.trim().toUpperCase(),
          description: description.trim() || null,
          semester: semester ? (semester as Exclude<Semester, "">) : null,
          year: year ? Number(year) : null,
          credits: credits ? Number(credits) : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", course.id);

      if (error) {
        setErr(error.message);
      } else {
        onUpdated();
      }
    } catch {
      setErr("Unexpected error updating course");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalShell title="Edit course" onClose={onClose}>
      {err && <AlertError message={err} />}
      <form onSubmit={handleUpdate} className="space-y-4">
        <TwoCol>
          <Field label="Course name">
            <Input value={name} onChange={setName} />
          </Field>
          <Field label="Course code">
            <Input value={code} onChange={setCode} />
          </Field>
        </TwoCol>

        <Field label="Description">
          <Textarea value={description} onChange={setDescription} />
        </Field>

        <ThreeCol>
          <Field label="Semester">
            <Select<Semester>
              value={semester}
              onChange={setSemester}
              options={["", "Fall", "Spring", "Summer"] as const}
            />
          </Field>
          <Field label="Year">
            <Input value={year} onChange={(v) => setYear(v.replace(/[^\d]/g, ""))} />
          </Field>
          <Field label="Credits">
            <Input value={credits} onChange={(v) => setCredits(v.replace(/[^\d]/g, ""))} />
          </Field>
        </ThreeCol>

        <FooterButtons
          onCancel={onClose}
          primaryLabel={busy ? "Saving…" : "Save changes"}
          primaryDisabled={busy}
        />
      </form>
    </ModalShell>
  );
}

/** ---------- Confirm Delete ---------- */
function ConfirmDeleteModal({
  course,
  onClose,
  onDeleted,
}: {
  course: Course;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [busy, setBusy] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  const handleDelete = async () => {
    setBusy(true);
    setErr(null);

    try {
      const { error } = await supabase.from("courses").delete().eq("id", course.id);
      if (error) {
        setErr(error.message);
      } else {
        onDeleted();
      }
    } catch {
      setErr("Unexpected error deleting course");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell title="Delete course" onClose={onClose}>
      {err && <AlertError message={err} />}
      <p className="text-slate-300">
        Are you sure you want to delete <span className="font-semibold">{course.name}</span>? This
        action cannot be undone.
      </p>

      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-white/20 px-4 py-2 hover:border-white/40 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg border border-red-400/40 text-red-200 px-4 py-2 hover:border-red-400/70 transition disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Delete
        </button>
      </div>
    </ModalShell>
  );
}

/** ---------- Tiny UI helpers ---------- */

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(2,8,23,0.45)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-slate-300" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-slate-300">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-lg bg-white/5 border border-white/20 px-3 py-2 text-white outline-none focus:border-cyan-300"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full rounded-lg bg-white/5 border border-white/20 px-3 py-2 text-white outline-none focus:border-cyan-300 resize-none"
    />
  );
}

/** Typed select without any */
function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full rounded-lg bg-white/5 border border-white/20 px-3 py-2 text-white outline-none focus:border-cyan-300"
    >
      {options.map((opt) => (
        <option key={opt || "empty"} value={opt} className="bg-slate-900 text-white">
          {opt || "Select"}
        </option>
      ))}
    </select>
  );
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-4">{children}</div>;
}

function ThreeCol({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-3 gap-4">{children}</div>;
}

function FooterButtons({
  onCancel,
  primaryLabel,
  primaryDisabled,
}: {
  onCancel: () => void;
  primaryLabel: string;
  primaryDisabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-white/20 px-4 py-2 hover:border-white/40 transition"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={primaryDisabled}
        className="rounded-lg bg-cyan-400/90 text-slate-900 font-semibold px-4 py-2 hover:bg-cyan-300 transition disabled:opacity-50"
      >
        {primaryLabel}
      </button>
    </div>
  );
}

function AlertError({ message }: { message: string }) {
  return (
    <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/15 text-red-200 px-3 py-2 text-sm">
      {message}
    </div>
  );
}