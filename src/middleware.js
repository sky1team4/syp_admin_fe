import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("authToken");
    const { pathname } = req.nextUrl;

    console.log('🔍 Middleware check:', { 
        pathname, 
        hasToken: !!token,
        tokenValue: token?.value ? 'Present' : 'Missing',
        timestamp: new Date().toISOString()
    });

    // Allow public routes without token check
    const publicRoutes = ['/admin-Login', '/forget-password', '/reset-password'];
    if (publicRoutes.includes(pathname)) {
        console.log('✅ Public route allowed:', pathname);
        return NextResponse.next();
    }

    // More robust token validation for admin routes
    if (pathname.startsWith("/admin")) {
        // Check if token exists and has a value
        if (!token || !token.value) {
            console.log("⚠️ No valid token found for admin route");
            console.log("   - Cookie exists:", !!token);
            console.log("   - Cookie value:", token?.value ? 'Has value' : 'No value');
            console.log("   - Pathname:", pathname);
            
            // Only redirect if this is a navigation request (not a background request)
            const isNavigationRequest = req.headers.get('accept')?.includes('text/html');
            
            if (isNavigationRequest) {
                console.log("🔄 Navigation request without token, redirecting to /admin-Login");
                return NextResponse.redirect(new URL("/admin-Login", req.url));
            } else {
                console.log("⚠️ API/background request without token, allowing to continue");
                // Don't redirect API requests or background requests
                return NextResponse.next();
            }
        } else {
            // Validate token format (basic JWT check)
            try {
                const tokenParts = token.value.split('.');
                if (tokenParts.length !== 3) {
                    console.log("❌ Invalid token format, redirecting to login");
                    return NextResponse.redirect(new URL("/admin-Login", req.url));
                }
                
                // Basic expiry check (don't decode fully to avoid errors)
                const payload = JSON.parse(atob(tokenParts[1]));
                const currentTime = Date.now() / 1000;
                
                if (payload.exp && payload.exp < currentTime - 60) { // 1 minute grace period
                    console.log("⏰ Token expired (with grace period), redirecting to login");
                    return NextResponse.redirect(new URL("/admin-Login", req.url));
                }
                
                console.log('✅ Valid token found for admin route');
            } catch (error) {
                console.log("❌ Token validation error:", error.message);
                console.log("⚠️ Allowing request to continue despite validation error");
                // Don't redirect on token decode errors - let the app handle it
                return NextResponse.next();
            }
        }
    }

    // Redirect to dashboard if already logged in and trying to access login page
    if (token?.value && pathname === "/admin-Login") {
        console.log("🔄 Already logged in, redirecting to /admin/dashboard");
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    console.log('✅ Middleware passed, continuing to:', pathname);
    return NextResponse.next();
}

export const config = {
    // Only run middleware on specific routes to reduce interference
    matcher: [
        "/admin/:path*", 
        "/admin-Login", 
        "/forget-password",
        "/reset-password"
    ],
};