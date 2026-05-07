"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// ─── variants ─────────────────────────────────────────────────────────────────

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// ─── data ─────────────────────────────────────────────────────────────────────

interface Plan {
  name: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Perfect for side projects and early-stage startups.",
    features: [
      "1 project",
      "Up to 5 team members",
      "1 GB storage",
      "Basic analytics",
      "Community support",
    ],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Pro",
    monthlyPrice: 29,
    annualPrice: 24,
    description: "For growing teams that need power without the complexity.",
    features: [
      "Unlimited projects",
      "Up to 25 team members",
      "50 GB storage",
      "Advanced analytics",
      "Priority support",
      "Custom domains",
    ],
    cta: "Get started",
    highlighted: true,
    badge: "Most popular",
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    annualPrice: null,
    description: "Custom contracts, dedicated infrastructure, and full SLA.",
    features: [
      "Unlimited projects",
      "Unlimited team members",
      "Custom storage",
      "SSO & SAML",
      "Dedicated account manager",
      "99.99% uptime SLA",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

// ─── sub-components ───────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 text-indigo-500"
      aria-hidden="true"
    >
      <polyline points="2 8 6 12 14 4" />
    </svg>
  );
}

function PriceDisplay({
  plan,
  annual,
}: {
  plan: Plan;
  annual: boolean;
}) {
  const price = annual ? plan.annualPrice : plan.monthlyPrice;

  if (price === null) {
    return (
      <p className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Custom
      </p>
    );
  }

  return (
    <div className="mt-4 flex items-end gap-1">
      <span className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
        $
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={annual ? "annual" : "monthly"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.18 }}
          className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white"
        >
          {price}
        </motion.span>
      </AnimatePresence>
      <span className="mb-1 text-sm text-zinc-500 dark:text-zinc-400">/mo</span>
    </div>
  );
}

// ─── component ────────────────────────────────────────────────────────────────

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 sm:py-32">
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
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            No hidden fees, no surprise overages. Pick a plan and start building
            today.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="relative inline-flex items-center rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
            {(["monthly", "annual"] as const).map((period) => {
              const isActive = annual === (period === "annual");
              return (
                <button
                  key={period}
                  onClick={() => setAnnual(period === "annual")}
                  className="relative rounded-md px-5 py-1.5 text-sm font-medium"
                >
                  {isActive && (
                    <motion.span
                      layoutId="billing-pill"
                      className="absolute inset-0 rounded-md bg-white shadow-sm dark:bg-zinc-700"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span
                    className={[
                      "relative z-10 transition-colors duration-150",
                      isActive
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-500",
                    ].join(" ")}
                  >
                    {period === "monthly" ? (
                      "Monthly"
                    ) : (
                      <span className="flex items-center gap-1.5">
                        Annual
                        <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          –17%
                        </span>
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              className={[
                "relative flex flex-col rounded-2xl p-8",
                plan.highlighted
                  ? "bg-white ring-2 ring-indigo-500 shadow-xl shadow-indigo-500/10 dark:bg-zinc-900"
                  : "border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900",
              ].join(" ")}
            >
              {/* badge */}
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              )}

              <div>
                <h3
                  className={[
                    "text-base font-semibold",
                    plan.highlighted
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-zinc-900 dark:text-white",
                  ].join(" ")}
                >
                  {plan.name}
                </h3>

                <PriceDisplay plan={plan} annual={annual} />

                {/* annual savings note */}
                <div className="mt-1 h-4">
                  {plan.monthlyPrice !== null &&
                    plan.annualPrice !== null &&
                    plan.monthlyPrice > 0 &&
                    annual && (
                      <AnimatePresence>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-emerald-600 dark:text-emerald-400"
                        >
                          Save ${(plan.monthlyPrice - plan.annualPrice) * 12}/yr
                        </motion.p>
                      </AnimatePresence>
                    )}
                </div>

                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {plan.description}
                </p>
              </div>

              {/* Feature list */}
              <ul className="mt-8 flex flex-1 flex-col gap-3" role="list">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <CheckIcon />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <motion.a
                href={plan.name === "Enterprise" ? "#contact" : "#contact"}
                className={[
                  "mt-8 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors",
                  plan.highlighted
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700",
                ].join(" ")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.cta}
              </motion.a>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="mt-10 text-center text-sm text-zinc-500 dark:text-zinc-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          All plans include a 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </section>
  );
}
