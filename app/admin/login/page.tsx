"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { useAdminAuth } from "@/lib/useAdminAuth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const DEMO_EMAIL = "admin@demo.com";
const DEMO_PASSWORD = "admin123";
const TOKEN_KEY = "admin-auth-token";

export default function AdminLoginPage() {
  const router = useRouter();
  useAdminAuth({ requireAuth: false });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    document.body.classList.add("bg-neutral-50", "dark:bg-neutral-950");
    return () => {
      document.body.classList.remove("bg-neutral-50", "dark:bg-neutral-950");
    };
  }, []);

  const onSubmit = async (values: LoginFormValues) => {
    if (values.email !== DEMO_EMAIL || values.password !== DEMO_PASSWORD) {
      toast.error("Invalid credentials. Try admin@demo.com / admin123");
      return;
    }

    localStorage.setItem(TOKEN_KEY, "demo-admin-token");
    if ("cookieStore" in window) {
      await window.cookieStore.set({
        name: TOKEN_KEY,
        value: "demo-admin-token",
        path: "/",
      });
    }
    toast.success("Welcome back, Admin!");
    router.push("/admin");
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <div className="w-full rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Admin Login
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Demo: admin@demo.com / admin123
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-950"
            />
            {errors.email ? (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-950"
            />
            {errors.password ? (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
