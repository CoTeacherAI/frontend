// app/products/slidesdeck/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlassyCard } from "@/components/GlassyCard";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  ArrowRight,
  Sparkles,
  FileText,
  MonitorPlay,
  Wand2,
  Upload,
  CheckCircle2,
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: "easeOut" as const },
});

export default function SlidesDeckPage() {
  const { user } = useAuth();
  const ctaHref = user ? "/products/slidesdeck" : "/auth/signin";

  return (
    <>
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(251,146,60,0.12),transparent_60%)]" />
        <div className="absolute -top-32 left-1/3 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full blur-3xl bg-gradient-to-tr from-orange-500/15 via-amber-400/10 to-transparent" />
      </div>

      {/* Hero */}
      <section className="relative pt-28 md:pt-32 pb-16">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-1.5 mb-6 backdrop-blur"
            {...fadeUp(0)}
          >
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            <span className="text-xs font-medium text-orange-700">
              SlidesDeck • Presentation studio
            </span>
          </motion.div>

          <div className="grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-10 items-center">
            <motion.div {...fadeUp(0.05)}>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
                Turn messy outlines into{" "}
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                  polished decks
                </span>{" "}
                in minutes.
              </h1>
              <p className="text-lg text-stone-700 max-w-xl mb-6">
                SlidesDeck is your presentation builder and generation studio. Upload
                notes, outlines, or old slides and generate clean, teachable decks
                you&apos;re proud to present.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-stone-600">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-500" />
                  From rough notes to lecture-ready slides
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-500" />
                  Control structure, style, and level of detail
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link
                  href={ctaHref}
                  className="group inline-flex items-center justify-center rounded-full px-7 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-900 font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:from-orange-400 hover:to-amber-400 transition-all"
                >
                  Try SlidesDeck
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#how"
                  className="inline-flex items-center justify-center rounded-full px-7 py-3.5 border border-stone-300 bg-white/60 hover:bg-white/80 text-stone-800 text-sm font-medium transition-all"
                >
                  See how it works
                </Link>
              </div>
            </motion.div>

            {/* Animated preview card */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              <GlassyCard className="relative p-6 md:p-7 overflow-hidden">
                <div
                  aria-hidden
                  className="absolute -top-16 right-0 h-40 w-40 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.22),transparent)]"
                />
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-orange-500" />
                      <span className="text-sm font-medium text-stone-900">
                        Week 3 — Intro to Algorithms
                      </span>
                    </div>
                    <span className="text-xs text-stone-500">Draft · Auto-generated</span>
                  </div>

                  {/* Slide row */}
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white/80 px-3 py-2.5"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.06, duration: 0.35 }}
                      >
                        <div className="h-8 w-10 rounded-md bg-gradient-to-tr from-orange-400/70 via-amber-300/70 to-orange-300/70" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-stone-900">
                            {i === 1 && "Slide 1 · Why algorithms matter"}
                            {i === 2 && "Slide 2 · Big-O intuition with visuals"}
                            {i === 3 && "Slide 3 · Stable vs unstable sorting"}
                          </p>
                          <p className="text-[11px] text-stone-500">
                            Auto-structured from your notes
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-xs text-stone-600">
                      <Wand2 className="h-4 w-4 text-orange-500" />
                      <span>Adjust depth &amp; teaching style in one click</span>
                    </div>
                    <button className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium bg-orange-500/90 text-slate-900 hover:bg-orange-400 transition">
                      Open in editor
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </GlassyCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="relative mt-10 md:mt-16">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            className="grid md:grid-cols-3 gap-5"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div {...fadeUp(0.05)}>
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-500 mb-1">
                Who it&apos;s for
              </p>
              <h2 className="text-2xl font-semibold text-stone-900">
                Built for busy instructors and teaching teams
              </h2>
            </motion.div>
            <motion.p
              className="md:col-span-2 text-stone-700"
              {...fadeUp(0.1)}
            >
              Use SlidesDeck when you know what you want to teach but don&apos;t
              have time to fight with slide formatting. From first-year intro
              courses to advanced seminars, keep structure consistent and
              visuals clean without extra design work.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative mt-20 md:mt-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-10">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-3"
              {...fadeUp(0)}
            >
              How SlidesDeck <span className="text-orange-400">works</span>
            </motion.h2>
            <motion.p
              className="text-stone-600 max-w-2xl mx-auto"
              {...fadeUp(0.05)}
            >
              Three simple steps from raw material to lecture-ready decks.
            </motion.p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-6">
            <div
              aria-hidden
              className="hidden md:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-orange-400/20 via-amber-400/40 to-orange-400/20"
            />
            <div
              aria-hidden
              className="hidden md:block absolute top-9 left-[12%] right-[12%] h-px bg-orange-400/10"
            />

            {[
              {
                step: "1",
                title: "Upload or start from a prompt",
                icon: Upload,
                body: "Drop in notes, slides, outlines, or start with a topic. SlidesDeck reads your materials and identifies key teaching moments.",
              },
              {
                step: "2",
                title: "Generate & shape your deck",
                icon: MonitorPlay,
                body: "Auto-generated slides come with titles, bullets, and diagrams. Adjust depth, pacing, and examples with simple controls.",
              },
              {
                step: "3",
                title: "Export & reuse across terms",
                icon: FileText,
                body: "Export to your slide format of choice and reuse decks next semester—update just the parts you need in minutes.",
              },
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                {...fadeUp(0.08 + idx * 0.05)}
              >
                <GlassyCard className="relative p-7 h-full overflow-hidden">
                  <div className="absolute -top-4 left-6">
                    <div className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 p-3 shadow-lg shadow-orange-500/30">
                      <span className="text-slate-900 font-bold text-lg">
                        {item.step}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-3 mb-3">
                    <div className="rounded-xl bg-orange-400/10 p-2.5">
                      <item.icon className="h-5 w-5 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-stone-900">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {item.body}
                  </p>
                </GlassyCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage workflow animation */}
      <section className="relative mt-20 md:mt-24 mb-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            className="grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-8 items-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div {...fadeUp(0)}>
              <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-stone-900">
                See your deck take shape in real time
              </h2>
              <p className="text-stone-700 mb-4">
                The SlidesDeck editor is built for iteration. Refine talking
                points, add diagrams, and keep everything aligned to your
                learning goals.
              </p>
              <ul className="space-y-2 text-sm text-stone-700">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                  Live preview of generated slides as you tweak structure and
                  emphasis.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                  Save templates per course so your decks feel consistent across
                  the semester.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                  Export to PPTX or keep everything inside DarasaHub.
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.05, duration: 0.5 }}
            >
              <GlassyCard className="relative p-5 overflow-hidden">
                <div
                  aria-hidden
                  className="absolute inset-x-0 -top-10 h-28 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(251,146,60,0.2),transparent)]"
                />
                <div className="relative space-y-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white/80 px-3 py-2.5"
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -10 : 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ delay: 0.1 + idx * 0.07, duration: 0.3 }}
                    >
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-orange-400 via-amber-300 to-orange-300" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-stone-900">
                          {idx === 0 && "Intro slide rewritten for clarity"}
                          {idx === 1 && "Example reframed with student context"}
                          {idx === 2 && "Key definition highlighted in bold"}
                          {idx === 3 && "Exit ticket slide added"}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          Adjusted with a single prompt
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassyCard>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}