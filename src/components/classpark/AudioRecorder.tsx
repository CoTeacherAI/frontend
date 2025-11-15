"use client";

import { useState, useRef, useEffect } from "react";
import { X, Mic, Square, Loader2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/contexts/AuthContext";

interface AudioRecorderProps {
  onClose: () => void;
  onRecordingSaved: () => void;
}

export default function AudioRecorder({ onClose, onRecordingSaved }: AudioRecorderProps) {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Try to use the best supported MIME type
      let mimeType = "audio/webm;codecs=opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/webm";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "audio/mp4";
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = ""; // Use browser default
          }
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined,
      });

      chunksRef.current = [];
      
      // Request data periodically to ensure we capture all chunks
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Wait a bit to ensure all chunks are collected
        await new Promise((resolve) => setTimeout(resolve, 200));
        
        // Ensure we have chunks before creating blob
        if (chunksRef.current.length === 0) {
          console.error("No audio chunks collected");
          setError("Recording failed: No audio data captured");
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        
        // Create blob with explicit MIME type
        const mimeType = mediaRecorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        
        // Verify blob size
        console.log("Recording blob size:", blob.size, "bytes, type:", mimeType, "chunks:", chunksRef.current.length);
        
        if (blob.size === 0) {
          console.error("Blob is empty");
          setError("Recording failed: Empty audio file");
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        
        // Test if the blob can be played before setting it
        const testUrl = URL.createObjectURL(blob);
        const testAudio = new Audio(testUrl);
        
        testAudio.onerror = (e) => {
          console.error("Blob playback test failed:", e);
          URL.revokeObjectURL(testUrl);
        };
        
        testAudio.onloadedmetadata = () => {
          console.log("Blob playback test passed - Duration:", testAudio.duration);
          URL.revokeObjectURL(testUrl);
        };
        
        // Try to load metadata
        testAudio.load();
        
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      
      // Request data every second to ensure we capture all chunks
      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Failed to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSave = async () => {
    if (!audioBlob || !title.trim() || !user) {
      setError("Please provide a title and ensure recording is complete");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // 1. Upload audio to Supabase Storage (same pattern as MaterialsPanel)
      // Use the blob's actual MIME type
      const fileExtension = audioBlob.type.includes("webm") ? "webm" : 
                           audioBlob.type.includes("mp4") ? "m4a" : 
                           audioBlob.type.includes("ogg") ? "ogg" : "webm";
      const fileName = `${user.id}/${Date.now()}-${title.replace(/[^a-z0-9]/gi, "_")}.${fileExtension}`;
      
      console.log("Uploading audio:", {
        fileName,
        size: audioBlob.size,
        type: audioBlob.type,
        fileExtension
      });
      
      const { error: uploadError } = await supabase.storage
        .from("class_recordings")
        .upload(fileName, audioBlob, {
          contentType: audioBlob.type || "audio/webm",
          upsert: false,
        });

      if (uploadError) {
        setError(`Storage upload error: ${uploadError.message}`);
        setSaving(false);
        return;
      }

      // 2. Get public URL
      const { data: urlData } = supabase.storage
        .from("class_recordings")
        .getPublicUrl(fileName);

      // 3. Create recording record (same pattern as course_materials - use user.id directly)
      const { data: recordingData, error: dbError } = await supabase
        .from("class_recordings")
        .insert({
          professor_id: user.id,
          title: title.trim(),
          audio_url: urlData.publicUrl,
          status: "processing",
        })
        .select("id")
        .single();

      if (dbError || !recordingData?.id) {
        // Clean up uploaded file if DB insert fails
        await supabase.storage.from("class_recordings").remove([fileName]).catch(() => undefined);
        setError(`DB insert error: ${dbError?.message ?? "Unknown error"}`);
        setSaving(false);
        return;
      }

      // 4. Trigger transcription API (same pattern as MaterialsPanel indexing)
      const materialId = recordingData.id as string;
      const transcriptionResponse = await fetch("/api/classpark/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recordingId: materialId,
          audioUrl: urlData.publicUrl,
        }),
      });

      if (!transcriptionResponse.ok) {
        const msg = await transcriptionResponse.text().catch(() => "");
        console.error("Transcription failed:", msg || transcriptionResponse.statusText);
        // Still save the recording, but mark as failed
        await supabase
          .from("class_recordings")
          .update({ status: "failed" })
          .eq("id", materialId);
      }

      onRecordingSaved();
    } catch (err) {
      console.error("Error saving recording:", err);
      let errorMessage = "Failed to save recording";
      
      if (err instanceof Error) {
        errorMessage = err.message;
        // Check for specific Supabase errors
        if (err.message.includes("new row violates row-level security")) {
          errorMessage = "Permission denied. Please check your database RLS policies.";
        } else if (err.message.includes("relation") && err.message.includes("does not exist")) {
          errorMessage = "Database table not found. Please run the SQL migration to create the 'class_recordings' table.";
        } else if (err.message.includes("Bucket not found") || err.message.includes("storage")) {
          errorMessage = "Storage bucket 'class_recordings' not found. Please create it in Supabase Storage.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-stone-200/60 bg-white/95 backdrop-blur-xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-2 hover:bg-stone-100 transition text-stone-600 hover:text-stone-900"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-stone-900 mb-2">Record Lecture</h2>
          <p className="text-sm text-stone-600">Record your class audio to generate structured notes</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Lecture Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Week 3 - Introduction to Algorithms"
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder:text-stone-500 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              disabled={isRecording || saving}
            />
          </div>

          <div className="rounded-xl border border-stone-200/60 bg-stone-50/50 p-6 text-center">
            {!audioBlob ? (
              <>
                {!isRecording ? (
                  <div className="space-y-4">
                    <div className="mx-auto w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                      <Mic className="h-10 w-10 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-stone-700 font-medium mb-1">Ready to record</p>
                      <p className="text-sm text-stone-600">Click the button below to start</p>
                    </div>
                    <button
                      onClick={startRecording}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-slate-900 font-semibold px-6 py-3 hover:from-orange-400 hover:to-amber-400 transition-all shadow-lg shadow-orange-500/20"
                    >
                      <Mic className="h-5 w-5" />
                      Start Recording
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                      <Square className="h-10 w-10 text-red-500" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-stone-900 mb-1">{formatTime(recordingTime)}</p>
                      <p className="text-sm text-stone-600">Recording in progress...</p>
                    </div>
                    <button
                      onClick={stopRecording}
                      className="inline-flex items-center gap-2 rounded-full bg-red-500 text-white font-semibold px-6 py-3 hover:bg-red-600 transition-all"
                    >
                      <Square className="h-5 w-5" />
                      Stop Recording
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <Mic className="h-10 w-10 text-green-500" />
                </div>
                <div>
                  <p className="text-stone-700 font-medium mb-1">Recording Complete</p>
                  <p className="text-sm text-stone-600">Duration: {formatTime(recordingTime)}</p>
                </div>
                {audioUrl && (
                  <audio src={audioUrl} controls className="w-full" />
                )}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setAudioBlob(null);
                      setAudioUrl(null);
                      setRecordingTime(0);
                      if (audioUrl) {
                        URL.revokeObjectURL(audioUrl);
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-stone-700 hover:bg-stone-50 transition"
                  >
                    Record Again
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !title.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-slate-900 font-semibold px-6 py-2 hover:from-orange-400 hover:to-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save & Transcribe
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

