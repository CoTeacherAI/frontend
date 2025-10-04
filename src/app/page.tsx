import Link from "next/link";
import { GlassyCard } from "@/components/GlassyCard";
import { Shield, Sparkles, Upload } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import HeroDemo from "@/components/HeroDemo";

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
    </>
  );
}