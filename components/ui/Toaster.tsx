"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  const { resolvedTheme } = useTheme();
  return (
    <SonnerToaster
      theme={(resolvedTheme ?? "system") as "light" | "dark" | "system"}
      richColors
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "font-sans text-sm rounded-xl border shadow-lg",
        },
      }}
    />
  );
}
