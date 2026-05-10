"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { useAdminAuth } from "@/lib/useAdminAuth";

const titleMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/blog": "Blog Posts",
  "/admin/blog/new": "Create Blog Post",
  "/admin/testimonials": "Testimonials",
  "/admin/messages": "Messages",
  "/admin/settings": "Settings",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";
  const { isCheckingAuth, logout } = useAdminAuth({ requireAuth: !isLoginPage });

  const title = useMemo(() => {
    if (pathname.startsWith("/admin/blog/") && pathname.endsWith("/edit")) {
      return "Edit Blog Post";
    }
    return titleMap[pathname] ?? "Admin Panel";
  }, [pathname]);

  if (!isLoginPage && isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center text-neutral-600 dark:text-neutral-300">
        Checking admin session...
      </div>
    );
  }

  if (isLoginPage) {
    return (
      <>
        {children}
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={logout}
      />

      <div className="md:ml-65">
        <Header title={title} onMenuClick={() => setIsSidebarOpen(true)} />

        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="min-h-[calc(100vh-65px)] overflow-y-auto p-4 md:p-6"
        >
          <Breadcrumbs />
          {children}
        </motion.main>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}
