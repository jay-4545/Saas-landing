"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquareQuote,
  Mail,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { fetchMessages } from "@/lib/api";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
};

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const navItemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.25, ease: "easeOut" as const },
  }),
};

export function Sidebar({ isOpen, onClose, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const items = (await fetchMessages()) as { status?: string }[];
        const unread = items.filter((message) => message.status === "new").length;
        setUnreadCount(unread);
      } catch {
        setUnreadCount(0);
      }
    };

    void loadMessages();
  }, [pathname]);

  const SidebarContent = () => (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-65 flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-800/60">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm">
            S
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              SaaSify
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">Admin Panel</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition hover:bg-neutral-100 md:hidden dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
          aria-label="Close sidebar"
        >
          <X size={15} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
          Navigation
        </p>
        <ul className="space-y-1">
          {links.map(({ href, label, icon: Icon }, i) => {
            const isActive =
              href === "/admin"
                ? pathname === "/admin"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <motion.li key={href} custom={i} variants={navItemVariants} initial="hidden" animate="visible">
                <Link
                  href={href}
                  onClick={onClose}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                  }`}
                >
                  <Icon size={17} className={isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"} />
                  <span className="flex flex-1 items-center justify-between">
                    {label}
                    {href === "/admin/messages" && unreadCount > 0 ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          isActive
                            ? "bg-white/25 text-white"
                            : "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                        }`}
                      >
                        {unreadCount}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-neutral-100 px-3 py-3 dark:border-neutral-800/60">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <LogOut size={17} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <div className="hidden md:block">
        <SidebarContent />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
