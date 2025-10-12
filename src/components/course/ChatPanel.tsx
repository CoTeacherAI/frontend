"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

type ChatMsg = { role: "user" | "assistant"; content: string };

export default function ChatPanel({ courseId }: { courseId: string }) {
  const [chat, setChat] = useState<ChatMsg[]>([
    { role: "assistant", content: "Hi! I’m your course AI. Ask me about this class." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chat, scrollToBottom]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const content = input.trim();
    if (!content) return;

    const userMsg: ChatMsg = { role: "user", content };
    setChat((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/course-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, messages: [...chat, userMsg] }),
      });

      if (!res.ok) {
        const fallback: ChatMsg = {
          role: "assistant",
          content:
            "This is a placeholder response. Connect `/api/course-chat` to your AI backend to get course-specific answers.",
        };
        setChat((prev) => [...prev, fallback]);
        return;
      }

      const data = (await res.json()) as { reply?: string };
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: (data.reply ?? "").trim() || "No answer generated." },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: "Network error while contacting the chat backend." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl h-[70vh] md:h-[78vh] flex flex-col">
      <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2 text-slate-200">
        <Sparkles className="h-4 w-4 text-cyan-300" />
        <span className="font-semibold">Course AI Chat</span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      >
        {chat.map((m, i) => (
          <div
            key={i}
            className={`max-w-[900px] ${
              m.role === "assistant" ? "" : "ml-auto"
            }`}
          >
            <div
              className={`w-fit rounded-2xl px-4 py-2 text-sm md:text-[15px] leading-relaxed border
              ${
                m.role === "assistant"
                  ? "bg-white/10 border-white/15"
                  : "bg-cyan-500/20 border-cyan-400/30"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <form
        onSubmit={sendMessage}
        className="p-3 border-t border-white/10"
      >
        <div className="relative flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this course…"
            rows={1}
            className="min-h-[44px] max-h-40 flex-1 resize-none rounded-xl bg-white/5 border border-white/20 px-3 py-2 text-white outline-none focus:border-cyan-300"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="rounded-xl bg-cyan-400/90 px-4 py-2 font-semibold text-slate-900 transition hover:bg-cyan-300 disabled:opacity-50"
          >
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
