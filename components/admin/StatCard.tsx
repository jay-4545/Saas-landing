import { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
  change?: string;
};

export function StatCard({ label, value, icon, change }: StatCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
        <div className="text-neutral-500 dark:text-neutral-300">{icon}</div>
      </div>
      <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        {value}
      </p>
      {change ? (
        <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
          {change}
        </p>
      ) : null}
    </div>
  );
}
