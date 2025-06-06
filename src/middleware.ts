import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token");
  const userCookie = request.cookies.get("user");

  if (!request.url) {
    console.error("No URL found in request");
    return NextResponse.redirect(new URL("/", request.url));
  }

  const currentUrl = new URL(request.url);

  if (!/^\/professionals\//.test(currentUrl.pathname)) {
    console.log("Not a professional route");
    return NextResponse.next();
  }

  if (!token) {
    console.error("No token found");
    return NextResponse.redirect(new URL("/authentication", request.url));
  }

  if (!userCookie || !userCookie.value) {
    console.error("No user cookie found or user cookie is empty");
    return NextResponse.redirect(new URL("/authentication", request.url));
  }

  try {
    console.log("Raw user cookie:", userCookie.value);
    const decodedUserCookie = decodeURIComponent(userCookie.value);
    const user = JSON.parse(decodedUserCookie);

    if (user.role !== "professional") {
      console.error("User is not a professional, redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error("Error parsing user cookie:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
