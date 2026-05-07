import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/models/Message";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const query = status ? { status } : {};
    const messages = await Message.find(query).sort({ createdAt: -1 });
    return NextResponse.json(messages, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "name, email and message are required" },
        { status: 400 }
      );
    }

    const createdMessage = await Message.create({
      name,
      email,
      message,
      status: "new",
    });

    return NextResponse.json(createdMessage, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
  }
}
