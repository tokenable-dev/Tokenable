import { NextResponse } from "next/server";
import { Resend } from "resend";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const DEFAULT_TO = "tokenable.dev@gmail.com";
/** Additional inbox when using a verified domain + custom `from` (sandbox ignores Cc). */
const DEFAULT_CC = "luke@tokenable.io";

const DEFAULT_FROM = "Tokenable Contact <onboarding@resend.dev>";

/** Resend API keys in "testing" only allow sending to the account owner inbox; onboarding@resend.dev from triggers that mode. */
function isResendTestFrom(from: string): boolean {
  return /onboarding@resend\.dev/i.test(from);
}

function parseCcList(csv: string): string[] {
  return [
    ...new Set(
      csv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .filter(emailOk),
    ),
  ];
}

/** Defaults: To account owner inbox, Cc Luke. Override with CONTACT_TO / CONTACT_CC (comma-separated Cc). Production: verify domain + RESEND_FROM_EMAIL. */
function contactRecipients(): { to: string[]; cc: string[] } {
  const rawTo = process.env.CONTACT_TO?.trim() || DEFAULT_TO;
  const toAddr = emailOk(rawTo) ? rawTo : DEFAULT_TO;
  const rawCc = process.env.CONTACT_CC?.trim() || DEFAULT_CC;
  let cc = parseCcList(rawCc);
  if (cc.length === 0) cc = parseCcList(DEFAULT_CC);
  return { to: [toAddr], cc };
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

  const from = process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;

  const resend = new Resend(key);

  const intended = contactRecipients();
  const testInbox =
    process.env.RESEND_TEST_INBOX?.trim() || "tokenable.dev@gmail.com";

  const useTestInbox = isResendTestFrom(from) && emailOk(testInbox);

  const to = useTestInbox ? [testInbox] : intended.to;
  const cc = useTestInbox ? undefined : intended.cc;

  const { error } = await resend.emails.send({
    from,
    to,
    ...(cc && cc.length > 0 ? { cc } : {}),
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
