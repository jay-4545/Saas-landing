import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  message: z.string().min(10).max(1000),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  let name: string, email: string, message: string;

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid form data" },
        { status: 400 },
      );
    }
    ({ name, email, message } = parsed.data);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
             background:#f4f4f5;margin:0;padding:32px 16px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;
              overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
    <div style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);
                padding:32px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:600;">
        New Contact Message
      </h1>
    </div>
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:13px;width:80px;
                     vertical-align:top;">Name</td>
          <td style="padding:8px 0;color:#111827;font-weight:500;">${name}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:13px;
                     vertical-align:top;">Email</td>
          <td style="padding:8px 0;">
            <a href="mailto:${email}" style="color:#6366f1;text-decoration:none;">
              ${email}
            </a>
          </td>
        </tr>
      </table>
      <div style="margin-top:20px;padding-top:20px;border-top:1px solid #f3f4f6;">
        <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">Message</p>
        <p style="margin:0;color:#111827;line-height:1.7;white-space:pre-wrap;">${message}</p>
      </div>
    </div>
    <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #f3f4f6;">
      <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
        Sent via SaaSify contact form
      </p>
    </div>
  </div>
</body>
</html>`.trim();

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Contact <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL ?? "delivered@resend.dev",
    replyTo: email,
    subject: `New message from ${name}`,
    html,
  });

  if (error) {
    console.error("[contact/route] Resend error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
