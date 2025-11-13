"use client";

import { useState } from "react";
import { Loader2, X, Search, UserPlus, User } from "lucide-react";
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
      {/* Backdrop - darker and more blurred */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal - more opaque background */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-stone-200/60 bg-white/95 backdrop-blur-xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-400/10 p-2">
              <UserPlus className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-stone-900">Add Students</h3>
              <p className="text-sm text-stone-600">Search by school ID to add members</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-stone-100 transition text-stone-600 hover:text-stone-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error message */}
        {err ? (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        {/* Search form */}
        <form onSubmit={runSearch} className="mb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter school ID (e.g., S123456)…"
                className="w-full rounded-lg border border-stone-300 bg-white pl-10 pr-4 py-3 text-stone-900 placeholder:text-stone-500 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={searching || !query.trim()}
              className="rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 font-semibold text-stone-900 transition-all hover:from-orange-400 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
            >
              {searching ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching…
                </span>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {results.length === 0 && !searching ? (
            <div className="rounded-xl border border-stone-200/60 bg-white/90 p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
                <Search className="h-6 w-6 text-stone-400" />
              </div>
              <p className="text-sm font-medium text-stone-700">No results yet</p>
              <p className="mt-1 text-xs text-stone-600">Try searching by school ID</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <div className="mb-3 text-xs font-medium uppercase tracking-wide text-stone-600">
                {results.length} {results.length === 1 ? "student found" : "students found"}
              </div>
              <ul className="space-y-2">
                {results.map((r) => {
                  const disabled = addingId === r.id;
                  return (
                    <li
                      key={r.id}
                      className="rounded-xl border border-stone-200/60 bg-white/90 p-4 transition hover:border-stone-300 hover:bg-white"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 border border-orange-200">
                            <User className="h-5 w-5 text-orange-500" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-stone-900 truncate">
                              {r.username || "Unknown"}
                            </div>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-stone-600">
                              <span className="font-mono">{r.school_id || "—"}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          disabled={disabled}
                          onClick={() => void addStudent(r.id)}
                          className={`shrink-0 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                            disabled
                              ? "border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed"
                              : "border-stone-300 bg-white text-stone-700 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700"
                          }`}
                        >
                          {addingId === r.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Adding…
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4" />
                              Add
                            </>
                          )}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : searching ? (
            <div className="rounded-xl border border-stone-200/60 bg-white/90 p-8 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-500" />
              <p className="mt-3 text-sm text-stone-600">Searching for students…</p>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end border-t border-stone-200/60 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-stone-300 bg-white px-6 py-2.5 font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
