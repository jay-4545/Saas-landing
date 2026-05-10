import { NextResponse } from "next/server";

const STATIC_EMAIL = "admin@demo.com";
const STATIC_PASSWORD = "admin123";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const envEmail = process.env.ADMIN_EMAIL;
    const envPassword = process.env.ADMIN_PASSWORD;

    if (envEmail && envPassword && email === envEmail && password === envPassword) {
      return NextResponse.json(
        { success: true, userType: "env", token: "env-admin-token" },
        { status: 200 }
      );
    }

    if (email === STATIC_EMAIL && password === STATIC_PASSWORD) {
      return NextResponse.json(
        { success: true, userType: "static", token: "static-admin-token" },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
