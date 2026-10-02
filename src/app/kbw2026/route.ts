import { NextResponse } from "next/server";
import { eventRedirectUrl } from "@/lib/event-redirect";

export function GET(request: Request) {
  return NextResponse.redirect(eventRedirectUrl(request.url), 307);
}
