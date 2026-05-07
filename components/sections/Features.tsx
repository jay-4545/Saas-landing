"use client";

import { motion, type Variants } from "framer-motion";

// ─── animation variants ───────────────────────────────────────────────────────

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
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

// ─── icons ────────────────────────────────────────────────────────────────────

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// ─── data ─────────────────────────────────────────────────────────────────────

interface Feature {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

const FEATURES: Feature[] = [
  {
    title: "Lightning Fast",
    description:
      "Deploy anywhere in seconds. Our global edge network ensures sub-100ms response times for users worldwide.",
    Icon: ZapIcon,
    iconBg: "bg-amber-500/10 dark:bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  {
    title: "Secure by Default",
    description:
      "SOC 2 Type II certified with end-to-end encryption, SSO, and fine-grained access controls built in from day one.",
    Icon: ShieldIcon,
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    title: "Real-time Analytics",
    description:
      "Track every event as it happens. Build dashboards that surface the metrics that matter most to your team.",
    Icon: ChartIcon,
    iconBg: "bg-blue-500/10 dark:bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    title: "100+ Integrations",
    description:
      "Connect your existing stack in minutes. Slack, GitHub, Stripe, Notion, and dozens more are ready to go.",
    Icon: LinkIcon,
    iconBg: "bg-violet-500/10 dark:bg-violet-500/10",
    iconColor: "text-violet-500",
  },
  {
    title: "Team Collaboration",
    description:
      "Invite your team, assign roles, and collaborate in shared workspaces — without the back-and-forth.",
    Icon: UsersIcon,
    iconBg: "bg-rose-500/10 dark:bg-rose-500/10",
    iconColor: "text-rose-500",
  },
  {
    title: "Global Scale",
    description:
      "Our infrastructure grows with you — from your first user to your millionth, without lifting a finger.",
    Icon: GlobeIcon,
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/10",
    iconColor: "text-indigo-500",
  },
];

// ─── component ────────────────────────────────────────────────────────────────

export function Features() {
  return (
    <section id="about" className="py-24 sm:py-32">
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
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Everything you need to ship faster
          </h2>
          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            From deployment to analytics, SaaSify gives you the full stack
            without the operational complexity.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {FEATURES.map(({ title, description, Icon, iconBg, iconColor }) => (
            <motion.div
              key={title}
              variants={card}
              className="group relative rounded-2xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              {/* icon */}
              <div
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}
              >
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>

              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {description}
              </p>

              {/* subtle hover gradient */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-inset ring-indigo-500/20 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
