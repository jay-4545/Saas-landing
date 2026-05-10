"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { LS_TOKEN_KEY, LS_USER_TYPE_KEY } from "@/lib/localStorageAdmin";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  useAdminAuth({ requireAuth: false });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        token?: string;
        userType?: string;
        error?: string;
      };

      if (!res.ok || !data.success) {
        toast.error(data.error ?? "Invalid credentials");
        return;
      }

      const token = data.token ?? "admin-token";
      const userType = data.userType ?? "static";

      localStorage.setItem(LS_TOKEN_KEY, token);
      localStorage.setItem(LS_USER_TYPE_KEY, userType);

      if ("cookieStore" in window) {
        await window.cookieStore.set({ name: LS_TOKEN_KEY, value: token, path: "/" });
      }

      toast.success("Welcome back, Admin!");
      router.push("/admin");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-neutral-50 via-white to-indigo-50/30 px-4 dark:from-neutral-950 dark:via-neutral-900 dark:to-indigo-950/20">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 right-0 -z-10 h-[350px] w-[350px] rounded-full bg-violet-500/8 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/60 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/30">
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 20 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30"
            >
              <Shield size={28} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Admin Panel
              </h1>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Sign in to access your dashboard
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Email address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                  placeholder="admin@example.com"
                />
              </div>
              {errors.email ? (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-9 pr-10 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password ? (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
              ) : null}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-2 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </motion.button>
          </form>

          <div className="mt-5 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
            <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
              <span className="font-medium">Demo credentials:</span>{" "}
              admin@demo.com&nbsp;/&nbsp;admin123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
