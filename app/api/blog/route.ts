import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const status = searchParams.get("status");

    if (slug) {
      const blog = await Blog.findOne({ slug });
      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json(blog, { status: 200 });
    }

    const query = status ? { status } : {};
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    return NextResponse.json(blogs, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, slug, content, category, author, status, mainImage } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "title, slug and content are required" },
        { status: 400 }
      );
    }

    const createdBlog = await Blog.create({
      title,
      slug,
      content,
      category,
      author,
      status,
      mainImage,
      updatedAt: new Date(),
    });

    return NextResponse.json(createdBlog, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
