import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("authToken"); // Get token from cookies
    const { pathname } = req.nextUrl;

    // Redirect to login if token is undefined and trying to access admin routes, excluding /admin-Login
    if (!token && pathname.startsWith("/admin") && pathname !== "/admin-Login") {
        console.log("Redirecting to /admin-Login");
        return NextResponse.redirect(new URL("/admin-Login", req.url));
    }

    // Redirect to dashboard if already logged in and trying to access login or forget-password page
    if (token && (pathname === "/admin-Login")) {
        console.log("Redirecting to /admin/dashboard");
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }


    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/admin-Login", "/forget-password"], // Protects all admin routes and admin-Login
};