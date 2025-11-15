// app/products/classpark/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlassyCard } from "@/components/GlassyCard";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  ArrowRight,
  Sparkles,
  Mic,
  FileText,
  ListChecks,
  BookMarked,
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: "easeOut" as const },
});

export default function ClassParkPage() {
  const { user } = useAuth();
  const ctaHref = user ? "/products/classpark/app" : "/auth/signin";

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(251,146,60,0.12),transparent_60%)]" />
        <div className="absolute -top-28 left-1/4 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full blur-3xl bg-gradient-to-tr from-orange-500/18 via-amber-400/12 to-transparent" />
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
              ClassPark • After-Class Pack
            </span>
          </motion.div>

          <div className="grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-10 items-center">
            <motion.div {...fadeUp(0.05)}>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
                Turn each class into a{" "}
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                  clean after-class pack
                </span>
                .
              </h1>
              <p className="text-lg text-stone-700 max-w-xl mb-6">
                ClassPark listens to your class recordings and combines them with
                your slides to generate notes, a glossary, and 5 formative
                questions—ready to post to your LMS.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-stone-600">
                <span className="inline-flex items-center gap-2">
                  <Mic className="h-4 w-4 text-orange-500" />
                  Works with audio or recorded video
                </span>
                <span className="inline-flex items-center gap-2">
                  <FileText className="h-4 w-4 text-orange-500" />
                  Output as structured class summary
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link
                  href={ctaHref}
                  className="group inline-flex items-center justify-center rounded-full px-7 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-900 font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:from-orange-400 hover:to-amber-400 transition-all"
                >
                  Try ClassPark
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

            {/* Pack preview */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6 }}
            >
              <GlassyCard className="relative p-5 md:p-6 overflow-hidden">
                <div
                  aria-hidden
                  className="absolute -top-14 right-0 h-36 w-36 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.2),transparent)]"
                />
                <div className="relative space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookMarked className="h-5 w-5 text-orange-500" />
                      <span className="font-medium text-stone-900">
                        ClassPark Pack · Week 5
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500">
                      Ready to push to LMS
                    </span>
                  </div>

                  <div className="rounded-xl border border-stone-200 bg-white/90 px-3 py-2.5">
                    <p className="font-semibold text-stone-900 mb-1 text-xs">
                      1. Clean notes
                    </p>
                    <p className="text-[11px] text-stone-700">
                      Summary of the 55-minute class in 6 bullet points, aligned
                      to today&apos;s learning goals.
                    </p>
                  </div>

                  <div className="rounded-xl border border-stone-200 bg-white/90 px-3 py-2.5">
                    <p className="font-semibold text-stone-900 mb-1 text-xs">
                      2. Key glossary
                    </p>
                    <p className="text-[11px] text-stone-700">
                      &quot;Gradient descent&quot;, &quot;learning rate&quot;,
                      &quot;loss surface&quot; – each with a one-sentence
                      definition and example from class.
                    </p>
                  </div>

                  <div className="rounded-xl border border-stone-200 bg-white/90 px-3 py-2.5">
                    <p className="font-semibold text-stone-900 mb-1 text-xs">
                      3. 5 formative questions
                    </p>
                    <p className="text-[11px] text-stone-700">
                      Short auto-graded check-in questions that target the main
                      confusions from the recording.
                    </p>
                  </div>
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
                Professors who want students to leave class with clarity
              </h2>
            </motion.div>
            <motion.p
              className="md:col-span-2 text-stone-700"
              {...fadeUp(0.1)}
            >
              Use ClassPark when you&apos;re tired of &quot;What did we do
              today?&quot; or students falling behind after missing one meeting.
              Make every class feel complete—with notes and questions ready to
              review.
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
              How <span className="text-orange-400">ClassPark</span> works
            </motion.h2>
            <motion.p
              className="text-stone-600 max-w-2xl mx-auto"
              {...fadeUp(0.05)}
            >
              From raw recording to LMS-ready pack in one flow.
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
                title: "Upload or sync recording",
                icon: Mic,
                body: "Upload audio, video, or let ClassPark pull from your integrated recording tool.",
              },
              {
                step: "2",
                title: "We segment and summarize",
                icon: FileText,
                body: "We transcribe, detect topic shifts, and build a clean summary aligned to your lecture structure.",
              },
              {
                step: "3",
                title: "We build the After-Class Pack",
                icon: ListChecks,
                body: "We generate notes, glossary entries, and 5 formative questions ready to push to your LMS.",
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

      {/* Usage workflow */}
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
                Students always know what just happened—and what&apos;s next
              </h2>
              <p className="text-stone-700 mb-4">
                ClassPark works best when you treat the After-Class Pack as a
                ritual. Students come to expect the notes, glossary, and check-in
                questions after every meeting.
              </p>
              <ul className="space-y-2 text-sm text-stone-700">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                  Post packs to your LMS announcements or weekly modules.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                  Review which questions students miss most and adjust next class
                  accordingly.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                  Help absent students catch up without extra email back-and-forth.
                </li>
              </ul>
            </motion.div>

            {/* Animated segments */}
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
                  className="absolute inset-x-0 -top-10 h-28 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(251,146,60,0.2),transparent)]"
                />
                <div className="relative space-y-3 text-xs">
                  {["Intro & recap", "Core concept demo", "Group discussion", "Wrap-up & next steps"].map(
                    (segment, idx) => (
                      <motion.div
                        key={segment}
                        className="flex items-center justify-between rounded-xl border border-stone-200 bg-white/90 px-3 py-2.5"
                        initial={{ opacity: 0, x: idx % 2 === 0 ? -10 : 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ delay: 0.12 + idx * 0.06, duration: 0.3 }}
                      >
                        <div>
                          <p className="font-medium text-stone-900 text-xs">
                            {segment}
                          </p>
                          <p className="text-[11px] text-stone-500">
                            Marked and summarized as its own section
                          </p>
                        </div>
                        <span className="text-[11px] text-stone-500">
                          {idx === 0 && "0–10 min"}
                          {idx === 1 && "10–30 min"}
                          {idx === 2 && "30–45 min"}
                          {idx === 3 && "45–55 min"}
                        </span>
                      </motion.div>
                    )
                  )}
                </div>
              </GlassyCard>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}