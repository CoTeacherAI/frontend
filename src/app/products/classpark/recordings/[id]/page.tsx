"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Loader2, ArrowLeft, FileText, Download } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

type Recording = {
  id: string;
  professor_id: string;
  course_id: string | null;
  title: string;
  audio_url: string | null;
  transcript: string | null;
  notes: string | null;
  status: "recording" | "processing" | "completed" | "failed";
  created_at: string;
  updated_at: string;
};

export default function RecordingNotesPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [recording, setRecording] = useState<Recording | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecording = useCallback(async () => {
    if (!params.id || typeof params.id !== "string") return;

    setFetching(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("class_recordings")
      .select("*")
      .eq("id", params.id)
      .single();

    if (fetchError || !data) {
      setError("Recording not found");
      setFetching(false);
      return;
    }

    // Check if user has access (professor who created it)
    if (data.professor_id !== user?.id) {
      setError("You don't have access to this recording");
      setFetching(false);
      return;
    }

    setRecording(data as Recording);
    setFetching(false);
  }, [params.id, user?.id]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth/signin");
      return;
    }
    void loadRecording();
  }, [params.id, user, loading, router, loadRecording]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error || !recording) {
    return (
      <div className="min-h-screen pt-24 px-4 max-w-6xl mx-auto">
        <div className="rounded-lg border border-red-300 bg-red-50 text-red-700 px-4 py-3">
          {error || "Recording not found"}
        </div>
        <Link
          href="/products/classpark/professor"
          className="mt-4 inline-flex items-center gap-2 text-stone-700 hover:text-orange-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to recordings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto pb-12">
      <Link
        href="/products/classpark/professor"
        className="inline-flex items-center gap-2 text-stone-700 hover:text-orange-500 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to recordings
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">{recording.title}</h1>
        <p className="text-stone-600">Recorded on {formatDate(recording.created_at)}</p>
      </div>

      {recording.audio_url && (
        <div className="mb-6 rounded-xl border border-stone-200/60 bg-white/80 p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-orange-500" />
            <h2 className="font-semibold text-stone-900">Audio Recording</h2>
          </div>
          <audio 
            src={recording.audio_url} 
            controls 
            preload="metadata"
            className="w-full"
            onError={(e) => {
              console.error("Audio playback error:", e);
              const target = e.target as HTMLAudioElement;
              if (target.error) {
                console.error("Audio error code:", target.error.code, "Message:", target.error.message);
              }
            }}
            onLoadedMetadata={(e) => {
              const target = e.target as HTMLAudioElement;
              console.log("Audio loaded - Duration:", target.duration, "URL:", recording.audio_url);
            }}
          />
        </div>
      )}

      {recording.status === "processing" && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-3" />
          <p className="text-stone-700 font-medium">Processing transcription...</p>
          <p className="text-sm text-stone-600 mt-1">This may take a few minutes</p>
        </div>
      )}

      {recording.status === "completed" && recording.notes && (
        <div className="space-y-6">
          <div className="rounded-xl border border-stone-200/60 bg-white/80 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-stone-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-500" />
                Structured Notes
              </h2>
              {recording.notes && (
                <button
                  onClick={() => {
                    const blob = new Blob([recording.notes!], { type: "text/markdown" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${recording.title.replace(/[^a-z0-9]/gi, "_")}_notes.md`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50 transition"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              )}
            </div>
            <div className="prose prose-stone max-w-none">
              <ReactMarkdown>{recording.notes}</ReactMarkdown>
            </div>
          </div>

          {recording.transcript && (
            <details className="rounded-xl border border-stone-200/60 bg-white/80 p-6">
              <summary className="cursor-pointer font-semibold text-stone-900 mb-4">
                Full Transcript
              </summary>
              <div className="prose prose-stone max-w-none text-sm">
                <p className="whitespace-pre-wrap text-stone-700">{recording.transcript}</p>
              </div>
            </details>
          )}
        </div>
      )}

      {recording.status === "failed" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-700 font-medium">Failed to process recording</p>
          <p className="text-sm text-red-600 mt-1">Please try recording again</p>
        </div>
      )}
    </div>
  );
}

