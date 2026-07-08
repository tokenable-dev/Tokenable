import { NextResponse } from "next/server";

const CONTEST_DESTINATION =
  "https://crm.rocketplantech.com/v2/preview/mHAIx56HXHD29PqUxLmz";

export function GET(request: Request) {
  const destination = new URL(CONTEST_DESTINATION);
  destination.searchParams.set("notrack", "true");

  const incoming = new URL(request.url);
  incoming.searchParams.forEach((value, key) => {
    destination.searchParams.set(key, value);
  });

  return NextResponse.redirect(destination, 307);
}
