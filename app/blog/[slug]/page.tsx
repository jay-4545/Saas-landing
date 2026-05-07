import { notFound } from "next/navigation";

type BlogResponse = {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"}/api/blog?slug=${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    notFound();
  }

  const blog = (await response.json()) as BlogResponse;

  return (
    <main className="mx-auto mt-24 max-w-3xl px-4 pb-16">
      <h1 className="text-3xl font-bold">{blog.title}</h1>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}
      </p>
      <article className="prose mt-6 max-w-none dark:prose-invert whitespace-pre-wrap">
        {blog.content}
      </article>
    </main>
  );
}
