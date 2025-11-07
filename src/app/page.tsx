// app/page.tsx
"use client";

import Link from "next/link";
import { GlassyCard } from "@/components/GlassyCard";
import {
  Sparkles,
  Upload,
  ArrowRight,
  CheckCircle2,
  Zap,
  Lock,
  Shield,
} from "lucide-react";
import HeroDemo from "@/components/HeroDemo";

export default function Page() {
  return (
    <>
      {/* Global decorative background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
      >
        {/* star grid */}
        <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(34,211,238,0.12),transparent_60%)]" />
        {/* soft aurora sweep */}
        <div className="absolute -top-24 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full blur-3xl bg-gradient-to-tr from-cyan-500/15 via-cyan-300/10 to-transparent" />
      </div>

      {/* Hero */}
      <section className="relative pt-32 md:pt-40 pb-16">
        {/* subtle top halo */}
        <div
          aria-hidden
          className="absolute inset-x-0 -top-24 h-40 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(34,211,238,0.18),transparent)]"
        />
        <div className="mx-auto max-w-7xl px-4 text-center">
          {/* badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-1.5 mb-6 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            <span className="text-xs font-medium text-cyan-200">
              AI-Powered Learning Assistant
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Every course gets its own{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300 bg-clip-text text-transparent">
              AI co-teacher
            </span>
          </h1>

          <p className="mt-6 text-slate-300/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Professors upload materials. The AI analyzes and stores them privately
            for each course. Students learn faster with guided hints—never final
            answers.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="group rounded-full px-8 py-3.5 bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-900 font-semibold transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:from-cyan-300 hover:to-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 flex items-center gap-2"
            >
              Get started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#how"
              className="rounded-full px-8 py-3.5 border-2 border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              See how it works
            </Link>
          </div>

          {/* Trust strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-300" />
              Instructor controls AI on/off
            </span>
            <span className="inline-flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyan-300" />
              Per-course private knowledge
            </span>
          </div>

          {/* Demo */}
          <div className="mt-16 md:mt-20">
            <HeroDemo />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative mt-24 md:mt-32" id="features">
        {/* section glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-6 h-24 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(34,211,238,0.12),transparent)]"
        />
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to <span className="text-cyan-300">teach smarter</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Powerful features designed for modern education
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Upload & organize */}
            <GlassyCard className="group p-8 hover:border-cyan-300/30 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-xl bg-cyan-300/10 p-3 group-hover:bg-cyan-300/20 transition-colors">
                  <Upload className="h-6 w-6 text-cyan-300" />
                </div>
                <h3 className="text-xl font-semibold">Upload &amp; organize</h3>
              </div>
              <p className="text-slate-300/90 leading-relaxed">
                PDFs, slides, and docs—ingested and indexed for precise retrieval.
                Supports multiple formats with automatic parsing.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  PDF, DOCX, PPTX support
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  Automatic text extraction
                </li>
              </ul>
            </GlassyCard>

            {/* Course-tuned AI */}
            <GlassyCard className="group p-8 hover:border-cyan-300/30 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-xl bg-cyan-300/10 p-3 group-hover:bg-cyan-300/20 transition-colors">
                  <Zap className="h-6 w-6 text-cyan-300" />
                </div>
                <h3 className="text-xl font-semibold">Course-tuned AI</h3>
              </div>
              <p className="text-slate-300/90 leading-relaxed">
                Chat with an AI that knows your syllabus, not the whole internet.
                Context-aware responses with source citations.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  Private knowledge base
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  Real-time citations
                </li>
              </ul>
            </GlassyCard>

            {/* Integrity guardrails */}
            <GlassyCard className="group p-8 hover:border-cyan-300/30 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-xl bg-cyan-300/10 p-3 group-hover:bg-cyan-300/20 transition-colors">
                  <Lock className="h-6 w-6 text-cyan-300" />
                </div>
                <h3 className="text-xl font-semibold">Integrity guardrails</h3>
              </div>
              <p className="text-slate-300/90 leading-relaxed">
                Hints and scaffolding only—no direct answers to graded work.
                Maintains academic integrity automatically.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  Graded item protection
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  Guided learning only
                </li>
              </ul>
            </GlassyCard>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative mt-24 md:mt-32" id="how">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How it <span className="text-cyan-300">works</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Three simple steps to transform your course
            </p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Animated connector (desktop) */}
            <div
              aria-hidden
              className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-cyan-300/20 via-cyan-300/40 to-cyan-300/20"
            />
            <div
              aria-hidden
              className="hidden md:block absolute top-11 left-[12%] right-[12%] h-px bg-cyan-300/10"
            />

            {/* Step 1 */}
            <GlassyCard className="p-8 relative overflow-hidden">
              <div className="absolute -top-4 left-8">
                <div className="rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 p-3 shadow-lg shadow-cyan-500/30">
                  <span className="text-slate-900 font-bold text-lg">1</span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">
                  Professor uploads course content
                </h3>
                <p className="text-slate-300/90 leading-relaxed">
                  Docs and slides are parsed and embedded. Multiple file formats
                  supported with automatic processing.
                </p>
              </div>
            </GlassyCard>

            {/* Step 2 */}
            <GlassyCard className="p-8 relative overflow-hidden">
              <div className="absolute -top-4 left-8">
                <div className="rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 p-3 shadow-lg shadow-cyan-500/30">
                  <span className="text-slate-900 font-bold text-lg">2</span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">
                  We build a private knowledge base
                </h3>
                <p className="text-slate-300/90 leading-relaxed">
                  Per-course vector store with access controls. Secure, isolated,
                  and optimized for fast retrieval.
                </p>
              </div>
            </GlassyCard>

            {/* Step 3 */}
            <GlassyCard className="p-8 relative overflow-hidden">
              <div className="absolute -top-4 left-8">
                <div className="rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 p-3 shadow-lg shadow-cyan-500/30">
                  <span className="text-slate-900 font-bold text-lg">3</span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">
                  Students learn with the tutor
                </h3>
                <p className="text-slate-300/90 leading-relaxed">
                  Guided explanations and practice—not solutions. Always
                  learning, never cheating.
                </p>
              </div>
            </GlassyCard>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mt-24 md:mt-32 mb-24">
        <div className="mx-auto max-w-5xl px-4">
          <GlassyCard className="p-10 md:p-12 text-center relative overflow-hidden">
            {/* ambient shine */}
            <div
              aria-hidden
              className="absolute -inset-x-20 -top-24 h-48 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(34,211,238,0.15),transparent)]"
            />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Bring CoTeacher AI to your next course
              </h3>
              <p className="mt-3 text-slate-300/90 text-lg max-w-2xl mx-auto">
                Launch a pilot with a single class, then scale across your
                institution. Join educators who are transforming how students
                learn.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth/signup"
                  className="group rounded-full px-8 py-3.5 bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-900 font-semibold transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:from-cyan-300 hover:to-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 flex items-center gap-2"
                >
                  Get started free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full px-8 py-3.5 border-2 border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  Talk to us
                </Link>
              </div>
            </div>
          </GlassyCard>
        </div>
      </section>
    </>
  );
}