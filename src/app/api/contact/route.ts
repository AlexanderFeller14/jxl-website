import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeText(input: unknown, maxLength = 3000): string {
  return String(input ?? "")
    .replace(/\0/g, "")
    .replace(/\r/g, "")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildTransport() {
  const host = process.env.SMTP_HOST || "mail.privateemail.com";
  const port = Number.parseInt(process.env.SMTP_PORT || "465", 10) || 465;
  const secure = (process.env.SMTP_SECURE || "true").toLowerCase() !== "false";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) throw new Error("missing_smtp_credentials");

  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
}

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_body" },
      { status: 400 },
    );
  }

  const name = sanitizeText(body.name, 140);
  const email = sanitizeText(body.email, 180).toLowerCase();
  const subjectTopic = sanitizeText(body.subject, 160);
  const message = sanitizeText(body.message, 5000);
  const website = sanitizeText(body.website, 200); // honeypot

  if (website) return NextResponse.json({ ok: true });

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "missing_required_fields" },
      { status: 400 },
    );
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL || "alex@jxl-visuals.com";
  const from = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER || to;
  const subject = subjectTopic
    ? `New enquiry: ${subjectTopic} (${name})`
    : `New enquiry from ${name}`;

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    subjectTopic ? `Subject: ${subjectTopic}` : "",
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <h2>New enquiry via jxl-visuals.com</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${subjectTopic ? `<p><strong>Subject:</strong> ${escapeHtml(subjectTopic)}</p>` : ""}
    <hr />
    <p style="white-space:pre-wrap;">${escapeHtml(message)}</p>
  `;

  try {
    const transporter = buildTransport();
    await transporter.sendMail({ from, to, replyTo: email, subject, text, html });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const code = String((error as Error)?.message || "").includes(
      "missing_smtp_credentials",
    )
      ? "missing_smtp_credentials"
      : "send_failed";
    return NextResponse.json({ ok: false, error: code }, { status: 500 });
  }
}
