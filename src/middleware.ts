import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/verify") ||
      url.pathname.startsWith("/"))
  ) {
    console.log(token, "starttttttttttttttttttttttttttttt");
    localStorage.setItem("token", JSON.stringify(token));
    return NextResponse.redirect(new URL("/dashbaord", request.url));
  }
  if (!token && url.pathname.startsWith("/dashboard"))
    console.log("renderedddddddddddddddddddddddddddddddddddd");
  return NextResponse.redirect(new URL("/sign-in", request.url));
}

export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/sign-in", "/sign-up", "/dashboard/:path*", "/", "/verify/:path*"],
};
