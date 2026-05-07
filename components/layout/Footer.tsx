"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { FaLinkedin, FaTwitter } from "react-icons/fa";
import { FaGithub, FaInstagram } from "react-icons/fa6";

// ─── animation variants ───────────────────────────────────────────────────────

const topContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// ─── data ─────────────────────────────────────────────────────────────────────

const LINK_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#about" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Status", href: "#" },
      { label: "Support", href: "#contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
] as const;

// Light-mode hover colours; in dark mode `dark:hover:text-zinc-100` on the
// wrapper wins via higher specificity (.dark ancestor selector).
const SOCIAL_LINKS = [
  { label: "Twitter", href: "https://twitter.com", Icon: FaTwitter, hoverClass: "hover:text-sky-400" },
  { label: "GitHub", href: "https://github.com", Icon: FaGithub, hoverClass: "hover:text-zinc-900" },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: FaLinkedin, hoverClass: "hover:text-blue-500" },
  { label: "Instagram", href: "https://instagram.com", Icon: FaInstagram, hoverClass: "hover:text-pink-500" },
] satisfies {
  label: string;
  href: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  hoverClass: string;
}[];

// ─── component ────────────────────────────────────────────────────────────────

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Top section: logo + link columns ── */}
        <motion.div
          className="grid grid-cols-1 gap-10 py-12 lg:grid-cols-5 lg:gap-8 lg:py-16"
          variants={topContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Logo + tagline */}
          <motion.div variants={fadeUp} className="lg:col-span-1">
            <Link
              href="#home"
              className="inline-flex items-center gap-2.5 text-zinc-900 dark:text-white"
              aria-label="SaaSify home"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-sm">
                S
              </span>
              <span className="text-[17px] font-semibold tracking-tight">
                SaaSify
              </span>
            </Link>
            <p className="mt-4 max-w-[17rem] text-sm leading-6 text-gray-500 dark:text-zinc-400">
              The all-in-one platform to build, launch, and scale your SaaS —
              without the operational complexity.
            </p>
          </motion.div>

          {/* Link columns: 1-col mobile → 2-col tablet → 4-col desktop */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-4">
            {LINK_COLUMNS.map(({ heading, links }) => (
              <motion.div key={heading} variants={fadeUp}>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-900 dark:text-white">
                  {heading}
                </h3>
                <ul className="mt-4 space-y-3" role="list">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="group relative inline-block text-sm text-gray-500 transition-colors duration-200 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                      >
                        {label}
                        {/* Slide-in underline on hover */}
                        <span
                          aria-hidden
                          className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-indigo-500 transition-transform duration-300 group-hover:scale-x-100"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom section: copyright + social icons ── */}
        <motion.div
          className="flex flex-col items-center justify-between gap-4 border-t border-zinc-200 py-6 sm:flex-row dark:border-zinc-800"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            © {year} SaaSify, Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {SOCIAL_LINKS.map(({ label, href, Icon, hoverClass }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`text-gray-400 transition-colors duration-200 dark:text-zinc-500 dark:hover:text-zinc-100 ${hoverClass}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </motion.a>
            ))}
          </div>
        </motion.div>

      </div>
    </footer>
  );
}
