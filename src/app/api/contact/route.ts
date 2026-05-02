import { NextResponse } from "next/server";
import { Resend } from "resend";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Primary inbox (To) when CONTACT_TO is missing or invalid. */
const DEFAULT_TO = "tokenable.dev@gmail.com";
/** Until tokenable.io is verified in Resend, use this From (only reliable To is often the Resend account email). */
const DEFAULT_FROM = "Tokenable Contact <onboarding@resend.dev>";

function contactInbox(envRaw: string | undefined): string {
  const first = envRaw?.split(",")[0]?.trim();
  if (first && emailOk(first)) {
    return first;
  }
  return DEFAULT_TO;
}

function parseCcList(raw: string | undefined, excludeLower: string): string[] {
  if (!raw?.trim()) {
    return [];
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(",")) {
    const addr = part.trim();
    if (!addr || !emailOk(addr)) {
      continue;
    }
    const key = addr.toLowerCase();
    if (key === excludeLower || seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push(addr);
  }
  return out;
}

/** Resend only delivers test `from` to the account email — CC/BCC to other addresses returns 403. */
function isResendSandboxFrom(fromHeader: string): boolean {
  return fromHeader.toLowerCase().includes("@resend.dev");
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

  const primary = contactInbox(process.env.CONTACT_TO);
  const to = [primary];
  const from = process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;
  let cc = parseCcList(process.env.CONTACT_CC, primary.toLowerCase());
  if (isResendSandboxFrom(from) && cc.length > 0) {
    console.warn(
      "[api/contact] CC omitted: onboarding@resend.dev only allows your Resend account email. After tokenable.io is verified, set RESEND_FROM_EMAIL to @tokenable.io to CC others.",
    );
    cc = [];
  }

  const resend = new Resend(key);

  const { error } = await resend.emails.send({
    from,
    to,
    ...(cc.length > 0 ? { cc } : {}),
    replyTo: em,
    subject: `[Tokenable contact] ${fn} ${ln}`,
    text: [`Name: ${fn} ${ln}`, `Email: ${em}`, "", msg].join("\n"),
  });

  if (error) {
    console.error("[api/contact]", error);
    const detail =
      error && typeof error === "object" && "message" in error && typeof (error as { message: unknown }).message === "string"
        ? (error as { message: string }).message
        : "";
    const isDev = process.env.NODE_ENV === "development";
    return NextResponse.json(
      {
        error: isDev && detail
          ? `Email failed: ${detail}`
          : "Could not send email. If using onboarding@resend.dev, Resend may block CC to other domains until tokenable.io is verified.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
