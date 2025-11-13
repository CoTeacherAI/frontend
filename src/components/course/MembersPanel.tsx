"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, Plus, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AddMembersModal from "./AddMembersModal";

type Role = "owner" | "ta" | "student";
type MemberRow = { user_id: string; role: Role };
type MemberWithUsername = MemberRow & { username: string | null };

export default function MembersPanel({
  courseId,
  isOwner,
}: {
  courseId: string;
  isOwner: boolean;
}) {
  const [openAddMembers, setOpenAddMembers] = useState(false);
  const [members, setMembers] = useState<MemberWithUsername[]>([]);

  const loadMembers = useCallback(async () => {
    const { data: m } = await supabase
      .from("course_members")
      .select("user_id, role")
      .eq("course_id", courseId);

    const rows = (m ?? []) as MemberRow[];
    const ids = rows.map((r) => r.user_id);

    const usernameMap = new Map<string, string>();
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", ids);
      (profs ?? []).forEach((p: { id: string; username: string | null }) =>
        usernameMap.set(p.id, p.username ?? "")
      );
    }

    setMembers(rows.map((r) => ({ ...r, username: usernameMap.get(r.user_id) ?? null })));
  }, [courseId]);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  // Collapsible state (persist per-course)
  const storageKey = `members_open_${courseId}`;
  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = window.localStorage.getItem(storageKey);
    return saved === "1";
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, open ? "1" : "0");
    }
  }, [open, storageKey]);

  const countLabel = useMemo(() => {
    const n = members.length;
    return n === 0 ? "No members" : `${n} member${n > 1 ? "s" : ""}`;
  }, [members.length]);

  return (
    <section className="rounded-2xl border border-stone-200/60 bg-white/70 backdrop-blur-xl">
      {/* Header / Toggle */}
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3"
          aria-expanded={open}
          aria-controls={`members-panel-${courseId}`}
        >
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200/60 bg-white/60">
            <Users className="h-5 w-5 text-orange-500" />
          </div>
          <div className="text-left">
            <div className="text-base font-semibold text-stone-900">Members</div>
            <div className="text-xs text-stone-600">{countLabel}</div>
          </div>
          <ChevronDown
            className={`ml-2 h-5 w-5 transition-transform text-stone-700 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {isOwner ? (
          <button
            onClick={() => setOpenAddMembers(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-2 py-1 text-sm hover:border-stone-400 transition text-stone-700"
            title="Add members"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        ) : null}
      </div>

      {/* Body */}
      <div
        id={`members-panel-${courseId}`}
        className={`px-5 pb-5 transition-[grid-template-rows] ${
          open ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {members.length === 0 ? (
            <p className="text-stone-600 text-sm">No members yet.</p>
          ) : (
            <ul className="space-y-2 text-sm max-h-72 overflow-y-auto pr-1">
              {members.map((m) => (
                <li key={m.user_id} className="flex items-center justify-between">
                  <span className="text-stone-900">
                    {m.username && m.username.trim().length > 0 ? m.username : m.user_id}
                  </span>
                  <span className="text-xs rounded-full border border-stone-200/60 bg-white/80 px-2 py-0.5 text-stone-700">
                    {m.role}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {openAddMembers && isOwner ? (
        <AddMembersModal
          courseId={courseId}
          onClose={() => setOpenAddMembers(false)}
          onAdded={() => void loadMembers()}
        />
      ) : null}
    </section>
  );
}