"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Shield,
  Database,
  MessageSquare,
  FileText,
  Video,
  Image as ImageIcon,
  Check,
  BookOpenText,
} from "lucide-react";

type Step = 0 | 1 | 2; // 0=Upload, 1=Analyze/Store, 2=Tutor Chat

export default function HeroDemo() {
  const [step, setStep] = useState<Step>(0);

  // Auto-advance scenes and loop
  useEffect(() => {
    const t0 = setTimeout(() => setStep(1), 3500);
    const t1 = setTimeout(() => setStep(2), 7000);
    const loop = setInterval(() => {
      setStep((s) => (((s + 1) % 3) as Step));
    }, 12000);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearInterval(loop);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-stone-200/60 bg-white/70 backdrop-blur-xl px-5 py-6 md:px-8 md:py-8">
      <Timeline step={step} />
      <div className="mt-5 md:mt-7">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="upload" {...fadeSlideBig}>
              <UploadScene />
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="analyze" {...fadeSlideBig}>
              <AnalyzeScene />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="chat" {...fadeSlideBig}>
              <ChatScene />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const fadeSlideBig = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -18, scale: 0.98 },
  transition: { duration: 0.35 },
};

function Timeline({ step }: { step: Step }) {
  const items = [
    { icon: Upload, label: "Upload" },
    { icon: Database, label: "Analyze & Store" },
    { icon: MessageSquare, label: "Tutor Chat" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-3 md:gap-4">
      {items.map((it, i) => {
        const active = step >= (i as Step);
        return (
          <div key={it.label} className="flex items-center gap-2">
            <div
              className={
                "h-9 w-9 grid place-items-center rounded-full border " +
                (active ? "border-orange-500/60 bg-orange-100/60" : "border-stone-300/60 bg-stone-100/40")
              }
            >
              <it.icon className={active ? "h-4.5 w-4.5 text-orange-500" : "h-4.5 w-4.5 text-stone-400"} />
            </div>
            <span className={"text-sm md:text-base " + (active ? "text-stone-900" : "text-stone-600")}>
              {it.label}
            </span>
            {i < items.length - 1 && <div className="w-10 md:w-14 h-px bg-stone-300/60 mx-1.5 md:mx-2" />}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------- Scene 0: Professor uploads ---------------------- */

function UploadScene() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(0);
    const id = setInterval(() => setProgress((p) => (p >= 100 ? 100 : p + 3)), 60);
    return () => clearInterval(id);
  }, []);

  const files = [
    { icon: FileText, name: "Syllabus.pdf", size: "342 KB" },
    { icon: FileText, name: "Lecture_01_Intro.pdf", size: "1.1 MB" },
    { icon: FileText, name: "Slides_02_Processes.pptx", size: "3.2 MB" },
    { icon: Video, name: "OS_03_Threads.mp4", size: "84 MB" },
    { icon: ImageIcon, name: "diagram_context_switch.png", size: "220 KB" },
  ];

  return (
    <div className="rounded-2xl border border-stone-200/60 bg-white/50 p-4 md:p-6">
      <div className="flex items-center gap-2">
        <Upload className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg md:text-xl font-semibold">Professor uploads course content</h3>
      </div>
      <p className="mt-1 text-sm md:text-base text-stone-700">
        Drag & drop materials — we&apos;ll parse and index everything securely.
      </p>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-stone-200/60 bg-white/50 p-3 md:p-4">
          <div className="text-xs uppercase tracking-wide text-stone-600">Files</div>
          <ul className="mt-2 space-y-2">
            {files.map((f) => (
              <li key={f.name} className="flex items-center justify-between rounded-lg border border-stone-200/60 bg-white/60 px-2.5 py-1.5">
                <div className="flex items-center gap-2">
                  <f.icon className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-stone-800">{f.name}</span>
                </div>
                <span className="text-xs text-stone-600">{f.size}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-stone-200/60 bg-white/50 p-3 md:p-4">
          <div className="text-xs uppercase tracking-wide text-stone-600">Upload progress</div>
          <div className="mt-2 h-3 w-full rounded-full bg-stone-200/60 overflow-hidden">
            <motion.div
              className="h-full bg-orange-500"
              style={{ borderRadius: 9999 }}
              animate={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              transition={{ ease: "easeOut", duration: 0.2 }}
            />
          </div>
          <div className="mt-2 text-xs text-stone-700">{progress}%</div>
          <div className="mt-3 text-xs text-stone-600">Secure upload with per-course access control.</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------ Scene 1: Analyze & Store (RAG prep) ----------------- */

function AnalyzeScene() {
  const rows = [
    { icon: BookOpenText, title: "Chunk & parse", desc: "Structure-aware text & media extraction." },
    { icon: Database, title: "Embed & store", desc: "Per-course vector namespace with lineage." },
    { icon: Shield, title: "Guardrails set", desc: "Graded items locked; hints-only mode enabled." },
  ];
  return (
    <div className="rounded-2xl border border-stone-200/60 bg-white/50 p-4 md:p-6">
      <div className="flex items-center gap-2">
        <Database className="h-5 w-5 text-amber-500" />
        <h3 className="text-lg md:text-xl font-semibold">AI analyzes content and stores it for the course</h3>
      </div>
      <p className="mt-1 text-sm md:text-base text-stone-700">
        We build a private knowledge base for this class. Retrieval adds citations; answers follow integrity rules.
      </p>

      <div className="mt-4 grid md:grid-cols-3 gap-4">
        {rows.map((r, i) => (
          <motion.div
            key={r.title}
            className="rounded-xl border border-stone-200/60 bg-white/50 p-3 md:p-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <div className="flex items-center gap-2">
              <r.icon className="h-4.5 w-4.5 text-amber-500" />
              <div className="font-medium text-stone-900">{r.title}</div>
            </div>
            <div className="mt-1 text-sm text-stone-700">{r.desc}</div>
            <motion.div
              className="mt-3 h-2 w-full rounded-full bg-stone-200/60 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <motion.div
                className="h-full bg-amber-500"
                style={{ borderRadius: 9999 }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, delay: 0.2 * i }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-stone-200/60 bg-white/50 p-3 md:p-4">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-amber-500" />
          <div className="text-sm md:text-base text-stone-800">
            Course KB: <span className="font-medium">Operating Systems</span> • 124 chunks • citations on
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Scene 2: Tutor Chat (Operating Systems) --------------- */

function ChatScene() {
  return (
    <div className="rounded-2xl border border-stone-200/60 bg-white/50 p-4 md:p-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg md:text-xl font-semibold">Student chats with the AI tutor</h3>
      </div>
      <p className="mt-1 text-sm md:text-base text-stone-700">Topic: Operating Systems — Understanding context switches.</p>

      <div className="mt-4 space-y-3 md:space-y-4">
        <Bubble who="student">What is a context switch and why is it needed?</Bubble>
        <Typing />
        <Bubble who="ai">
          A <b>context switch</b> is when the CPU stops running one process/thread and resumes another. The OS saves the
          current process’s state (registers, program counter, stack pointer) into its <i>PCB</i>, then restores the next
          process’s state. It’s needed for <b>preemptive multitasking</b> so many programs can share one CPU fairly.
          <div className="mt-2">
            <HintList items={[
              "List what the OS must save in the PCB.",
              "Is the switch triggered by a timer interrupt or a system call?",
              "Estimate the overhead: why is it not free?"
            ]}/>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip>Lecture 5 notes</Chip>
            <Chip>Section 2.3 (Scheduling)</Chip>
            <Chip>Example: non-identical practice</Chip>
          </div>
        </Bubble>

        <Bubble who="student">How does this relate to threads vs processes?</Bubble>
        <Typing />
        <Bubble who="ai">
          Switching between <b>threads</b> of the same process is cheaper (same address space); between different
          <b> processes</b> is more expensive (MMU/TLB implications). Try describing one trade-off of frequent switches.
        </Bubble>
      </div>

      <div className="mt-3 text-xs text-stone-600">
        Guided hints—no final solutions to graded items. Sources are always cited in-course.
      </div>
    </div>
  );
}

function Bubble({ who, children }: { who: "student" | "ai"; children: React.ReactNode }) {
  const isAI = who === "ai";
  return (
    <div className={"max-w-full md:max-w-[900px] " + (isAI ? "" : "ml-auto")}>
      <div
        className={
          "rounded-2xl px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base " +
          (isAI
            ? "bg-white/60 border border-stone-200/60 text-stone-900"
            : "bg-orange-100 border border-orange-300/60 text-stone-900")
        }
      >
        {children}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="w-20">
      <motion.div
        className="flex gap-1"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15, repeat: Infinity } } }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-white/60"
            variants={{ hidden: { opacity: 0.3, y: 0 }, show: { opacity: [0.3, 1, 0.3], y: [0, -2, 0] } }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />
        ))}
      </motion.div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-xs">
      {children}
    </span>
  );
}

function HintList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 list-disc list-inside text-sm text-stone-700">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}