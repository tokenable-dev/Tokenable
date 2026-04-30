import { NextResponse } from "next/server";
import { Resend } from "resend";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Primary inbox when CONTACT_TO is missing or invalid. */
const DEFAULT_RECIPIENTS = ["luke@tokenable.io"];
const DEFAULT_FROM = "Tokenable Contact <onboarding@resend.dev>";

function contactRecipients(envRaw: string | undefined): string[] {
  const raw = envRaw?.trim();
  if (!raw) {
    return [...DEFAULT_RECIPIENTS];
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(",")) {
    const addr = part.trim();
    if (!addr || !emailOk(addr)) {
      continue;
    }
    const key = addr.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push(addr);
  }
  return out.length > 0 ? out : [...DEFAULT_RECIPIENTS];
}

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Email is not configured. Add RESEND_API_KEY on the server." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { firstName, lastName, email, message } = body as Record<string, unknown>;
  const fn = typeof firstName === "string" ? firstName.trim() : "";
  const ln = typeof lastName === "string" ? lastName.trim() : "";
  const em = typeof email === "string" ? email.trim() : "";
  const msg = typeof message === "string" ? message.trim() : "";

  if (!fn || !ln || !em || !msg) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (fn.length > 100 || ln.length > 100 || em.length > 254 || msg.length > 10_000) {
    return NextResponse.json({ error: "A field is too long." }, { status: 400 });
  }
  if (!emailOk(em)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const to = contactRecipients(process.env.CONTACT_TO);
  const from = process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;

  const resend = new Resend(key);

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: em,
    subject: `[Tokenable contact] ${fn} ${ln}`,
    text: [`Name: ${fn} ${ln}`, `Email: ${em}`, "", msg].join("\n"),
  });

  if (error) {
    console.error("[api/contact]", error);
    return NextResponse.json({ error: "Could not send email. Try again later." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
