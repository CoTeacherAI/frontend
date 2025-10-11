import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { createRequire } from "module";

export const runtime = "nodejs";

const BUCKET = "course-materials";
const MODEL = "text-embedding-3-small"; // 1536-dim embeddings

const requireCJS = createRequire(import.meta.url);

/* ---------------- Types ---------------- */
type PdfParseFn = (data: Buffer) => Promise<{ text?: string } | string>;

type PdfParseClassInstance = {
  parse?: (b: Buffer) => Promise<{ text?: string } | string>;
  parseBuffer?: (b: Buffer) => Promise<{ text?: string } | string>;
};

type PdfParseClass = new () => PdfParseClassInstance;

type MammothModule = {
  extractRawText: (input: { buffer: Buffer }) => Promise<{ value?: string }>;
};

type JSZipFile = {
  async: (
    type: "string" | "uint8array" | "arraybuffer"
  ) => Promise<string | Uint8Array | ArrayBuffer>;
};

type JSZipArchive = {
  files: Record<string, JSZipFile>;
};

type JSZipClass = {
  loadAsync: (data: Buffer) => Promise<JSZipArchive>;
};

type XMLParserClass = new (opts?: unknown) => { parse: (xml: string) => unknown };

class OcrRequiredError extends Error {
  readonly code = "OCR_REQUIRED";
  constructor() {
    super("PDF appears to have no selectable text (likely scanned / OCR required).");
  }
}

/* ---------------- Supabase service client (server-only) ---------------- */
function svc() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

/* ---------------- Simple character chunker ---------------- */
function chunkText(text: string, size = 1200, overlap = 200): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < text.length) {
    out.push(text.slice(i, i + size));
    i += Math.max(1, size - overlap);
  }
  return out;
}

/* ---------------- Token helpers / batching (to avoid 300k cap) ---------------- */
const approxTokens = (s: string) => Math.ceil(s.length / 4);
const PER_CHUNK_TOKEN_LIMIT = 8000;
const PER_REQUEST_TOKEN_BUDGET = 250_000;

function splitOversizedChunk(s: string): string[] {
  const maxChars = Math.floor(PER_CHUNK_TOKEN_LIMIT * 4 * 0.95);
  const out: string[] = [];
  for (let i = 0; i < s.length; i += maxChars) out.push(s.slice(i, i + maxChars));
  return out;
}

function buildBatches(chunks: string[]): string[][] {
  const normalized: string[] = [];
  for (const c of chunks) {
    if (approxTokens(c) > PER_CHUNK_TOKEN_LIMIT) normalized.push(...splitOversizedChunk(c));
    else normalized.push(c);
  }

  const batches: string[][] = [];
  let cur: string[] = [];
  let curTokens = 0;

  for (const c of normalized) {
    const t = approxTokens(c);

    if (t > PER_REQUEST_TOKEN_BUDGET) {
      for (const p of splitOversizedChunk(c)) {
        const tp = approxTokens(p);
        if (curTokens + tp > PER_REQUEST_TOKEN_BUDGET) {
          if (cur.length) batches.push(cur);
          cur = [];
          curTokens = 0;
        }
        cur.push(p);
        curTokens += tp;
      }
      continue;
    }

    if (curTokens + t > PER_REQUEST_TOKEN_BUDGET) {
      if (cur.length) batches.push(cur);
      cur = [];
      curTokens = 0;
    }
    cur.push(c);
    curTokens += t;
  }
  if (cur.length) batches.push(cur);
  return batches;
}

