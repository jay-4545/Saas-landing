"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { fetchSettings, updateSettings } from "@/lib/api";

type SettingsValues = {
  siteName: string;
  tagline: string;
  logo: string;
  twitter: string;
  linkedin: string;
  github: string;
  email: string;
  phone: string;
  address: string;
  accent: string;
};

const accentPresets = ["#4f46e5", "#06b6d4", "#f97316", "#22c55e", "#ec4899"];

export default function AdminSettingsPage() {
  const { register, handleSubmit, setValue, control } = useForm<SettingsValues>({
    defaultValues: {
      siteName: "SaaSify",
      tagline: "Grow your SaaS faster",
      logo: "/logo.svg",
      twitter: "https://twitter.com/saasify",
      linkedin: "https://linkedin.com/company/saasify",
      github: "https://github.com/saasify",
      email: "admin@demo.com",
      phone: "+1 555 200 445",
      address: "221B Cloud Street",
      accent: "#4f46e5",
    },
  });
  const accent = useWatch({ control, name: "accent" }) ?? "#4f46e5";

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = (await fetchSettings()) as {
          siteName?: string;
          tagline?: string;
          logoUrl?: string;
          socialLinks?: { twitter?: string; linkedin?: string; github?: string };
          contactInfo?: { email?: string; phone?: string; address?: string };
          accentColor?: string;
        };
        setValue("siteName", data.siteName ?? "");
        setValue("tagline", data.tagline ?? "");
        setValue("logo", data.logoUrl ?? "");
        setValue("twitter", data.socialLinks?.twitter ?? "");
        setValue("linkedin", data.socialLinks?.linkedin ?? "");
        setValue("github", data.socialLinks?.github ?? "");
        setValue("email", data.contactInfo?.email ?? "");
        setValue("phone", data.contactInfo?.phone ?? "");
        setValue("address", data.contactInfo?.address ?? "");
        setValue("accent", data.accentColor ?? "#4f46e5");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load settings");
      }
    };
    void loadSettings();
  }, [setValue]);

  const saveSection = (section: string) =>
    handleSubmit(async (values) => {
      await updateSettings({
        siteName: values.siteName,
        tagline: values.tagline,
        logoUrl: values.logo,
        socialLinks: {
          twitter: values.twitter,
          github: values.github,
          linkedin: values.linkedin,
        },
        contactInfo: {
          email: values.email,
          phone: values.phone,
          address: values.address,
        },
        accentColor: values.accent,
      });
      toast.success(`${section} settings saved`);
    });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="mb-3 font-semibold">General</h3>
          <div className="space-y-3">
            <input {...register("siteName")} placeholder="Site Name" className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
            <input {...register("tagline")} placeholder="Tagline" className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
            <input {...register("logo")} placeholder="Logo URL" className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
            <button onClick={saveSection("General")} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              Save General
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="mb-3 font-semibold">Social Links</h3>
          <div className="space-y-3">
            <input {...register("twitter")} placeholder="Twitter URL" className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
            <input {...register("linkedin")} placeholder="LinkedIn URL" className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
            <input {...register("github")} placeholder="GitHub URL" className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
            <button onClick={saveSection("Social")} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              Save Social
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="mb-3 font-semibold">Contact Info</h3>
          <div className="space-y-3">
            <input {...register("email")} placeholder="Contact Email" className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
            <input {...register("phone")} placeholder="Phone" className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
            <input {...register("address")} placeholder="Address" className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
            <button onClick={saveSection("Contact")} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              Save Contact
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="mb-3 font-semibold">Appearance</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              {accentPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("accent", color)}
                  style={{ backgroundColor: color }}
                  className={`h-8 w-8 rounded-full border-2 ${
                    accent === color ? "border-neutral-900 dark:border-white" : "border-transparent"
                  }`}
                  aria-label={`Select ${color}`}
                />
              ))}
            </div>
            <input {...register("accent")} placeholder="Accent color" className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
            <button onClick={saveSection("Appearance")} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              Save Appearance
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
