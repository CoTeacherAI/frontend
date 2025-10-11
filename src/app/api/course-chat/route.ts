// src/app/api/course-chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

type ChatMsg = { role: "user" | "assistant" | "system"; content: string };
type MatchRow = { id: string; content: string; similarity: number };

function isMatchRow(x: unknown): x is MatchRow {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.content === "string" &&
    typeof r.similarity === "number"
  );
}

export async function POST(req: NextRequest) {
  // --- parse body
  let body: { courseId?: string; messages?: ChatMsg[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const courseId = body.courseId ?? "";
  const messages = body.messages ?? [];
  const question =
    [...messages].reverse().find((m) => m.role === "user")?.content?.trim() ?? "";

  if (!courseId || !question) {
    return NextResponse.json(
      { error: "Missing courseId or user question" },
      { status: 400 }
    );
  }

  // --- clients
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  try {
    // 1) Embed the question
    const emb = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });
    const queryEmbedding = emb.data[0].embedding;

    // 2) Retrieve top-k chunks via RPC (note: no generic here)
    const { data, error: matchErr } = await supabase.rpc(
      "match_course_chunks",
      {
        query_embedding: queryEmbedding,
        match_count: 6,
        match_threshold: 0.2,
        in_course_id: courseId,
      }
    );

    if (matchErr) {
      return NextResponse.json(
        { error: `Retrieval failed: ${matchErr.message}` },
        { status: 500 }
      );
    }

    // Strictly type and validate the RPC rows
    const matches: MatchRow[] = Array.isArray(data)
      ? data.filter(isMatchRow)
      : [];

    const contextText =
      matches
        .map((m: MatchRow, i: number) => {
          const sim = Number.isFinite(m.similarity)
            ? m.similarity.toFixed(3)
            : "0.000";
          return `[Chunk #${i + 1}, similarity: ${sim}]\n${m.content}`;
        })
        .join("\n\n---\n\n") ?? "";

    // 3) Prompt
    const systemPrompt = `You are an AI teaching assistant for this course.

Your job is to answer student questions using ONLY the provided course context below.

Rules:
1. If the context contains the answer, provide a clear, helpful response.
2. If the context doesn't contain enough information, say: "I don't have that information in the uploaded course materials yet."
3. Be concise but thorough.
4. Cite specific sections when possible (e.g., "According to the syllabus...").
5. Never make up information not in the context.`;

    const userPrompt = contextText
      ? `Question: ${question}\n\n=== Course Materials Context ===\n\n${contextText}`
      : `Question: ${question}\n\n(No course materials have been uploaded yet)`;

    // 4) Generate answer
    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const reply =
      chat.choices[0]?.message?.content?.trim() ??
      "I couldn't generate a response.";

    return NextResponse.json({ reply }, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : typeof err === "string" ? err : "Chat failed";
    const code = (err as { code?: string } | undefined)?.code;
    if (code === "insufficient_quota") {
      return NextResponse.json(
        { error: "No remaining OpenAI credits." },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}