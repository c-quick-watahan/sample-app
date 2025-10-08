import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If no token and trying to access protected route, redirect to signin
  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  // Otherwise, allow the request
  return NextResponse.next();
}

export const config = {
  matcher: ["/edit-profile/:path*"],
};
