import { NextResponse, type NextRequest } from "next/server";
import { refreshSupabaseSession } from "@/lib/supabase/proxy";

function safeReturnPath(value: string | null) {
  return value?.startsWith("/admin") &&
    value !== "/admin/login" &&
    !value.startsWith("//")
    ? value
    : "/admin";
}

export async function proxy(request: NextRequest) {
  const { response, isAuthenticated, configured } =
    await refreshSupabaseSession(request);
  const pathname = request.nextUrl.pathname;
  const isLogin = pathname === "/admin/login";

  if (pathname.startsWith("/admin") && !isLogin && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("returnTo", safeReturnPath(pathname));
    if (!configured) loginUrl.searchParams.set("setup", "required");
    return NextResponse.redirect(loginUrl);
  }

  // A valid Supabase session does not necessarily belong to an active
  // administrator. Keep the login route reachable so the server-side login
  // action can verify the profile and sign out inactive or unauthorized users
  // instead of bouncing them between /admin and /admin/login.
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
