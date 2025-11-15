"use client";

import { useState, useEffect } from "react";
import { FileText, Loader2, CheckCircle2, XCircle, Clock, Trash2, Mic } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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

interface RecordingListProps {
  recordings: Recording[];
  fetching: boolean;
  onRefresh: () => void;
}

export default function RecordingList({ recordings, fetching, onRefresh }: RecordingListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});

  const handleDelete = async (recording: Recording) => {
    if (!confirm(`Are you sure you want to delete "${recording.title}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(recording.id);
    setError(null);

    try {
      // 1. Delete the audio file from storage if it exists
      if (recording.audio_url) {
        // Extract storage path from URL
        // URL format: https://{project}.supabase.co/storage/v1/object/public/class_recordings/{path}
        const urlParts = recording.audio_url.split('/class_recordings/');
        if (urlParts.length === 2) {
          const storagePath = urlParts[1];
          await supabase.storage
            .from("class_recordings")
            .remove([storagePath])
            .catch((err) => {
              console.warn("Failed to delete audio file from storage:", err);
              // Continue with DB deletion even if storage deletion fails
            });
        }
      }

      // 2. Delete the recording record from database
      const { error: deleteError } = await supabase
        .from("class_recordings")
        .delete()
        .eq("id", recording.id);

      if (deleteError) {
        throw deleteError;
      }

      // Refresh the list
      onRefresh();
    } catch (err) {
      console.error("Error deleting recording:", err);
      setError(err instanceof Error ? err.message : "Failed to delete recording");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusIcon = (status: Recording["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-orange-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-stone-400" />;
    }
  };

  const getStatusText = (status: Recording["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "processing":
        return "Processing...";
      case "failed":
        return "Failed";
      default:
        return "Pending";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate signed URLs for audio playback
  useEffect(() => {
    const loadAudioUrls = async () => {
      const urls: Record<string, string> = {};
      
      for (const recording of recordings) {
        if (recording.audio_url && !audioUrls[recording.id]) {
          try {
            // Extract storage path from public URL
            const urlParts = recording.audio_url.split('/class_recordings/');
            if (urlParts.length === 2) {
              const storagePath = urlParts[1];
              const { data: signed, error: urlError } = await supabase.storage
                .from("class_recordings")
                .createSignedUrl(storagePath, 3600); // 1 hour expiry
              
              if (!urlError && signed?.signedUrl) {
                urls[recording.id] = signed.signedUrl;
              } else {
                // Fallback to public URL if signed URL fails
                urls[recording.id] = recording.audio_url;
              }
            } else {
              urls[recording.id] = recording.audio_url;
            }
          } catch (err) {
            console.error("Error generating signed URL for recording:", recording.id, err);
            urls[recording.id] = recording.audio_url; // Fallback
          }
        } else if (recording.audio_url) {
          urls[recording.id] = audioUrls[recording.id] || recording.audio_url;
        }
      }
      
      if (Object.keys(urls).length > 0) {
        setAudioUrls((prev) => ({ ...prev, ...urls }));
      }
    };

    if (recordings.length > 0) {
      void loadAudioUrls();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordings]);

  if (fetching) {
    return (
      <div className="rounded-2xl border border-stone-200/60 bg-white/70 backdrop-blur-xl p-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
        <p className="text-stone-600">Loading recordings...</p>
      </div>
    );
  }

  if (recordings.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200/60 bg-white/70 backdrop-blur-xl p-12 text-center">
        <FileText className="h-12 w-12 text-stone-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-stone-900 mb-2">No recordings yet</h3>
        <p className="text-stone-600">Start by creating your first lecture recording</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stone-200/60 bg-white/70 backdrop-blur-xl p-6">
      <h3 className="text-lg font-semibold text-stone-900 mb-4">Your Recordings</h3>
      
      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 text-red-700 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {recordings.map((recording) => (
          <div
            key={recording.id}
            className="rounded-xl border border-stone-200/60 bg-white/80 p-4 hover:border-stone-300 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-stone-900 truncate">{recording.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-stone-600">
                    {getStatusIcon(recording.status)}
                    <span>{getStatusText(recording.status)}</span>
                  </div>
                </div>
                <p className="text-sm text-stone-600 mb-3">
                  {formatDate(recording.created_at)}
                </p>
                
                {/* Audio Player */}
                {recording.audio_url && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Mic className="h-4 w-4 text-orange-500" />
                      <span className="text-xs font-medium text-stone-700">Audio Playback</span>
                    </div>
                    <audio 
                      src={audioUrls[recording.id] || recording.audio_url} 
                      controls 
                      preload="metadata"
                      className="w-full max-w-md h-10 rounded-lg"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        console.error("Audio playback error:", e);
                        const target = e.target as HTMLAudioElement;
                        if (target.error) {
                          console.error("Audio error code:", target.error.code, "Message:", target.error.message);
                          console.error("Audio source URL:", target.src);
                        }
                      }}
                      onLoadedMetadata={(e) => {
                        const target = e.target as HTMLAudioElement;
                        console.log("Audio loaded - Duration:", target.duration, "URL:", target.src);
                      }}
                    />
                    <p className="text-xs text-stone-500 mt-1">
                      {audioUrls[recording.id] ? "Using signed URL" : "Using public URL"}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                {recording.status === "completed" && recording.notes && (
                  <Link
                    href={`/products/classpark/recordings/${recording.id}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition"
                  >
                    <FileText className="h-4 w-4" />
                    View Notes
                  </Link>
                )}
                <button
                  onClick={() => void handleDelete(recording)}
                  disabled={deletingId === recording.id}
                  className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    deletingId === recording.id
                      ? "border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed"
                      : "border-red-300 bg-white text-red-700 hover:border-red-400 hover:bg-red-50"
                  }`}
                  title="Delete recording"
                >
                  {deletingId === recording.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

