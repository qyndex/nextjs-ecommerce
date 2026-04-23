import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const protectedPaths = ["/checkout", "/orders"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect specific paths
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for Supabase auth token in cookies
  // The Supabase JS client stores the session in cookies with specific names
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // If Supabase is not configured, allow access (dev convenience)
    return NextResponse.next();
  }

  // Look for the access token in cookies
  // Supabase stores auth in sb-<ref>-auth-token cookie
  const cookies = request.cookies;
  let hasSession = false;

  for (const [name] of cookies) {
    if (name.includes("auth-token")) {
      hasSession = true;
      break;
    }
  }

  // Also check the Authorization header (for API-style access)
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    hasSession = true;
  }

  if (!hasSession) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*"],
};
