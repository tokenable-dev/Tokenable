import { NextResponse } from "next/server";

type WaitlistBody = {
  name?: string;
  email?: string;
  telegram?: string;
};

function sheetsConfig() {
  const url =
    process.env.WAITLIST_SHEETS_URL?.trim() ||
    process.env.NEXT_PUBLIC_WAITLIST_SHEETS_URL?.trim() ||
    "";
  const secret =
    process.env.WAITLIST_SHEETS_SECRET?.trim() ||
    process.env.NEXT_PUBLIC_WAITLIST_SHEETS_SECRET?.trim() ||
    "";
  return { url, secret };
}

export async function POST(request: Request) {
  const { url, secret } = sheetsConfig();
  if (!url || !secret) {
    return NextResponse.json(
      { ok: false, error: "Waitlist sheets endpoint is not configured." },
      { status: 503 },
    );
  }

  let body: WaitlistBody;
  try {
    body = (await request.json()) as WaitlistBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const telegram = String(body.telegram || "").trim().replace(/^@+/, "");

  if (!name || !email) {
    return NextResponse.json(
      { ok: false, error: "Missing name or email." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret, name, email, telegram }),
      redirect: "follow",
      cache: "no-store",
    });

    const raw = await response.text();
    let data: { ok?: boolean; error?: string } = {};
    try {
      data = raw ? (JSON.parse(raw) as { ok?: boolean; error?: string }) : {};
    } catch {
      if (response.status === 401 || raw.includes("페이지를 찾을 수 없") || raw.includes("Sign in")) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Apps Script web app is not publicly accessible. Redeploy with access set to Anyone and update WAITLIST_SHEETS_URL.",
          },
          { status: 502 },
        );
      }
      data = {};
    }

    if (!response.ok || data.ok === false) {
      return NextResponse.json(
        {
          ok: false,
          error:
            data.error ||
            (response.status === 401
              ? "Apps Script unauthorized. Check SHEETS_SECRET and redeploy the web app as Anyone."
              : `Sheets sync failed (${response.status}).`),
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sheets sync failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
