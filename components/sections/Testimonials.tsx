"use client";

import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";

// ─── variants ─────────────────────────────────────────────────────────────────

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

// ─── data ─────────────────────────────────────────────────────────────────────

interface Testimonial {
  _id: string;
  quote: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;
}

// ─── sub-components ───────────────────────────────────────────────────────────

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4 text-amber-400"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 8C6.686 8 4 10.686 4 14v10h10V14H7.5c0-1.38 1.12-2.5 2.5-2.5V8zm18 0c-3.314 0-6 2.686-6 6v10h10V14h-6.5c0-1.38 1.12-2.5 2.5-2.5V8z" />
    </svg>
  );
}

// ─── component ────────────────────────────────────────────────────────────────

export function Testimonials() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Testimonial[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const localRaw = localStorage.getItem("admin-testimonials");
        if (localRaw) {
          const localParsed = JSON.parse(localRaw) as unknown;
          if (Array.isArray(localParsed) && localParsed.length > 0) {
            setItems(localParsed as Testimonial[]);
            setLoading(false);
            return;
          }
        }

        const response = await fetch("/api/testimonials");
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data: unknown = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected response format from /api/testimonials");
        }
        setItems(data as Testimonial[]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load testimonials"
        );
      } finally {
        setLoading(false);
      }
    };
    void loadTestimonials();
  }, []);

  return (
    <section
      id="testimonials"
      className="bg-zinc-50 py-24 dark:bg-zinc-900/50 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
            Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Loved by thousands of teams
          </h2>
          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Don&apos;t take our word for it — here&apos;s what the people
            building with SaaSify have to say.
          </p>
        </motion.div>

        {/* Cards */}
        {error ? (
          <p className="mx-auto mt-16 max-w-md text-center text-sm text-red-500 dark:text-red-400">
            {error}
          </p>
        ) : loading ? (
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-52 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {items.map(
              ({ _id, quote, name, role, company, avatar, rating }) => (
                <motion.figure
                  key={_id}
                  variants={card}
                  className="relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {/* decorative quote mark */}
                  <QuoteIcon className="absolute right-6 top-5 h-8 w-8 text-zinc-100 dark:text-zinc-800" />

                  <div className="space-y-4">
                    <Stars count={rating ?? 5} />
                    <blockquote className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                      &ldquo;{quote}&rdquo;
                    </blockquote>
                  </div>

                  <figcaption className="mt-6 flex items-center gap-3">
                    {/* avatar */}
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white"
                      aria-hidden="true"
                    >
                      {avatar ?? name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                        {name}
                      </p>
                      <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                        {role ?? "Customer"}{company ? ` · ${company}` : ""}
                      </p>
                    </div>
                  </figcaption>
                </motion.figure>
              )
            )}
          </motion.div>
        )}

        {/* Social proof bar */}
        <motion.div
          className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-zinc-500 dark:text-zinc-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            ["12,000+", "teams worldwide"],
            ["99.9%", "uptime SLA"],
            ["4.9 / 5", "average rating"],
          ].map(([stat, label]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900 dark:text-white">
                {stat}
              </span>
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
