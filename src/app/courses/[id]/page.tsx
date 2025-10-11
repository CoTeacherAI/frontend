"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Users,
  ArrowLeft,
  Upload,
  Sparkles,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/contexts/AuthContext";

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
  created_at: string;
  updated_at: string;
};

type MemberRow = { user_id: string; role: Role };
type MemberWithUsername = MemberRow & { username: string | null };

export default function CoursePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { user, /* profile, */ loading } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [members, setMembers] = useState<MemberWithUsername[]>([]);
  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [openAddMembers, setOpenAddMembers] = useState(false);

  type ChatMsg = { role: "user" | "assistant"; content: string };
  const [chat, setChat] = useState<ChatMsg[]>([
    { role: "assistant", content: "Hi! I’m your course AI. Ask me about this class." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const isOwner = useMemo(
    () => !!user && !!course && user.id === course.owner_id,
    [user, course]
  );
  const backHref = isOwner ? "/app/professor" : "/app/student";

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/auth/signin");
  }, [loading, user, router]);

  // Fetch course + members
  useEffect(() => {
    if (loading || !id) return;
    (async () => {
      setBusy(true);
      setErr(null);

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

      await loadMembers(String(id));

      setBusy(false);
    })();
  }, [loading, id]);

  const loadMembers = async (courseId: string) => {
    const { data: m, error: memErr } = await supabase
      .from("course_members")
      .select("user_id, role")
      .eq("course_id", courseId);

    if (memErr || !m) {
      setMembers([]);
      return;
    }
    const rows = m as MemberRow[];
    const ids = rows.map((r) => r.user_id);

    const usernameMap = new Map<string, string>();
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", ids);

      if (profs) {
        (profs as { id: string; username: string | null }[]).forEach((p) =>
          usernameMap.set(p.id, p.username ?? "")
        );
      }
    }
    setMembers(rows.map((r) => ({ ...r, username: usernameMap.get(r.user_id) ?? null })));
  };

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
        body: JSON.stringify({ courseId: id, messages: [...chat, userMsg] }),
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
            "This is a placeholder response. Connect `/api/course-chat` to your AI backend to get course-specific answers.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  if (busy) {
    return (
      <main className="mx-auto max-w-6xl px-4 pt-28 md:pt-32">
        <div className="rounded-2xl border border-white/15 bg-white/10 p-6">Loading course…</div>
      </main>
    );
  }

  if (err || !course) {
    return (
      <main className="mx-auto max-w-6xl px-4 pt-28 md:pt-32">
        <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
          <p className="text-red-200">{err ?? "Not found"}</p>
          <div className="mt-4">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 hover:border-white/40"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pt-28 md:pt-32">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-slate-300 hover:text-slate-100 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-4">
        {isOwner && <MaterialsPanel courseId={course.id} ownerId={course.owner_id} />}

        <section className={isOwner ? "lg:col-span-2 space-y-6" : "lg:col-span-3 space-y-6"}>
          <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-cyan-300" />
                {course.name}
              </h1>
              <span className="text-xs rounded-full border border-white/15 bg-white/5 px-2 py-0.5">
                {course.code}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm">
                  <Calendar className="h-4 w-4 text-cyan-300" />
                  {course.semester ? `${course.semester} ${course.year ?? ""}` : "No term"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm">
                  {typeof course.credits === "number" ? `${course.credits} credits` : "No credits"}
                </span>
              </div>
              {course.description ? (
                <p className="text-slate-300/90">{course.description}</p>
              ) : (
                <p className="text-slate-400">No description provided.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
            <div className="mb-3 flex items-center gap-2 text-slate-200">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              <span className="font-medium">Course AI Chat</span>
            </div>

            <div className="h-80 overflow-y-auto rounded-lg border border-white/10 bg-white/5 p-3 space-y-3">
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
                placeholder="Ask about this course…"
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
          </div>
        </section>

        <aside className="lg:col-span-1 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-300" />
              <h2 className="text-lg font-semibold">Members</h2>
            </div>

            {isOwner && (
              <button
                onClick={() => setOpenAddMembers(true)}
                className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-2 py-1 text-sm hover:border-white/40"
                title="Add members"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            )}
          </div>

          {members.length === 0 ? (
            <p className="text-slate-400 text-sm">No members yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {members.map((m) => (
                <li key={m.user_id} className="flex items-center justify-between">
                  <span className="text-slate-300">
                    {m.username && m.username.trim().length > 0 ? m.username : m.user_id}
                  </span>
                  <span className="text-xs rounded-full border border-white/15 bg-white/5 px-2 py-0.5">
                    {m.role}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {openAddMembers && isOwner && (
        <AddMembersModal
          courseId={course.id}
          existingIds={new Set(members.map((m) => m.user_id))}
          onClose={() => setOpenAddMembers(false)}
          onAdded={() => loadMembers(course.id)}
        />
      )}
    </main>
  );
}

/* ---------------- Materials Panel (owner-only; Supabase Storage) ---------------- */

function MaterialsPanel({ courseId, ownerId }: { courseId: string; ownerId: string }) {
  const { user } = useAuth();
  const isOwner = !!user && user.id === ownerId;

  type MaterialRow = {
    id: string;
    title: string | null;
    storage_path: string;
    owner_id: string;
    mime_type: string | null;
    bytes: number | null;
    created_at: string;
  };

  type CourseMaterial = {
    id: string;
    filename: string;
    storage_path: string;
    uploader_id: string;
    mime_type: string | null;
    bytes: number | null;
    created_at: string;
  };

  const BUCKET = "course-materials";

  const [files, setFiles] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [working, setWorking] = useState<Set<string>>(new Set());
  const [, setIndexing] = useState<string | null>(null);

  // --- make refresh stable and depend on courseId
  const refresh = useCallback(async () => {
    setLoading(true);
    setErr(null);

    const { data, error } = await supabase
      .from("course_materials")
      .select("id, title, storage_path, owner_id, mime_type, bytes, created_at")
      .eq("course_id", courseId)
      .order("created_at", { ascending: false });

    if (error) {
      setErr(error.message);
      setFiles([]);
      setLoading(false);
      return;
    }

    const rows = (data ?? []) as MaterialRow[];
    setFiles(
      rows.map((r) => ({
        id: r.id,
        filename: r.title ?? "file",
        storage_path: r.storage_path,
        uploader_id: r.owner_id,
        mime_type: r.mime_type,
        bytes: r.bytes,
        created_at: r.created_at,
      }))
    );
    setLoading(false);
  }, [courseId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  function slugName(name: string) {
    return name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").toLowerCase();
  }

  function fmtSize(bytes: number | null): string {
    if (bytes === null) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  async function handleUpload(evt: React.ChangeEvent<HTMLInputElement>) {
    const file = evt.target.files?.[0];
    if (!file || !isOwner || !user) return;

    setErr(null);
    setLoading(true);

    try {
      const rand =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`;

      const path = `${courseId}/${rand}--${slugName(file.name)}`;

      // 1) Upload to Supabase Storage
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });

      if (upErr) {
        setErr(`Storage upload error: ${upErr.message}`);
        return;
      }

      // 2) Insert DB row and get id from Postgres
      const { data: inserted, error: insErr } = await supabase
        .from("course_materials")
        .insert({
          course_id: courseId,
          owner_id: user.id,
          storage_path: path,
          title: file.name,
          mime_type: file.type || null,
          bytes: file.size,
        })
        .select("id")
        .single();

      if (insErr || !inserted?.id) {
        await supabase.storage.from(BUCKET).remove([path]).catch(() => undefined);
        setErr(`DB insert error: ${insErr?.message ?? "Unknown error"}`);
        return;
      }

      const materialId = inserted.id as string;

      // 3) Kick off indexing with the DB id
      setIndexing(materialId);
      const res = await fetch("/api/rag/index-material", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        setErr(`Indexing failed: ${msg || res.statusText}`);
        return;
      }

      await refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : JSON.stringify(e);
      setErr(msg);
    } finally {
      setLoading(false);
      setIndexing(null);
      if (evt.target) evt.target.value = "";
    }
  }

  async function download(path: string, filename: string) {
    setWorking((s) => new Set([...s, path]));
    try {
      const { data, error } = await supabase.storage.from(BUCKET).download(path);
      if (error || !data) throw error || new Error("Download failed");
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Download failed");
    } finally {
      setWorking((s) => {
        const n = new Set(s);
        n.delete(path);
        return n;
      });
    }
  }

  async function remove(file: CourseMaterial) {
    if (!confirm(`Delete "${file.filename}"?`)) return;
    setWorking((s) => new Set([...s, file.storage_path]));
    try {
      const { error: delObjErr } = await supabase.storage.from(BUCKET).remove([file.storage_path]);
      if (delObjErr) throw delObjErr;

      const { error: delRowErr } = await supabase
        .from("course_materials")
        .delete()
        .eq("id", file.id);
      if (delRowErr) throw delRowErr;

      setFiles((prev) => prev.filter((f) => f.id !== file.id));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setWorking((s) => {
        const n = new Set(s);
        n.delete(file.storage_path);
        return n;
      });
    }
  }

  if (!isOwner) return null;

  return (
    <section className="lg:col-span-1 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
      <div className="mb-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Upload className="h-5 w-5 text-cyan-300" />
          Materials
        </h2>
        <p className="text-sm text-slate-400">
          Upload PDFs, slides, docs—everything your AI should learn from.
        </p>
      </div>

      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/20 px-3 py-1.5 hover:border-white/40 transition">
        <Upload className="h-4 w-4" />
        <span>Upload materials</span>
        <input type="file" className="hidden" onChange={handleUpload} />
      </label>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-200">Upload history</h3>
          <button
            onClick={() => void refresh()}
            className="rounded-lg border border-white/20 px-2 py-1 text-xs hover:border-white/40"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </div>
        ) : err ? (
          <div className="text-xs text-red-200">{err}</div>
        ) : files.length === 0 ? (
          <div className="text-sm text-slate-400">No uploads yet.</div>
        ) : (
          <ul className="space-y-2">
            {files.map((f) => {
              const isBusy = working.has(f.storage_path);
              const size = fmtSize(f.bytes ?? null);
              return (
                <li key={f.id} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium text-slate-200 truncate">{f.filename}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(f.created_at).toLocaleString()} {size && `· ${size}`}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        disabled={isBusy}
                        onClick={() => void download(f.storage_path, f.filename)}
                        className="rounded-lg border border-white/20 px-2 py-1 hover:border-white/40 transition disabled:opacity-50"
                        title="Download"
                      >
                        {isBusy ? "…" : "Download"}
                      </button>
                      <button
                        disabled={isBusy}
                        onClick={() => void remove(f)}
                        className="rounded-lg border border-red-400/40 text-red-200 px-2 py-1 hover:border-red-400/70 transition disabled:opacity-50"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ---------------- Add Members Modal ---------------- */

function AddMembersModal({
  courseId,
  existingIds,
  onClose,
  onAdded,
}: {
  courseId: string;
  existingIds: Set<string>;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<
    { id: string; username: string | null; school_id: string | null }[]
  >([]);
  const [err, setErr] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);

  const runSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErr(null);
    setResults([]);
    if (!query.trim()) return;

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, school_id, role")
        .eq("role", "student")
        .ilike("school_id", `%${query.trim()}%`)
        .limit(20);

      if (error) {
        setErr(error.message);
      } else {
        const rows =
          (data as { id: string; username: string | null; school_id: string | null; role: string }[]) ||
          [];
        setResults(rows.map(({ id, username, school_id }) => ({ id, username, school_id })));
      }
    } catch {
      setErr("Search failed.");
    } finally {
      setSearching(false);
    }
  };

  const addStudent = async (userId: string) => {
    setErr(null);
    setAddingId(userId);
    try {
      const me = (await supabase.auth.getUser()).data.user?.id ?? null;
      const { error } = await supabase.from("course_members").insert({
        course_id: courseId,
        user_id: userId,
        role: "student",
        added_by: me,
      });

      if (error) {
        if (error.message.toLowerCase().includes("duplicate")) {
          setErr("That student is already a member of this course.");
        } else {
          setErr(error.message);
        }
      } else {
        onAdded();
      }
    } catch {
      setErr("Could not add student.");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(2,8,23,0.45)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add members by school ID</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-slate-300" />
          </button>
        </div>

        {err && (
          <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/15 px-3 py-2 text-sm text-red-200">
            {err}
          </div>
        )}

        <form onSubmit={runSearch} className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter school ID (e.g., S123456)…"
            className="flex-1 rounded-lg bg-white/5 border border-white/20 px-3 py-2 text-white outline-none focus:border-cyan-300"
          />
          <button
            type="submit"
            disabled={searching || !query.trim()}
            className="rounded-lg border border-white/20 px-4 py-2 hover:border-white/40 transition disabled:opacity-50"
          >
            {searching ? "Searching…" : "Search"}
          </button>
        </form>

        <div className="mt-4">
          {results.length === 0 && !searching ? (
            <p className="text-sm text-slate-400">No results yet. Try a search.</p>
          ) : (
            <ul className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5">
              {results.map((r) => {
                const already = existingIds.has(r.id);
                const disabled = already || addingId === r.id;
                return (
                  <li key={r.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <div className="font-medium text-slate-200">{r.username || r.id}</div>
                      <div className="text-xs text-slate-400">school_id: {r.school_id || "—"}</div>
                    </div>
                    <button
                      disabled={disabled}
                      onClick={() => void addStudent(r.id)}
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 transition ${
                        disabled
                          ? "border-white/10 text-slate-400 opacity-60"
                          : "border-white/20 hover:border-white/40"
                      }`}
                    >
                      {addingId === r.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Adding…
                        </>
                      ) : already ? (
                        "Added"
                      ) : (
                        "Add student"
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/20 px-4 py-2 hover:border-white/40 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}