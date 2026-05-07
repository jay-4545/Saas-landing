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

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-[250px] border-r border-neutral-200 bg-white p-4 transition-transform duration-200 md:translate-x-0 dark:border-neutral-800 dark:bg-neutral-950 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              SaaSify Admin
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Control panel</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-300 text-neutral-700 md:hidden dark:border-neutral-700 dark:text-neutral-200"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="space-y-2">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/admin"
                ? pathname === "/admin"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`}
              >
                <Icon size={17} />
                <span className="flex items-center gap-2">
                  {label}
                  {href === "/admin/messages" && unreadCount > 0 ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                      }`}
                    >
                      {unreadCount}
                    </span>
                  ) : null}
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
