"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AddMembersModal({
  courseId,
  onClose,
  onAdded,
}: {
  courseId: string;
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

  async function runSearch(e?: React.FormEvent) {
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
          (data as {
            id: string;
            username: string | null;
            school_id: string | null;
            role: string;
          }[]) || [];
        setResults(rows.map(({ id, username, school_id }) => ({ id, username, school_id })));
      }
    } catch {
      setErr("Search failed.");
    } finally {
      setSearching(false);
    }
  }

  async function addStudent(userId: string) {
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
  }

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

        {err ? (
          <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/15 px-3 py-2 text-sm text-red-200">
            {err}
          </div>
        ) : null}

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
                const disabled = addingId === r.id;
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
