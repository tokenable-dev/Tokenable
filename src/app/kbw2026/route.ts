import { NextResponse } from "next/server";

const KBW2026_DESTINATION = "https://tokenable-dev.com/event";

export function GET(request: Request) {
  const destination = new URL(KBW2026_DESTINATION);

  const incoming = new URL(request.url);
  incoming.searchParams.forEach((value, key) => {
    destination.searchParams.set(key, value);
  });

  return NextResponse.redirect(destination, 307);
}
