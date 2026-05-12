import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const password = process.env.STUDIO_PASSWORD;
  if (!password) return NextResponse.next();

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    const encoded = authHeader.slice(6);
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    const colonIdx = decoded.indexOf(":");
    const pass = decoded.slice(colonIdx + 1);
    if (pass === password) return NextResponse.next();
  }

  return new NextResponse(null, {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Cloud51 Studio"' },
  });
}

export const config = {
  matcher: "/studio/:path*",
};
