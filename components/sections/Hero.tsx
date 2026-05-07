"use client";

import { motion, type Variants } from "framer-motion";

// ─── animation variants ───────────────────────────────────────────────────────

const textContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const mockupEntrance: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, ease: "easeOut" as const, delay: 0.35 },
  },
};

// ─── icons ────────────────────────────────────────────────────────────────────

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ─── mockup ───────────────────────────────────────────────────────────────────

function ProductMockup() {
  const bars = [40, 62, 48, 80, 55, 92, 70, 84, 63, 96, 74, 88];

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <div className="mx-auto h-5 w-48 rounded-md bg-zinc-100 dark:bg-zinc-800" />
      </div>

      <div className="space-y-4 p-5">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Revenue", value: "bg-indigo-500/25" },
            { label: "Users", value: "bg-emerald-500/25" },
            { label: "Uptime", value: "bg-violet-500/25" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/60"
            >
              <div className="h-2 w-10 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className={`mt-2 h-5 w-14 rounded ${value}`} />
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/60">
          <div className="mb-3 h-2 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="flex h-24 items-end gap-1">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-indigo-400/40 dark:bg-indigo-500/50"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Table rows */}
        <div className="space-y-2">
          {[
            { w: "w-28", accent: "bg-emerald-400/40" },
            { w: "w-20", accent: "bg-indigo-400/40" },
            { w: "w-24", accent: "bg-amber-400/40" },
          ].map(({ w, accent }, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-800/60"
            >
              <div className="h-6 w-6 flex-shrink-0 rounded-full bg-indigo-400/25" />
              <div className="flex-1 space-y-1.5">
                <div className={`h-2 ${w} rounded bg-zinc-200 dark:bg-zinc-700`} />
                <div className="h-1.5 w-16 rounded bg-zinc-100 dark:bg-zinc-700/50" />
              </div>
              <div className={`h-2 w-8 rounded ${accent}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── component ────────────────────────────────────────────────────────────────

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden py-20 sm:py-28"
    >
      {/* Ambient gradient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 -z-10 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-0 -z-10 h-[440px] w-[440px] rounded-full bg-violet-500/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* ── Text column ── */}
          <motion.div
            className="flex flex-col items-start"
            variants={textContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-x-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                Now in public beta
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]"
            >
              Ship your SaaS{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                10× faster
              </span>{" "}
              than ever before
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-lg text-lg leading-8 text-zinc-600 dark:text-zinc-400"
            >
              SaaSify gives your team the infrastructure, analytics, and
              collaboration tools to go from idea to production — without the
              operational overhead.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <motion.a
                href="#pricing"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started free
              </motion.a>

              <motion.a
                href="#about"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex h-11 items-center justify-center gap-x-2 rounded-lg border border-zinc-300 bg-white px-6 text-sm font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                See how it works
                <ArrowRightIcon className="h-4 w-4" />
              </motion.a>
            </motion.div>

            {/* Social proof */}
            <motion.p
              variants={fadeUp}
              className="mt-8 text-sm text-zinc-500 dark:text-zinc-500"
            >
              Trusted by{" "}
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                2,000+
              </span>{" "}
              teams. No credit card required.
            </motion.p>
          </motion.div>

          {/* ── Mockup column ── */}
          <motion.div
            variants={mockupEntrance}
            initial="hidden"
            animate="visible"
          >
            {/* Continuous float */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ProductMockup />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
