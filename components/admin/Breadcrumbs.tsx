"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nameMap: Record<string, string> = {
  admin: "Dashboard",
  blog: "Blog",
  new: "New",
  testimonials: "Testimonials",
  messages: "Messages",
  settings: "Settings",
  edit: "Edit",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = parts.map((part, index) => {
    const href = `/${parts.slice(0, index + 1).join("/")}`;
    return {
      href,
      label: nameMap[part] ?? part,
      isLast: index === parts.length - 1,
    };
  });

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-2">
          {crumb.isLast ? (
            <span className="font-medium text-neutral-800 dark:text-neutral-200">
              {crumb.label}
            </span>
          ) : (
            <Link href={crumb.href} className="hover:text-indigo-600 dark:hover:text-indigo-400">
              {crumb.label}
            </Link>
          )}
          {!crumb.isLast ? <span>/</span> : null}
        </span>
      ))}
    </div>
  );
}
