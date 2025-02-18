import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("authToken"); // Get token from cookies
    const { pathname } = req.nextUrl;

    if (!token && pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin-Login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"], // Protects all admin routes
};