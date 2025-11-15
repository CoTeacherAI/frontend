// app/products/coteacher/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlassyCard } from "@/components/GlassyCard";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  ArrowRight,
  Sparkles,
  MessageCircle,
  BookOpen,
  Shield,
  Lock,
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: "easeOut" as const },
});

export default function CoTeacherPage() {
  const { user } = useAuth();
  const ctaHref = user ? "/products/coteacher/app" : "/auth/signin";

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(251,146,60,0.12),transparent_60%)]" />
        <div className="absolute -top-28 right-1/4 h-[34rem] w-[34rem] translate-x-1/2 rounded-full blur-3xl bg-gradient-to-tr from-orange-500/18 via-amber-400/12 to-transparent" />
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
              coteacher • Course-tuned co-teacher
            </span>
          </motion.div>

          <div className="grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-10 items-center">
            <motion.div {...fadeUp(0.05)}>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
                Give every course its own{" "}
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                  co-teacher
                </span>{" "}
                that knows your syllabus.
              </h1>
              <p className="text-lg text-stone-700 max-w-xl mb-6">
                coteacher answers student questions using your readings, slides,
                and notes—nothing else. You stay in control of what it sees and
                how it responds.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-stone-600">
                <span className="inline-flex items-center gap-2">
                  <Shield className="h-4 w-4 text-orange-500" />
                  Instructor controls what coteacher can access
                </span>
                <span className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4 text-orange-500" />
                  Per-course private knowledge bases
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link
                  href={ctaHref}
                  className="group inline-flex items-center justify-center rounded-full px-7 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-900 font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:from-orange-400 hover:to-amber-400 transition-all"
                >
                  Use coteacher
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

            {/* Chat preview */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6 }}
            >
              <GlassyCard className="relative p-5 md:p-6 overflow-hidden">
                <div
                  aria-hidden
                  className="absolute -top-14 left-0 h-36 w-36 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.2),transparent)]"
                />
                <div className="relative space-y-3 text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-orange-500" />
                    <span className="font-medium text-stone-900">coteacher · ECO 101</span>
                  </div>

                  {/* Student message */}
                  <motion.div
                    className="ml-auto max-w-[85%] rounded-2xl bg-orange-500 text-slate-900 px-3 py-2.5 text-xs shadow-sm"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18, duration: 0.35 }}
                  >
                    I&apos;m confused about how supply shifts vs quantity supplied
                    changing. Is there an example from our Week 2 reading?
                  </motion.div>

                  {/* coteacher answer */}
                  <motion.div
                    className="max-w-[90%] rounded-2xl bg-white/90 border border-stone-200 px-3 py-2.5 text-xs text-stone-800"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25, duration: 0.35 }}
                  >
                    Great question. In <span className="underline">Mankiw, Ch. 4, p. 78</span>, we
                    use the coffee market as an example:
                    <br />
                    <br />
                    • A <span className="font-medium">supply shift</span> happens when something
                    like input cost changes (e.g. a frost damages coffee plants).
                    <br />
                    • A <span className="font-medium">change in quantity supplied</span> is just
                    moving along the curve as price changes.
                    <br />
                    <br />
                    Check the figure &quot;Increase in Supply&quot; in your Week 2 slides,
                    slide 11. That diagram matches this example.
                    <p className="mt-2 text-[10px] text-stone-500">
                      Answered from: Week 2 reading &amp; lecture slides
                    </p>
                  </motion.div>
                </div>
              </GlassyCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="relative mt-12">
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
                Courses with lots of questions and dense readings
              </h2>
            </motion.div>
            <motion.p
              className="md:col-span-2 text-stone-700"
              {...fadeUp(0.1)}
            >
              Use coteacher in classes where students regularly ask for
              clarification on readings, proofs, or problem sets. Keep support
              flowing 24/7 without giving away answers or lowering the bar.
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
              How <span className="text-orange-400">coteacher</span> works
            </motion.h2>
            <motion.p
              className="text-stone-600 max-w-2xl mx-auto"
              {...fadeUp(0.05)}
            >
              Keep answers grounded in your own materials—with guardrails you
              control.
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
                title: "Upload course materials",
                icon: BookOpen,
                body: "Upload syllabi, lecture slides, readings, and handouts. Choose which sets of materials coteacher is allowed to use.",
              },
              {
                step: "2",
                title: "Build a private knowledge base",
                icon: Shield,
                body: "We embed and index your content per course. No cross-course leakage, no mixing with the public internet.",
              },
              {
                step: "3",
                title: "Students ask, coteacher cites",
                icon: MessageCircle,
                body: "Students get guided explanations with citations back to your content—so they can always check the source.",
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

      {/* Usage & guardrails */}
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
                Guardrails designed for academic integrity
              </h2>
              <p className="text-stone-700 mb-4">
                coteacher is not a solution generator. It&apos;s a teaching
                companion that nudges students in the right direction without
                giving away answers to graded work.
              </p>
              <ul className="space-y-2 text-sm text-stone-700">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                  Flag specific docs or sections as &quot;graded&quot; to block
                  direct answers and switch into hints-only mode.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                  Review anonymous transcripts of questions to see where students
                  struggle most.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                  Turn coteacher on or off at any time per course.
                </li>
              </ul>
            </motion.div>

            {/* Animated Q&A timeline */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.08, duration: 0.5 }}
            >
              <GlassyCard className="relative p-5 overflow-hidden">
                <div
                  aria-hidden
                  className="absolute left-5 top-4 bottom-4 w-px bg-gradient-to-b from-orange-400/40 via-amber-300/40 to-transparent"
                />
                <div className="relative space-y-4 text-xs">
                  {[
                    "Student asks about a tricky definition.",
                    "coteacher responds with a simple explanation and an example from your slides.",
                    "Student asks about a graded problem.",
                    "coteacher switches to hint mode and points them to a similar solved example.",
                  ].map((text, idx) => (
                    <motion.div
                      key={idx}
                      className="relative pl-6"
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -10 : 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ delay: 0.15 + idx * 0.06, duration: 0.3 }}
                    >
                      <div className="absolute left-1 top-1.5 h-2 w-2 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400" />
                      <div className="rounded-xl border border-stone-200 bg-white/90 px-3 py-2 text-stone-800">
                        {text}
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