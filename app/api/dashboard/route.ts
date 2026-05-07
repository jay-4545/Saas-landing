import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";
import { Message } from "@/models/Message";
import { Testimonial } from "@/models/Testimonial";

export async function GET() {
  try {
    await connectDB();

    const [
      totalBlogs,
      publishedBlogs,
      totalMessages,
      unreadMessages,
      totalTestimonials,
    ] = await Promise.all([
      Blog.countDocuments({}),
      Blog.countDocuments({ status: "published" }),
      Message.countDocuments({}),
      Message.countDocuments({ status: "new" }),
      Testimonial.countDocuments({}),
    ]);

    return NextResponse.json(
      {
        totalBlogs,
        publishedBlogs,
        totalMessages,
        unreadMessages,
        totalTestimonials,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
