"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { createBlog } from "@/lib/api";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug is required"),
  category: z.string().min(2, "Category is required"),
  author: z.string().min(2, "Author is required"),
  status: z.boolean(),
  content: z.string().min(20, "Content must be at least 20 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function NewBlogPostPage() {
  const router = useRouter();
  const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting }, reset } =
    useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      category: "",
      author: "",
      status: true,
      content: "",
    },
  });

  const title = useWatch({ control, name: "title" }) ?? "";
  useEffect(() => {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setValue("slug", slug);
  }, [setValue, title]);

  const onSubmit = async (values: FormValues) => {
    try {
      await createBlog({
        ...values,
        status: values.status ? "published" : "draft",
      });
      toast.success(`Post "${values.title}" created successfully`);
      reset();
      router.push("/admin/blog");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create blog");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl space-y-4 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <h2 className="text-lg font-semibold">Create New Blog Post</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          {...register("title")}
          placeholder="Post title"
          className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
        />
        <input
          type="text"
          {...register("slug")}
          placeholder="Slug"
          className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
        />
        <input
          type="text"
          {...register("category")}
          placeholder="Category"
          className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
        />
        <input
          type="text"
          {...register("author")}
          placeholder="Author"
          className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("status")} />
        Published status
      </label>
      <textarea
        rows={10}
        {...register("content")}
        placeholder="Write your content..."
        className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
      />
      {(errors.title || errors.slug || errors.category || errors.author || errors.content) && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {errors.title?.message ||
            errors.slug?.message ||
            errors.category?.message ||
            errors.author?.message ||
            errors.content?.message}
        </p>
      )}
      <button
        disabled={isSubmitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {isSubmitting ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}
