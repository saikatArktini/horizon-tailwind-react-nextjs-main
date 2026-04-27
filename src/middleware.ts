import { verifyEdgeToken } from "lib/edgeJwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {

  const pathname = req.nextUrl.pathname;

  // ✅ Allow auth pages
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // ✅ Allow Next.js internal files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // ❌ No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const decoded = await verifyEdgeToken(token);

    // ✅ Swagger access (only Super Admin)
    if (pathname.startsWith("/swagger")) {
      if (decoded.role !== "Super-Admin") {
        // return NextResponse.json(
        //   { message: "Forbidden - Only Super Admin Allowed" },
        //   { status: 403 }
        // );
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      return NextResponse.next();
    }

    // ❌ Block all routes that are not /admin
    if (!pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // ❌ Block some admin pages completely
    if (
      pathname.startsWith("/admin/data-tables") ||
      pathname.startsWith("/admin/nft-marketplace")
    ) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // 🔐 Super Admin only admin pages
    if (
      pathname.startsWith("/admin/master") ||
      pathname.startsWith("/admin/All-branches") ||
      pathname.startsWith("/admin/branch") ||
      pathname.startsWith("/admin/All-branch-create") ||
      pathname.startsWith("/admin/create-admin")
    ) {
      if (decoded.role !== "Super-Admin") {
        // return NextResponse.json(
        //   { message: "Forbidden - Only Super Admin Allowed" },
        //   { status: 403 }
        //);
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    return NextResponse.next();

  } catch (err) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/:path*"],
};