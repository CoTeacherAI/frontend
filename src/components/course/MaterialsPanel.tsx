"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, Loader2, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/contexts/AuthContext";

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

export default function MaterialsPanel({
  courseId,
  ownerId,
}: {
  courseId: string;
  ownerId: string;
}) {
  const { user } = useAuth();
  const isOwner = useMemo(() => Boolean(user && user.id === ownerId), [user, ownerId]);

  // --- Collapsible state (persist per-course)
  const storageKey = `materials_open_${courseId}`;
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

  const [files, setFiles] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [working, setWorking] = useState<Set<string>>(new Set());
  const [, setIndexing] = useState<string | null>(null); // setter only (avoid "unused" lint)

  const slugName = (name: string) =>
    name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").toLowerCase();

  const fmtSize = (bytes: number | null): string => {
    if (bytes === null) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // --- Preload materials list on mount & whenever courseId changes
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
    void refresh(); // preload so header shows the correct count without opening
  }, [refresh]);

  if (!isOwner) return null;

  async function handleUpload(evt: React.ChangeEvent<HTMLInputElement>) {
    const file = evt.target.files?.[0];
    if (!file || !user) return;

    setErr(null);
    setLoading(true);

    try {
      const rand =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`;

      const path = `${courseId}/${rand}--${slugName(file.name)}`;

      // 1) Upload
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

      // 2) DB insert -> get id
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

      // 3) Index
      const materialId = inserted.id as string;
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

      await refresh(); // update list & header count
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : JSON.stringify(e));
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

  // Header count label (shows accurate number after preload; shows "Loading…" while fetching)
  const countLabel =
    loading && files.length === 0
      ? "Loading…"
      : files.length
      ? `${files.length} file${files.length > 1 ? "s" : ""}`
      : "No files";

  return (
    <section className="rounded-2xl border border-stone-200/60 bg-white/70 backdrop-blur-xl">
      {/* Header / Toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4"
        aria-expanded={open}
        aria-controls={`materials-panel-${courseId}`}
      >
        <div className="flex items-center gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200/60 bg-white/60">
            <Upload className="h-4 w-4 text-orange-500" />
          </div>
          <div className="text-left">
            <div className="text-base font-semibold text-stone-900">Materials</div>
            <div className="text-xs text-stone-600">{countLabel}</div>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 transition-transform text-stone-700 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Body */}
      <div
        id={`materials-panel-${courseId}`}
        className={`px-5 pb-5 transition-[grid-template-rows] ${
          open ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {/* Upload controls */}
          <div className="mb-4">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-stone-300 px-3 py-1.5 hover:border-stone-400 transition text-stone-700">
              <Upload className="h-4 w-4" />
              <span>Upload materials</span>
              <input type="file" className="hidden" onChange={handleUpload} />
            </label>
          </div>

          {/* History header */}
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-stone-900">Upload history</h3>
            <button
              onClick={() => void refresh()}
              className="rounded-lg border border-stone-300 px-2 py-1 text-xs hover:border-stone-400 text-stone-700"
            >
              Refresh
            </button>
          </div>

          {/* Status / Errors */}
          {loading ? (
            <div className="flex items-center gap-2 text-stone-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </div>
          ) : err ? (
            <div className="text-xs text-red-600">{err}</div>
          ) : files.length === 0 ? (
            <div className="text-sm text-stone-600">No uploads yet.</div>
          ) : (
            // Scroll container to avoid pushing Members down
            <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {files.map((f) => {
                const isBusy = working.has(f.storage_path);
                const size = fmtSize(f.bytes ?? null);
                return (
                  <li
                    key={f.id}
                    className="rounded-lg border border-stone-200/60 bg-white/60 px-3 py-2 text-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-medium text-stone-900 truncate">{f.filename}</div>
                        <div className="text-xs text-stone-600">
                          {new Date(f.created_at).toLocaleString()} {size && `· ${size}`}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          disabled={isBusy}
                          onClick={() => void download(f.storage_path, f.filename)}
                          className="rounded-lg border border-stone-300 px-2 py-1 hover:border-stone-400 transition disabled:opacity-50 text-stone-700"
                          title="Download"
                        >
                          {isBusy ? "…" : "Download"}
                        </button>
                        <button
                          disabled={isBusy}
                          onClick={() => void remove(f)}
                          className="rounded-lg border border-red-400 text-red-600 px-2 py-1 hover:border-red-500 hover:bg-red-50 transition disabled:opacity-50"
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
      </div>
    </section>
  );
}
