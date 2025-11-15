"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Mic, Plus, Loader2 } from "lucide-react";
import AudioRecorder from "@/components/classpark/AudioRecorder";
import RecordingList from "@/components/classpark/RecordingList";

type Recording = {
  id: string;
  course_id: string | null;
  title: string;
  audio_url: string | null;
  transcript: string | null;
  notes: string | null;
  status: "recording" | "processing" | "completed" | "failed";
  created_at: string;
  updated_at: string;
};

export default function ClassParkProfessorPage() {
  const router = useRouter();
  const { user, userRole, loading } = useAuth();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [fetching, setFetching] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth/signin");
    } else if (userRole !== "professor") {
      router.replace("/products/classpark/app");
    }
  }, [user, userRole, loading, router]);

  const loadRecordings = useCallback(async () => {
    if (!user) return;
    setFetching(true);
    setErr(null);
    
    const { data, error } = await supabase
      .from("class_recordings")
      .select("*")
      .eq("professor_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setErr("Failed to load recordings");
    } else {
      setRecordings((data as Recording[]) ?? []);
    }
    setFetching(false);
  }, [user]);

  useEffect(() => {
    if (user && userRole === "professor") {
      void loadRecordings();
    }
  }, [user, userRole, loadRecordings]);

  if (loading || !user || userRole !== "professor") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-stone-900 mb-2">
            <Mic className="h-7 w-7 text-orange-500" />
            ClassPark
          </h1>
          <p className="text-stone-600">Record your lectures and generate structured notes automatically</p>
        </div>

        <button
          onClick={() => setShowRecorder(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-slate-900 font-semibold px-4 py-2 hover:from-orange-400 hover:to-amber-400 transition"
        >
          <Plus className="h-4 w-4" />
          New Recording
        </button>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-100 text-red-700 px-3 py-2 text-sm">
          {err}
        </div>
      )}

      {showRecorder && (
        <AudioRecorder
          onClose={() => setShowRecorder(false)}
          onRecordingSaved={() => {
            setShowRecorder(false);
            void loadRecordings();
          }}
        />
      )}

      <RecordingList
        recordings={recordings}
        fetching={fetching}
        onRefresh={loadRecordings}
      />
    </div>
  );
}

