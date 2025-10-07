"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  BookOpen,
  Users,
  Loader2,
  X,
  MessageSquareText,
} from "lucide-react";

type Semester = "Fall" | "Spring" | "Summer";
type Role = "owner" | "ta" | "student";

type Course = {
  id: string;
  owner_id: string;
  code: string;
  name: string;
  description: string | null;
  semester: Semester | null;
  year: number | null;
  credits: number | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
};

type MemberRow = { user_id: string; role: Role };
type MemberWithUsername = MemberRow & { username: string | null };

export default function StudentDashboard() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [fetching, setFetching] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  // Chat modal state
  const [chatFor, setChatFor] = useState<Course | null>(null);
  // Members modal state
  const [membersFor, setMembersFor] = useState<Course | null>(null);

  const isStudent = useMemo(() => profile?.role === "student", [profile?.role]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth/signin");
      return;
    }
    if (!isStudent) {
      // If not a student, bounce to generic /app (your role router can send them on)
      router.replace("/app");
      return;
    }
    void loadMyCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, isStudent]);

  async function loadMyCourses() {
    if (!user) return;
    setFetching(true);
    setErr(null);
  
    // Use the inner join for filtering, but select no columns from course_members.
    const { data, error } = await supabase
      .from("courses")
      .select(`
        id, owner_id, code, name, description, semester, year, credits, archived, created_at, updated_at,
        course_members!inner()
      `)
      .eq("course_members.user_id", user.id)
      .order("updated_at", { ascending: false });
  
    if (error) {
      console.error("courses join error:", error);
      setErr(`Failed to load your courses (courses): ${error.message}`);
      setFetching(false);
      return;
    }
  
    setCourses((data as Course[]) ?? []);
    setFetching(false);
  }

  return (
    <div className="min-h-screen pt-24 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <BookOpen className="h-7 w-7 text-cyan-300" />
        Student Dashboard
      </h1>

      {/* Courses */}
      <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Your courses</h3>
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
            No courses yet. Your professor can add you by school ID.
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c) => (
              <li
                key={c.id}
                className="relative rounded-xl border border-white/15 bg-white/5 p-4"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
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

                  {/* Small actions (top-right) */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMembersFor(c)}
                      className="rounded-lg border border-white/15 hover:border-white/40 px-2 py-1 text-sm transition"
                      title="Members"
                      aria-label={`View members for ${c.name}`}
                    >
                      <Users className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setChatFor(c)}
                      className="rounded-lg border border-white/15 hover:border-white/40 px-2 py-1 text-sm transition"
                      title="Chat"
                      aria-label={`Chat for ${c.name}`}
                    >
                      <MessageSquareText className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Description — fixed area with ellipsis */}
                <p className="mt-2 text-sm text-slate-300 line-clamp-3 min-h-[3.5rem]">
                  {c.description || "No description"}
                </p>

                {/* Bottom fixed row */}
                <div className="mt-6 relative h-8">
                  {/* Credits bottom-left */}
                  <div className="absolute left-0 bottom-0 text-sm text-slate-400">
                    {typeof c.credits === "number" ? `${c.credits} credits` : "—"}
                  </div>
                  {/* View bottom-right */}
                  <div className="absolute right-0 bottom-0">
                    <Link
                      href={`/courses/${c.id}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-1.5 hover:border-white/40 transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modals */}
      {chatFor && (
        <CourseChatModal
          course={chatFor}
          onClose={() => setChatFor(null)}
        />
      )}

      {membersFor && (
        <MembersModal
          course={membersFor}
          onClose={() => setMembersFor(null)}
        />
      )}
    </div>
  );
}

/* ---------------- Course Chat Modal (per course) ---------------- */

function CourseChatModal({
  course,
  onClose,
}: {
  course: Course;
  onClose: () => void;
}) {
  type ChatMsg = { role: "user" | "assistant"; content: string };
  const [chat, setChat] = useState<ChatMsg[]>([
    { role: "assistant", content: `You’re chatting with the AI for ${course.name}.` },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: ChatMsg = { role: "user", content: input.trim() };
    setChat((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/course-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, messages: [...chat, userMsg] }),
      });
      if (!res.ok) throw new Error("Backend not wired");
      const data = (await res.json()) as { reply: string };
      setChat((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Demo response: hook this up to your AI backend (/api/course-chat) to get course-aware help.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <ModalShell title={`AI Chat — ${course.code}`} onClose={onClose}>
      <div className="h-72 overflow-y-auto rounded-lg border border-white/10 bg-white/5 p-3 space-y-3">
        {chat.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
              m.role === "assistant"
                ? "bg-white/10 border border-white/15"
                : "ml-auto bg-cyan-500/20 border border-cyan-400/30"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${course.name}…`}
          className="flex-1 rounded-lg bg-white/5 border border-white/20 px-3 py-2 text-white outline-none focus:border-cyan-300"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="rounded-lg bg-cyan-400/90 px-4 py-2 font-semibold text-slate-900 transition hover:bg-cyan-300 disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </form>
    </ModalShell>
  );
}

/* ---------------- Members Modal (read-only for students) ---------------- */

function MembersModal({
  course,
  onClose,
}: {
  course: Course;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<MemberWithUsername[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr(null);

      const { data: m, error: memErr } = await supabase
        .from("course_members")
        .select("user_id, role")
        .eq("course_id", course.id);

      if (memErr || !m) {
        setErr(memErr?.message ?? "Failed to load members.");
        setLoading(false);
        return;
      }

      const rows = m as MemberRow[];
      const ids = rows.map((r) => r.user_id);

      const usernameMap = new Map<string, string>();
      if (ids.length) {
        // Try to fetch usernames; if RLS blocks it, fall back to IDs
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, username")
          .in("id", ids);

        if (profs) {
          for (const p of profs as { id: string; username: string | null }[]) {
            usernameMap.set(p.id, p.username ?? "");
          }
        }
      }

      const withNames: MemberWithUsername[] = rows.map((r) => ({
        ...r,
        username: usernameMap.get(r.user_id) ?? null,
      }));
      setMembers(withNames);
      setLoading(false);
    };

    void load();
  }, [course.id]);

  return (
    <ModalShell title={`Members — ${course.code}`} onClose={onClose}>
      {err && (
        <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/15 px-3 py-2 text-sm text-red-200">
          {err}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-slate-300">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : members.length === 0 ? (
        <p className="text-slate-400 text-sm">No members yet.</p>
      ) : (
        <ul className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5">
          {members.map((m) => (
            <li key={m.user_id} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="text-slate-200">
                {m.username && m.username.trim() ? m.username : m.user_id}
              </span>
              <span className="text-xs rounded-full border border-white/15 bg-white/5 px-2 py-0.5">
                {m.role}
              </span>
            </li>
          ))}
        </ul>
      )}
    </ModalShell>
  );
}

/* ---------------- Reusable Modal Shell ---------------- */

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
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(2,8,23,0.45)]">
        <div className="mb-4 flex items-center justify-between">
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
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/20 px-4 py-2 hover:border-white/40 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}