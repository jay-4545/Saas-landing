"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type StatCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
  change?: string;
  accent?: string;
};

export function StatCard({ label, value, icon, change, accent = "bg-indigo-500" }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className={`absolute left-0 top-0 h-1 w-full ${accent} opacity-80`} />
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent} bg-opacity-10 text-neutral-600 dark:text-neutral-300`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        {value}
      </p>
      {change ? (
        <p className="mt-1.5 flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
          <span>↑</span>
          {change} this month
        </p>
      ) : null}
    </motion.div>
  );
}
