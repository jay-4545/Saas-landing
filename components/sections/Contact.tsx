"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

// ─── schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email address"),
  message: z
    .string()
    .min(10, "Tell us a bit more (at least 10 characters)")
    .max(1000, "Keep it under 1,000 characters"),
});

type FormData = z.infer<typeof schema>;

// ─── variants ─────────────────────────────────────────────────────────────────

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

const errorVariants: Variants = {
  hidden: { opacity: 0, y: -4, height: 0 },
  visible: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { duration: 0.18 },
  },
  exit: { opacity: 0, y: -4, height: 0, transition: { duration: 0.14 } },
};

// ─── icons ────────────────────────────────────────────────────────────────────

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            role="alert"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden text-xs text-red-500 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── shared input classes ─────────────────────────────────────────────────────

function inputCls(hasError: boolean) {
  return [
    "w-full rounded-lg border px-4 py-2.5 text-sm outline-none",
    "bg-white dark:bg-zinc-800/60",
    "text-zinc-900 dark:text-white",
    "placeholder-zinc-400 dark:placeholder-zinc-500",
    "transition-colors duration-150",
    "focus:ring-2",
    hasError
      ? "border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-500/20"
      : "border-zinc-300 dark:border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500/20",
  ].join(" ");
}

// ─── component ────────────────────────────────────────────────────────────────

export function Contact() {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const messageLen = watch("message", "").length;

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const { error } = (await res.json()) as { error?: string };
        throw new Error(error ?? "Unknown error");
      }

      toast.success("Message sent!", {
        description: "We'll get back to you within 24 hours.",
      });
      reset();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error("Couldn't send message", {
        description: msg.startsWith("Failed") ? msg : "Please try again or email us directly.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-16 lg:grid-cols-2">
          {/* ── Left: info ── */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
              Contact
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Let&apos;s build something great
            </h2>
            <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Have a question, a project idea, or just want to say hello? Fill
              in the form and we&apos;ll get back to you shortly.
            </p>

            <ul className="mt-10 space-y-5" role="list">
              <li className="flex items-start gap-4">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                  <MailIcon className="h-4.5 w-4.5 text-indigo-500" />
                </span>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    Email us directly
                  </p>
                  <a
                    href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@saasify.com"}`}
                    className="mt-0.5 text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    {process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@saasify.com"}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                  <ClockIcon className="h-4.5 w-4.5 text-indigo-500" />
                </span>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    Response time
                  </p>
                  <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                    We reply within 24 hours on business days.
                  </p>
                </div>
              </li>
            </ul>

            {/* trust badge */}
            <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              12,000+ teams trust SaaSify — you&apos;re in good company.
            </div>
          </motion.div>

          {/* ── Right: form ── */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.1 }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="space-y-5">
                {/* Name */}
                <Field label="Name" error={errors.name?.message}>
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Jane Smith"
                    autoComplete="name"
                    className={inputCls(!!errors.name)}
                  />
                </Field>

                {/* Email */}
                <Field label="Email" error={errors.email?.message}>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="jane@company.com"
                    autoComplete="email"
                    className={inputCls(!!errors.email)}
                  />
                </Field>

                {/* Message */}
                <Field label="Message" error={errors.message?.message}>
                  <div className="relative">
                    <textarea
                      {...register("message")}
                      rows={5}
                      placeholder="Tell us what you're working on…"
                      className={[
                        inputCls(!!errors.message),
                        "resize-none",
                      ].join(" ")}
                    />
                    <span
                      className={[
                        "absolute bottom-2.5 right-3 text-[11px] tabular-nums transition-colors",
                        messageLen > 950
                          ? "text-red-500"
                          : "text-zinc-400 dark:text-zinc-500",
                      ].join(" ")}
                    >
                      {messageLen}/1000
                    </span>
                  </div>
                </Field>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={submitting ? {} : { scale: 1.02 }}
                  whileTap={submitting ? {} : { scale: 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <SpinnerIcon />
                      Sending…
                    </>
                  ) : (
                    "Send message"
                  )}
                </motion.button>

                <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
                  We never share your information with third parties.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
