// app/page.tsx
"use client";

import Link from "next/link";
import { GlassyCard } from "@/components/GlassyCard";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Lock,
  Shield,
  Presentation,
  FileText,
  MessageSquare,
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
        <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(251,146,60,0.12),transparent_60%)]" />
        {/* soft aurora sweep */}
        <div className="absolute -top-24 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full blur-3xl bg-gradient-to-tr from-orange-500/15 via-amber-400/10 to-transparent" />
      </div>

      {/* Hero */}
      <section className="relative pt-32 md:pt-40 pb-16">
        {/* subtle top halo */}
        <div
          aria-hidden
          className="absolute inset-x-0 -top-24 h-40 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(251,146,60,0.18),transparent)]"
        />
        <div className="mx-auto max-w-7xl px-4 text-center">
          {/* badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-1.5 mb-6 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            <span className="text-xs font-medium text-orange-700">
              Complete EdTech Suite
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              teach smarter
            </span>
          </h1>

          <p className="mt-6 text-stone-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Three powerful tools for modern educators: Create stunning presentations, 
            generate post-lecture materials, and provide AI-powered learning support—all in one platform.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="group rounded-full px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-900 font-semibold transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:from-orange-400 hover:to-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 flex items-center gap-2"
            >
              Get started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#how"
              className="rounded-full px-8 py-3.5 border-2 border-stone-300 hover:border-stone-400 bg-white/60 hover:bg-white/80 transition-all backdrop-blur-sm text-stone-800"
            >
              See how it works
            </Link>
          </div>

          {/* Trust strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-stone-600">
            <span className="inline-flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-500" />
              Built for educators
            </span>
            <span className="inline-flex items-center gap-2">
              <Lock className="h-4 w-4 text-orange-500" />
              Secure &amp; private
            </span>
            <span className="inline-flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              Easy to adopt
            </span>
          </div>

          {/* Demo */}
          <div className="mt-16 md:mt-20">
            <HeroDemo />
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="relative mt-24 md:mt-32" id="products">
        {/* section glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-6 h-24 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(251,146,60,0.12),transparent)]"
        />
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-orange-400">products</span>
            </h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              Three powerful tools designed for modern educators
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* ClassPark */}
            <GlassyCard className="group p-8 hover:border-orange-400/30 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-xl bg-orange-400/10 p-3 group-hover:bg-orange-400/20 transition-colors">
                  <FileText className="h-6 w-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold">ClassPark</h3>
              </div>
              <p className="text-stone-700 leading-relaxed mb-4">
                Transform class recordings into structured learning materials. 
                Generate post-lecture notes, glossaries, and formative questions automatically.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-stone-600">
                  <CheckCircle2 className="h-4 w-4 text-orange-500" />
                  Auto-generate notes from recordings
                </li>
                <li className="flex items-center gap-2 text-sm text-stone-600">
                  <CheckCircle2 className="h-4 w-4 text-orange-500" />
                  Create glossary &amp; 5 quiz questions
                </li>
                <li className="flex items-center gap-2 text-sm text-stone-600">
                  <CheckCircle2 className="h-4 w-4 text-orange-500" />
                  Direct LMS integration
                </li>
              </ul>
              <Link
                href="/products/classpark"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </GlassyCard>

            {/* SlidesDeck */}
            <GlassyCard className="group p-8 hover:border-orange-400/30 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-xl bg-amber-400/10 p-3 group-hover:bg-amber-400/20 transition-colors">
                  <Presentation className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold">SlidesDeck</h3>
              </div>
              <p className="text-stone-700 leading-relaxed mb-4">
                Professional presentation builder and generation studio. 
                Create stunning slides with AI assistance and design tools.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-stone-600">
                  <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  AI-powered slide generation
                </li>
                <li className="flex items-center gap-2 text-sm text-stone-600">
                  <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  Professional templates &amp; themes
                </li>
                <li className="flex items-center gap-2 text-sm text-stone-600">
                  <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  Export to multiple formats
                </li>
              </ul>
              <Link
                href="/products/slidesdeck"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </GlassyCard>

            {/* CoTeacher */}
            <GlassyCard className="group p-8 hover:border-orange-400/30 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-xl bg-orange-400/10 p-3 group-hover:bg-orange-400/20 transition-colors">
                  <MessageSquare className="h-6 w-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold">CoTeacher</h3>
              </div>
              <p className="text-stone-700 leading-relaxed mb-4">
                AI-powered learning assistant that knows your course materials. 
                Provides guided hints and explanations—never direct answers.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-stone-600">
                  <CheckCircle2 className="h-4 w-4 text-orange-500" />
                  Course-specific knowledge base
                </li>
                <li className="flex items-center gap-2 text-sm text-stone-600">
                  <CheckCircle2 className="h-4 w-4 text-orange-500" />
                  Academic integrity guardrails
                </li>
                <li className="flex items-center gap-2 text-sm text-stone-600">
                  <CheckCircle2 className="h-4 w-4 text-orange-500" />
                  Real-time source citations
                </li>
              </ul>
              <Link
                href="/products/coteacher"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </GlassyCard>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative mt-24 md:mt-32" id="how">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How it <span className="text-orange-400">works</span>
            </h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              Three simple steps to transform your course
            </p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Animated connector (desktop) */}
            <div
              aria-hidden
              className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-orange-400/20 via-amber-400/40 to-orange-400/20"
            />
            <div
              aria-hidden
              className="hidden md:block absolute top-11 left-[12%] right-[12%] h-px bg-orange-400/10"
            />

            {/* Step 1 */}
            <GlassyCard className="p-8 relative overflow-hidden">
              <div className="absolute -top-4 left-8">
                <div className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 p-3 shadow-lg shadow-orange-500/30">
                  <span className="text-slate-900 font-bold text-lg">1</span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">
                  Professor uploads course content
                </h3>
                <p className="text-stone-700 leading-relaxed">
                  Docs and slides are parsed and embedded. Multiple file formats
                  supported with automatic processing.
                </p>
              </div>
            </GlassyCard>

            {/* Step 2 */}
            <GlassyCard className="p-8 relative overflow-hidden">
              <div className="absolute -top-4 left-8">
                <div className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 p-3 shadow-lg shadow-orange-500/30">
                  <span className="text-slate-900 font-bold text-lg">2</span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">
                  We build a private knowledge base
                </h3>
                <p className="text-stone-700 leading-relaxed">
                  Per-course vector store with access controls. Secure, isolated,
                  and optimized for fast retrieval.
                </p>
              </div>
            </GlassyCard>

            {/* Step 3 */}
            <GlassyCard className="p-8 relative overflow-hidden">
              <div className="absolute -top-4 left-8">
                <div className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 p-3 shadow-lg shadow-orange-500/30">
                  <span className="text-slate-900 font-bold text-lg">3</span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">
                  Students learn with the tutor
                </h3>
                <p className="text-stone-700 leading-relaxed">
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
              className="absolute -inset-x-20 -top-24 h-48 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(251,146,60,0.15),transparent)]"
            />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Transform your teaching with DarasaHub
              </h3>
              <p className="mt-3 text-stone-700 text-lg max-w-2xl mx-auto">
                Join educators who are using ClassPark, SlidesDeck, and CoTeacher 
                to create better learning experiences. Start with one product or use them all together.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth/signup"
                  className="group rounded-full px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-900 font-semibold transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:from-orange-400 hover:to-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 flex items-center gap-2"
                >
                  Get started free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full px-8 py-3.5 border-2 border-stone-300 hover:border-stone-400 bg-white/60 hover:bg-white/80 transition-all backdrop-blur-sm text-stone-800"
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