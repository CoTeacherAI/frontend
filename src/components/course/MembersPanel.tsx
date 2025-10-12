"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";
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

  return (
    <section className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold">Members</h2>
        </div>

        {isOwner ? (
          <button
            onClick={() => setOpenAddMembers(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-2 py-1 text-sm hover:border-white/40"
            title="Add members"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        ) : null}
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
