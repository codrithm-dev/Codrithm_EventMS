import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Placeholder for route auth guarding.
// TODO: Implement role-based route protection for user, organizer, and admin portals.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/organizer/:path*", "/admin/:path*"],
};
