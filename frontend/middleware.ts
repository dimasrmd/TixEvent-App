import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve 'role' cookie
  const roleCookie = request.cookies.get("role");
  const role = roleCookie?.value ? roleCookie.value.toLowerCase() : null;

  // 1. PENGUNJUNG PROTECTION
  if (pathname.startsWith("/pengunjung")) {
    if (role !== "pengunjung") {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. TENANT PROTECTION
  if (pathname.startsWith("/tenant")) {
    if (role !== "tenant") {
      const loginUrl = new URL("/mitra/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. MANAJER PROTECTION
  if (pathname.startsWith("/manajer")) {
    if (role !== "manajer") {
      const portalUrl = new URL("/portal-admin", request.url);
      return NextResponse.redirect(portalUrl);
    }
  }

  // 4. PANITIA PROTECTION
  if (pathname.startsWith("/panitia")) {
    if (role !== "panitia") {
      const portalUrl = new URL("/portal-admin", request.url);
      return NextResponse.redirect(portalUrl);
    }
  }

  // 5. CREW / KRU PROTECTION
  if (pathname.startsWith("/crew")) {
    if (role !== "kru" && role !== "crew") {
      const portalUrl = new URL("/portal-admin", request.url);
      return NextResponse.redirect(portalUrl);
    }
  }

  return NextResponse.next();
}

// Config to specify matching paths for optimization
export const config = {
  matcher: [
    "/pengunjung/:path*",
    "/tenant/:path*",
    "/manajer/:path*",
    "/panitia/:path*",
    "/crew/:path*",
  ],
};
