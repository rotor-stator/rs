import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { CartItem } from "@/lib/types";

const resend = new Resend(process.env.RESEND_API_KEY);
const BCC_EMAIL = "mike@rotorstator.com";

interface OrderPayload {
  name: string;
  email: string;
  phone: string;
  company?: string;
  notes?: string;
  items: CartItem[];
  locale: string;
}

function formatItemsHtml(items: CartItem[]) {
  return items
    .map(
      ({ product, quantity }) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee">${product.partNumber}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee">${product.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${quantity}</td>
        </tr>`
    )
    .join("");
}

function orderTable(items: CartItem[]) {
  return `<table style="width:100%;border-collapse:collapse;font-size:14px">
    <thead>
      <tr style="background:#f0f2f5">
        <th style="padding:8px 12px;text-align:left">Part No.</th>
        <th style="padding:8px 12px;text-align:left">Product</th>
        <th style="padding:8px 12px;text-align:center">Qty</th>
      </tr>
    </thead>
    <tbody>${formatItemsHtml(items)}</tbody>
  </table>`;
}

export async function POST(req: NextRequest) {
  const body: OrderPayload = await req.json();
  const { name, email, phone, company, notes, items } = body;

  if (!name || !email || !phone || !items?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const companyLine = company ? `<p><strong>Company:</strong> ${company}</p>` : "";
  const notesLine = notes ? `<p><strong>Notes:</strong> ${notes}</p>` : "";
  const submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const locationLine = ip ? `<p><strong>Location (IP):</strong> ${ip}</p>` : "";

  try {
    await resend.emails.send({
      from: "RotorStator <info@rotorstator.com>",
      to: email,
      bcc: BCC_EMAIL,
      subject: "Order Received — RotorStator",
      html: `
        <div style="font-family:sans-serif;max-width:600px">
          <h2 style="color:#141820;border-bottom:2px solid #D4621A;padding-bottom:8px">
            Thank you, ${name}!
          </h2>
          <p>We have received your order. Our team will review it and contact you shortly with pricing and availability.</p>
          <h3 style="margin-top:24px">Order Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          ${companyLine}
          ${notesLine}
          <p><strong>Submitted:</strong> ${submittedAt}</p>
          ${locationLine}
          <h3 style="margin-top:24px">Your Order</h3>
          ${orderTable(items)}
          <p style="margin-top:24px;color:#5A6478;font-size:13px">
            Questions? Reply to this email or call us directly.
          </p>
          <p style="color:#5A6478;font-size:13px">— RotorStator Team</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Email send failed" }, { status: 500 });
  }
}
