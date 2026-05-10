"use client";

import { Bell, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getUserType } from "@/lib/localStorageAdmin";

type HeaderProps = {
  title: string;
  onMenuClick: () => void;
};

export function Header({ title, onMenuClick }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setUserType(getUserType());
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 px-4 py-3.5 backdrop-blur-md md:px-6 dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            onClick={onMenuClick}
            whileTap={{ scale: 0.9 }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:bg-neutral-100 md:hidden dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </motion.button>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {title}
            </h1>
            {userType ? (
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Signed in as{" "}
                <span className={`font-medium ${userType === "env" ? "text-emerald-600 dark:text-emerald-400" : "text-indigo-600 dark:text-indigo-400"}`}>
                  {userType === "env" ? "Admin (Env)" : "Demo Admin"}
                </span>
                {userType === "static" && (
                  <span className="ml-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                    localStorage only
                  </span>
                )}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <motion.button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            whileTap={{ scale: 0.88 }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mounted ? (
                <motion.span
                  key={resolvedTheme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  {isDark ? <Sun size={17} /> : <Moon size={17} />}
                </motion.span>
              ) : (
                <span className="block h-4 w-4" />
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.88 }}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
            aria-label="Notifications"
          >
            <Bell size={17} />
          </motion.button>

          <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-sm">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
