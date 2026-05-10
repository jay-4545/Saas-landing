"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LS_TOKEN_KEY, LS_USER_TYPE_KEY, type UserType } from "@/lib/localStorageAdmin";

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
    typeof window !== "undefined" && Boolean(localStorage.getItem(LS_TOKEN_KEY));
  const userType: UserType | null =
    typeof window !== "undefined"
      ? (localStorage.getItem(LS_USER_TYPE_KEY) as UserType | null)
      : null;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const hasToken = Boolean(localStorage.getItem(LS_TOKEN_KEY));

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

    localStorage.removeItem(LS_TOKEN_KEY);
    localStorage.removeItem(LS_USER_TYPE_KEY);
    if ("cookieStore" in window) {
      void window.cookieStore.delete({ name: LS_TOKEN_KEY, path: "/" });
    }
    router.push("/admin/login");
  }, [router]);

  return {
    isAuthenticated,
    isCheckingAuth,
    logout,
    userType,
  };
}
