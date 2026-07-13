import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const COMPANY_EMAIL = "info@rotorstator.com";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "RotorStator Contact <info@rotorstator.com>",
      to: COMPANY_EMAIL,
      replyTo: email,
      subject: `Contact Form: ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px">
          <h2 style="color:#141820;border-bottom:2px solid #D4621A;padding-bottom:8px">Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="padding:16px;background:#f0f2f5;border-radius:4px">${message.replace(/\n/g, "<br>")}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Email send failed" }, { status: 500 });
  }
}
