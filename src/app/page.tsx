import Link from "next/link";
import { GlassyCard } from "@/components/GlassyCard";
import { Shield, Sparkles, Upload } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import HeroDemo from "@/components/HeroDemo";

// read the public key on the server and inject it into the inline script below
const OPENAI_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

export default function Page() {
  return (
    <>
      <Navbar />
      {/* Hero */}
      <section className="relative pt-28 md:pt-32">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Every course gets its own <span className="text-cyan-300">AI co-teacher</span>
          </h1>
          <p className="mt-4 text-slate-300/90 text-lg md:text-xl max-w-3xl mx-auto">
            Professors upload materials. The AI analyzes and stores them privately for each course.
            Students learn faster with guided hints—never final answers.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/auth/signup" className="rounded-full px-6 py-3 bg-cyan-400/90 text-slate-900 font-semibold hover:bg-cyan-300 transition">
              Get started
            </Link>
            <Link href="#how" className="rounded-full px-6 py-3 border border-white/20 hover:border-white/40 transition">
              See how it works
            </Link>
          </div>

          {/* Bigger demo */}
          <div className="mt-12">
            <HeroDemo />
          </div>
        </div>
      </section>

      {/* Featured (optional: remove if not needed) */}
      {/* You can insert a featured CourseList here if you like */}

      {/* Features */}
      <section className="relative mt-16 md:mt-24" id="features">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-6">
          <GlassyCard className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Upload className="h-5 w-5 text-cyan-300" />
              <h3 className="font-semibold">Upload & organize</h3>
            </div>
            <p className="text-slate-300/90">PDFs, slides, videos—ingested and indexed for precise retrieval.</p>
          </GlassyCard>
          <GlassyCard className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-5 w-5 text-cyan-300" />
              <h3 className="font-semibold">Course-tuned AI</h3>
            </div>
            <p className="text-slate-300/90">Chat with an AI that knows your syllabus, not the whole internet.</p>
          </GlassyCard>
          <GlassyCard className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-5 w-5 text-cyan-300" />
              <h3 className="font-semibold">Integrity guardrails</h3>
            </div>
            <p className="text-slate-300/90">Hints and scaffolding only—no direct answers to graded work.</p>
          </GlassyCard>
        </div>
      </section>

      {/* How it works */}
      <section className="relative mt-16 md:mt-24" id="how">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <GlassyCard className="p-6">
              <div className="text-sm uppercase tracking-wider text-slate-300/80">Step 1</div>
              <div className="mt-2 font-semibold">Professor uploads course content</div>
              <p className="mt-1 text-slate-300/90">Docs, slides, and videos are parsed and embedded.</p>
            </GlassyCard>
            <GlassyCard className="p-6">
              <div className="text-sm uppercase tracking-wider text-slate-300/80">Step 2</div>
              <div className="mt-2 font-semibold">We build a private knowledge base</div>
              <p className="mt-1 text-slate-300/90">Per-course vector store with access controls.</p>
            </GlassyCard>
            <GlassyCard className="p-6">
              <div className="text-sm uppercase tracking-wider text-slate-300/80">Step 3</div>
              <div className="mt-2 font-semibold">Students learn with the tutor</div>
              <p className="mt-1 text-slate-300/90">Guided explanations, examples, and practice—not solutions.</p>
            </GlassyCard>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mt-20 md:mt-28 mb-24">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <GlassyCard className="p-8">
            <h3 className="text-2xl md:text-3xl font-bold">Bring CoTeacher AI to your next course</h3>
            <p className="mt-2 text-slate-300/90">
              Launch a pilot with a single class, then scale across your institution.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                href="/auth/signup"
                className="rounded-full px-6 py-3 bg-cyan-400/90 text-slate-900 font-semibold hover:bg-cyan-300 transition"
              >
                Get started
              </Link>
              <Link
                href="/contact"
                className="rounded-full px-6 py-3 border border-white/20 hover:border-white/40 transition"
              >
                Talk to us
              </Link>
            </div>
          </GlassyCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-400 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} CoTeacher AI</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-200">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-200">Terms</Link>
            <Link href="/contact" className="hover:text-slate-200">Contact</Link>
          </div>
        </div>
      </footer>

      {/* Chatbot mount node */}
      <div id="site-chatbot-root" />

      {/* Inline floating chatbot (single-file, demo) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
(() => {
  const OPENAI_KEY = ${JSON.stringify(OPENAI_KEY)};
  if (!OPENAI_KEY) {
    console.warn("NEXT_PUBLIC_OPENAI_API_KEY is not set. Chatbot disabled.");
    return;
  }

  const root = document.getElementById("site-chatbot-root");
  if (!root) return;

  // Container
  const wrap = document.createElement("div");
  wrap.style.position = "fixed";
  wrap.style.right = "20px";
  wrap.style.bottom = "20px";
  wrap.style.zIndex = "9999";
  root.appendChild(wrap);

  // Toggle button
  const btn = document.createElement("button");
  btn.textContent = "Chat";
  btn.style.all = "unset";
  btn.style.cursor = "pointer";
  btn.style.background = "linear-gradient(135deg, rgba(34,211,238,.95), rgba(59,130,246,.95))";
  btn.style.color = "#0b1220";
  btn.style.fontWeight = "700";
  btn.style.padding = "10px 16px";
  btn.style.borderRadius = "9999px";
  btn.style.boxShadow = "0 10px 30px rgba(2,8,23,.35)";
  wrap.appendChild(btn);

  // Panel
  const panel = document.createElement("div");
  panel.style.display = "none";
  panel.style.width = "360px";
  panel.style.maxHeight = "520px";
  panel.style.background = "rgba(255,255,255,0.08)";
  panel.style.backdropFilter = "blur(14px)";
  panel.style.border = "1px solid rgba(255,255,255,.15)";
  panel.style.borderRadius = "16px";
  panel.style.boxShadow = "0 10px 30px rgba(2,8,23,.45)";
  panel.style.overflow = "hidden";
  panel.style.marginTop = "10px";
  wrap.appendChild(panel);

  // Header
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.alignItems = "center";
  header.style.justifyContent = "space-between";
  header.style.padding = "10px 12px";
  header.style.borderBottom = "1px solid rgba(255,255,255,.1)";
  header.style.color = "white";
  header.innerHTML = '<div style="font-weight:600">CoTeacher AI</div><div style="opacity:.7;font-size:12px">Tutor</div>';
  panel.appendChild(header);

  // Messages area
  const msgs = document.createElement("div");
  msgs.style.padding = "12px";
  msgs.style.height = "360px";
  msgs.style.overflow = "auto";
  msgs.style.color = "white";
  msgs.style.fontSize = "14px";
  msgs.style.lineHeight = "1.5";
  panel.appendChild(msgs);

  // Input row
  const form = document.createElement("form");
  form.style.display = "flex";
  form.style.gap = "8px";
  form.style.padding = "12px";
  form.style.borderTop = "1px solid rgba(255,255,255,.1)";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Ask about courses, features, or concepts…";
  input.required = true;
  input.style.flex = "1";
  input.style.background = "rgba(0,0,0,.25)";
  input.style.border = "1px solid rgba(255,255,255,.2)";
  input.style.borderRadius = "9999px";
  input.style.color = "white";
  input.style.height = "38px";
  input.style.padding = "0 12px";

  const send = document.createElement("button");
  send.type = "submit";
  send.textContent = "Send";
  send.style.all = "unset";
  send.style.cursor = "pointer";
  send.style.background = "rgba(165,243,252,.95)";
  send.style.color = "#0b1220";
  send.style.fontWeight = "700";
  send.style.padding = "8px 14px";
  send.style.borderRadius = "9999px";

  form.appendChild(input);
  form.appendChild(send);
  panel.appendChild(form);

  // Toggle behavior
  let open = false;
  btn.addEventListener("click", () => {
    open = !open;
    panel.style.display = open ? "block" : "none";
  });

  // Bubbles
  function addBubble(role, text) {
    const row = document.createElement("div");
    row.style.margin = "8px 0";
    row.style.display = "flex";
    row.style.justifyContent = role === "user" ? "flex-end" : "flex-start";

    const bubble = document.createElement("div");
    bubble.style.maxWidth = "78%";
    bubble.style.border = "1px solid rgba(255,255,255,.15)";
    bubble.style.borderRadius = "16px";
    bubble.style.padding = "8px 10px";
    bubble.style.whiteSpace = "pre-wrap";
    bubble.style.backdropFilter = "blur(8px)";
    bubble.style.background = role === "user" ? "rgba(34,211,238,.18)" : "rgba(255,255,255,.08)";
    bubble.style.color = "white";
    bubble.textContent = text;

    row.appendChild(bubble);
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  // Seed message
  addBubble("assistant", "Hi! I’m CoTeacher’s AI tutor. Ask anything about the platform or your course topics. I’ll guide with hints—not final answers.");

  // OpenAI call
  const history = [{ role: "system", content:
    "You are CoTeacher AI’s tutor. Be friendly, concise, and pedagogical. " +
    "NEVER provide direct final answers for graded questions; instead give hints, explanations, and step-by-step guidance. " +
    "Encourage integrity and learning." }];

  async function callOpenAI(question) {
    const payload = {
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [...history, { role: "user", content: question }],
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + OPENAI_KEY },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || res.statusText);
    }

    const data = await res.json();
    const answer = (data?.choices?.[0]?.message?.content || "").trim();
    history.push({ role: "user", content: question });
    history.push({ role: "assistant", content: answer });
    return answer;
  }

  // Submit
  let busy = false;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (busy) return;
    const q = input.value.trim();
    if (!q) return;

    addBubble("user", q);
    input.value = "";
    busy = true;

    try {
      const thinking = "Thinking…";
      addBubble("assistant", thinking);
      const before = msgs.lastChild;

      const answer = await callOpenAI(q);
      if (before) msgs.removeChild(before);
      addBubble("assistant", answer || "Sorry — I couldn’t find an answer.");
    } catch (err) {
      addBubble("assistant", "Oops — there was an error reaching the model.");
      console.error(err);
    } finally {
      busy = false;
    }
  });
})();
          `,
        }}
      />
    </>
  );
}