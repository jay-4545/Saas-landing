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
    const body = await request.json();
    const { name, role, company, avatar, rating, quote } = body;

    if (!name || !quote) {
      return NextResponse.json(
        { error: "name and quote are required" },
        { status: 400 }
      );
    }

    const createdTestimonial = await Testimonial.create({
      name,
      role,
      company,
      avatar,
      rating,
      quote,
    });

    return NextResponse.json(createdTestimonial, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
