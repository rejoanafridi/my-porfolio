import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// Get secret key from environment variables
const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "your-secret-key-at-least-32-chars-long")

export async function middleware(request: NextRequest) {
  // Only protect /admin routes, excluding /admin/login
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    // Get the token from the cookies
    const token = request.cookies.get("auth-token")?.value

    // If there's no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      // Verify the token
      const { payload } = await jwtVerify(token, JWT_SECRET)

      // Check if user is admin
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }

      // User is authenticated and is an admin, proceed
      return NextResponse.next()
    } catch (error) {
      // Token is invalid or expired
      const response = NextResponse.redirect(new URL("/admin/login", request.url))

      // Clear the invalid token
      response.cookies.delete("auth-token")

      return response
    }
  }

  // For all other routes, proceed normally
  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/admin/:path*"],
}
