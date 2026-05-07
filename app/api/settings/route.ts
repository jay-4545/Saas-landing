import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Settings } from "@/models/Settings";

const defaultSettings = {
  siteName: "",
  tagline: "",
  logoUrl: "",
  faviconUrl: "",
  socialLinks: {
    twitter: "",
    github: "",
    linkedin: "",
    instagram: "",
  },
  contactInfo: {
    email: "",
    phone: "",
    address: "",
  },
  accentColor: "#4f46e5",
};

export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.findOne({});
    if (!settings) {
      return NextResponse.json(defaultSettings, { status: 200 });
    }
    return NextResponse.json(settings, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const settings = await Settings.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });
    return NextResponse.json(settings, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
