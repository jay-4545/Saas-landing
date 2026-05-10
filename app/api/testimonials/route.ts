import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Testimonial } from "@/models/Testimonial";

export async function GET() {
  try {
    await connectDB();
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    return NextResponse.json(testimonials, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = (await request.json()) as {
      name?: string;
      role?: string;
      company?: string;
      avatar?: string;
      rating?: unknown;
      quote?: string;
    };
    const { name, role, company, avatar, quote } = body;

    if (!name || !quote) {
      return NextResponse.json(
        { error: "name and quote are required" },
        { status: 400 }
      );
    }

    const ratingNum = Number(body.rating);
    const safeRating =
      Number.isFinite(ratingNum) && ratingNum >= 1 && ratingNum <= 5
        ? ratingNum
        : 5;

    const createdTestimonial = await Testimonial.create({
      name: name.trim(),
      role: role?.trim() || undefined,
      company: company?.trim() || undefined,
      avatar: avatar?.trim() || undefined,
      rating: safeRating,
      quote: quote.trim(),
    });

    return NextResponse.json(createdTestimonial, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[POST /api/testimonials]", message);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? message
            : "Failed to create testimonial",
      },
      { status: 500 }
    );
  }
}
