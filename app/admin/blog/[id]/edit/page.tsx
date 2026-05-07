"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateBlog } from "@/lib/api";

type Blog = {
  title: string;
  category?: string;
  author?: string;
  content: string;
  status?: string;
  slug?: string;
};

export default function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Blog>({
    title: "",
    category: "",
    author: "",
    content: "",
    status: "draft",
    slug: "",
  });

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const response = await fetch(`/api/blog/${id}`);
        const data = (await response.json()) as Blog & { error?: string };
        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load blog");
        }
        setForm({
          title: data.title,
          category: data.category ?? "",
          author: data.author ?? "",
          content: data.content,
          status: data.status ?? "draft",
          slug: data.slug ?? "",
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };
    void loadBlog();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateBlog(id, form);
      toast.success("Blog updated");
      router.push("/admin/blog");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="h-40 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <h2 className="text-lg font-semibold">Edit Blog Post</h2>
      <div className="mt-6 space-y-4">
        <input
          type="text"
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
        />
        <input
          type="text"
          value={form.slug}
          onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
          className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
        />
        <textarea
          rows={10}
          value={form.content}
          onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
          className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
        />
        <button
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {saving ? "Updating..." : "Update Post"}
        </button>
      </div>
    </form>
  );
}