/* ---------------- Robust file text extraction ---------------- */
async function extractTextFromBlob(
  blob: Blob,
  opts: { filename?: string; mime?: string } = {}
): Promise<{ text: string; meta: { kind: string } }> {
  const arrBuf = await blob.arrayBuffer();
  const buf = Buffer.from(arrBuf);
  const name = (opts.filename || "").toLowerCase();
  const mime = (opts.mime || "").toLowerCase();

  const isExt = (ext: string) => name.endsWith(ext);
  const kindGuess =
    mime ||
    (isExt(".pdf") && "application/pdf") ||
    (isExt(".docx") &&
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
    (isExt(".pptx") &&
      "application/vnd.openxmlformats-officedocument.presentationml.presentation") ||
    (isExt(".txt") && "text/plain") ||
    (isExt(".md") && "text/markdown") ||
    "";

  // ---- TXT / MD ----
  if (kindGuess.startsWith("text/") || isExt(".txt") || isExt(".md") || mime === "text/plain") {
    const text = (await blob.text()).replace(/\s+/g, " ").trim();
    return { text, meta: { kind: "text" } };
  }

  // ---- PDF ----
  if (kindGuess.includes("pdf") || isExt(".pdf")) {
    try {
      const mod = requireCJS("pdf-parse") as unknown;

      const exported =
        (mod as { default?: unknown }).default ??
        (mod as { PDFParse?: unknown }).PDFParse ??
        mod;

      const isClass =
        typeof exported === "function" &&
        /^class\s/.test(Function.prototype.toString.call(exported));

      let text = "";

      if (typeof exported === "function" && !isClass) {
        // Default: function (buffer) => Promise<{text}|string>
        const fn = exported as PdfParseFn;
        const res = await fn(buf);
        text = (typeof res === "string" ? res : res?.text) ?? "";
      } else if (isClass) {
        // Some builds export a class; prefer parseBuffer/parse
        const Instance = exported as PdfParseClass;
        const inst = new Instance();
        const parse =
          inst.parseBuffer?.bind(inst) ??
          inst.parse?.bind(inst) ??
          undefined;
        if (!parse) throw new Error("Unsupported pdf-parse instance (no parse method)");
        const res = await parse(buf);
        text = (typeof res === "string" ? res : res?.text) ?? "";
      } else {
        throw new Error("pdf-parse export not recognized");
      }

      text = text.replace(/\s+/g, " ").trim();
      if (!text) throw new OcrRequiredError();

      return { text, meta: { kind: "pdf" } };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`PDF extraction failed: ${msg}`);
    }
  }

  // ---- DOCX ----
  if (
    kindGuess.includes("word") ||
    isExt(".docx") ||
    kindGuess.includes(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
  ) {
    try {
      const mammothMod = (await import("mammoth")) as { default?: MammothModule } & MammothModule;
      const mammoth: MammothModule = mammothMod.default ?? mammothMod;
      const r = await mammoth.extractRawText({ buffer: buf });
      const text = ((r?.value as string | undefined) ?? "").replace(/\s+/g, " ").trim();
      return { text, meta: { kind: "docx" } };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`DOCX extraction failed: ${msg}`);
    }
  }

  // ---- PPTX ----
  if (
    kindGuess.includes("presentation") ||
    isExt(".pptx") ||
    kindGuess.includes(
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )
  ) {
    try {
      const jszipMod = (await import("jszip")) as { default: JSZipClass };
      const fxpMod = (await import("fast-xml-parser")) as { XMLParser: XMLParserClass };

      const zip = await jszipMod.default.loadAsync(buf);
      const parser = new fxpMod.XMLParser({ ignoreAttributes: true, trimValues: true });

      const slideFiles = Object.keys(zip.files)
        .filter((p) => p.startsWith("ppt/slides/slide") && p.endsWith(".xml"))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

      const out: string[] = [];

      const collectText = (node: unknown): void => {
        if (!node || typeof node !== "object") return;
        const maybeText = (node as { t?: unknown }).t;
        if (typeof maybeText === "string") out.push(maybeText);
        const obj = node as Record<string, unknown>;
        for (const k of Object.keys(obj)) collectText(obj[k]);
      };

      for (const p of slideFiles) {
        const xml = (await zip.files[p].async("string")) as string;
        const json = parser.parse(xml);
        collectText(json);
      }

      const text = out.join(" ").replace(/\s+/g, " ").trim();
      return { text, meta: { kind: "pptx" } };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`PPTX extraction failed: ${msg}`);
    }
  }

  // ---- Fallback: attempt plain text ----
  const fallback = (await blob.text()).replace(/\s+/g, " ").trim();
  return { text: fallback, meta: { kind: "unknown" } };
}

/* ---------------- Route: POST ---------------- */
export async function POST(req: Request) {
  try {
    const { materialId } = (await req.json()) as { materialId?: string };
    if (!materialId) {
      return NextResponse.json({ error: "materialId required" }, { status: 400 });
    }

    const supabase = svc();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

    // 1) Load the material row
    const { data: m, error: mErr } = await supabase
      .from("course_materials")
      .select("id, course_id, title, storage_path, mime_type")
      .eq("id", materialId)
      .single();

    if (mErr || !m) {
      return NextResponse.json({ error: mErr?.message || "Material not found" }, { status: 404 });
    }

    // 2) Download via signed URL
    const { data: signed, error: sErr } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(m.storage_path, 60);
    if (sErr || !signed?.signedUrl) {
      return NextResponse.json({ error: sErr?.message || "Signed URL failed" }, { status: 500 });
    }

    const fileRes = await fetch(signed.signedUrl);
    if (!fileRes.ok) {
      return NextResponse.json({ error: `Fetch ${fileRes.status}` }, { status: 500 });
    }
    const blob = await fileRes.blob();

    // 3) Extract text
    const { text: extractedText, meta } = await extractTextFromBlob(blob, {
      filename: m.title || m.storage_path,
      mime: m.mime_type || "",
    });

    const fullText = extractedText.replace(/\s+/g, " ").trim();
    if (!fullText) {
      return NextResponse.json(
        {
          error:
            "No text extracted. If this is a scanned PDF, enable OCR or upload a text-based version.",
          meta,
        },
        { status: 422 }
      );
    }

    // 4) Chunk + batch
    const baseChunks = chunkText(fullText, 1200, 200);
    if (baseChunks.length === 0) {
      return NextResponse.json({ error: "No chunks produced" }, { status: 422 });
    }
    const batches = buildBatches(baseChunks);

    // 5) Embed & insert
    let totalInserted = 0;
    let nextChunkIndex = 0;

    for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
      const input = batches[batchIdx];

      const resp = await openai.embeddings.create({ model: MODEL, input });
      const rows = resp.data.map((d, i) => ({
        course_id: m.course_id,
        doc_id: m.id,
        chunk_index: nextChunkIndex + i,
        content: input[i],
        embedding: d.embedding as number[], // vector(1536) column
      }));

      const { error: insErr } = await supabase.from("course_kb_chunks").insert(rows);
      if (insErr) {
        return NextResponse.json({ error: insErr.message }, { status: 500 });
      }

      totalInserted += rows.length;
      nextChunkIndex += input.length;
    }

    return NextResponse.json({ ok: true, chunks: totalInserted });
  } catch (e: unknown) {
    const details = e instanceof Error ? e.stack : undefined;
    const message = e instanceof Error ? e.message : "Index failed";
    return NextResponse.json({ error: message, details }, { status: 500 });
  }
}

