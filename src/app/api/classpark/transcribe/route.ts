import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Supabase service client
function svc() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
  let recordingId: string | undefined;
  try {
    const body = await req.json();
    recordingId = body.recordingId;
    const { audioUrl } = body;

    if (!recordingId || !audioUrl) {
      return NextResponse.json(
        { error: "recordingId and audioUrl are required" },
        { status: 400 }
      );
    }

    const supabase = svc();

          // 1. Download audio file using signed URL (same pattern as index-material route)
          // Extract the storage path from the audioUrl
          // audioUrl format: https://{project}.supabase.co/storage/v1/object/public/class_recordings/{path}
          const urlParts = audioUrl.split('/class_recordings/');
          if (urlParts.length !== 2) {
            throw new Error("Invalid audio URL format");
          }
          const storagePath = urlParts[1];

          // Create signed URL (same pattern as course-materials)
          const { data: signed, error: sErr } = await supabase.storage
            .from("class_recordings")
            .createSignedUrl(storagePath, 60);
          
          if (sErr || !signed?.signedUrl) {
            throw new Error(sErr?.message || "Failed to create signed URL");
          }

          const audioResponse = await fetch(signed.signedUrl);
          if (!audioResponse.ok) {
            throw new Error(`Failed to download audio file: ${audioResponse.status}`);
          }
          const audioBlob = await audioResponse.blob();
          const audioBuffer = Buffer.from(await audioBlob.arrayBuffer());

    // 2. Transcribe using OpenAI Whisper
    // OpenAI SDK accepts File, Blob, or ReadStream
    // In Node.js, we can use the Buffer directly by creating a File-like object
    const audioFile = new File([audioBuffer], "recording.webm", { 
      type: "audio/webm",
      lastModified: Date.now()
    });
    
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile as unknown as File, // Type assertion for Node.js File compatibility
      model: "whisper-1",
      response_format: "text",
    });

    // When response_format is "text", the response is a string directly
    const transcript = transcription as string;

    // 3. Generate structured notes using GPT
    const notesPrompt = `Transform the following lecture transcript into well-structured, beautiful notes. 
Format it as markdown with:
- Clear headings and subheadings
- Bullet points for key concepts
- Important definitions highlighted
- Summary sections

Transcript:
${transcript}

Generate the structured notes:`;

    const notesResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at creating clear, well-structured lecture notes from transcripts. Format your response as markdown.",
        },
        { role: "user", content: notesPrompt },
      ],
      temperature: 0.7,
    });

    const notes = notesResponse.choices[0]?.message?.content || "";

    // 4. Update the recording in database
    const { error: updateError } = await supabase
      .from("class_recordings")
      .update({
        transcript,
        notes,
        status: "completed",
      })
      .eq("id", recordingId);

    if (updateError) {
      console.error("Database update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update recording", details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, transcript, notes });
  } catch (error) {
    console.error("Transcription error:", error);
    const message = error instanceof Error ? error.message : "Transcription failed";
    
    // Try to mark recording as failed
    if (recordingId) {
      try {
        const supabase = svc();
        await supabase
          .from("class_recordings")
          .update({ status: "failed" })
          .eq("id", recordingId);
      } catch {
        // Ignore error updating status
      }
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

