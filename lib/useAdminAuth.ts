"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const ADMIN_TOKEN_KEY = "admin-auth-token";

type UseAdminAuthOptions = {
  requireAuth?: boolean;
  redirectTo?: string;
};

export function useAdminAuth(options: UseAdminAuthOptions = {}) {
  const { requireAuth = true, redirectTo = "/admin/login" } = options;
  const pathname = usePathname();
  const router = useRouter();
  const isCheckingAuth = false;
  const isAuthenticated =
    typeof window !== "undefined" && Boolean(localStorage.getItem(ADMIN_TOKEN_KEY));

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const hasToken = Boolean(localStorage.getItem(ADMIN_TOKEN_KEY));

    if (requireAuth && !hasToken && pathname !== "/admin/login") {
      router.replace(redirectTo);
    }

    if (!requireAuth && hasToken && pathname === "/admin/login") {
      router.replace("/admin");
    }
  }, [pathname, redirectTo, requireAuth, router]);

  const logout = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(ADMIN_TOKEN_KEY);
    if ("cookieStore" in window) {
      void window.cookieStore.delete({ name: ADMIN_TOKEN_KEY, path: "/" });
    }
    router.push("/admin/login");
  }, [router]);

  return {
    isAuthenticated,
    isCheckingAuth,
    logout,
  };
}
