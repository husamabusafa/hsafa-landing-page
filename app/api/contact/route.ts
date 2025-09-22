import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, company, subject, message, consent } = data ?? {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Very basic email validation
    const emailOk = /.+@.+\..+/.test(email);
    if (!emailOk) {
      return NextResponse.json(
        { ok: false, message: "Invalid email" },
        { status: 400 }
      );
    }

    // TODO: Connect to your email/CRM provider here (Resend, Postmark, Sendgrid, Notion, etc.)
    // Example placeholder: console log for now to keep things side-effect free
    console.log("[Contact] New submission", {
      name,
      email,
      company,
      subject,
      message,
      consent,
      ts: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, message: "Thanks! We\'ll be in touch shortly." });
  } catch (err) {
    console.error("[Contact] Error handling submission", err);
    return NextResponse.json(
      { ok: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
