"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Blog = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  createdAt?: string;
};

export default function BlogPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await fetch("/api/blog?status=published");
        const data = (await response.json()) as Blog[] | { error?: string };
        if (!response.ok) {
          throw new Error((data as { error?: string }).error ?? "Failed to load blogs");
        }
        setBlogs(data as Blog[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };
    void loadBlogs();
  }, []);

  if (loading) {
    return <div className="mx-auto mt-24 h-40 max-w-5xl animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />;
  }

  if (error) {
    return <div className="mx-auto mt-24 max-w-5xl text-red-600 dark:text-red-400">{error}</div>;
  }

  return (
    <main className="mx-auto mt-24 max-w-5xl space-y-4 px-4">
      <h1 className="text-3xl font-bold">Blog</h1>
      {blogs.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">No published blogs available.</p>
      ) : (
        blogs.map((blog) => (
          <article key={blog._id} className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              {blog.content.slice(0, 180)}...
            </p>
            <Link href={`/blog/${blog.slug}`} className="mt-3 inline-block text-indigo-600 hover:underline dark:text-indigo-400">
              Read more
            </Link>
          </article>
        ))
      )}
    </main>
  );
}
