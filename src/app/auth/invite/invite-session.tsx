"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function InviteSession() {
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function acceptInvitation() {
      const supabase = createSupabaseBrowserClient();
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const code = new URLSearchParams(window.location.search).get("code");

      window.history.replaceState({}, document.title, window.location.pathname);

      const result = accessToken && refreshToken
        ? await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        : code
          ? await supabase.auth.exchangeCodeForSession(code)
          : { error: new Error("The invitation did not contain a valid session.") };

      if (!active) return;
      if (result.error) {
        setError("This invitation link is invalid or has expired. Ask a super administrator to send a new invitation.");
        return;
      }

      window.location.replace("/auth/set-password");
    }

    void acceptInvitation();
    return () => { active = false; };
  }, []);

  if (error) {
    return (
      <div>
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-900">{error}</p>
        <Link href="/admin/login" className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-4 text-sm font-extrabold text-navy-950 hover:bg-slate-50">Return to administrator sign-in</Link>
      </div>
    );
  }

  return <p role="status" className="rounded-xl border border-science-200 bg-science-50 px-4 py-3 text-sm font-bold leading-6 text-science-900">Verifying your secure invitation…</p>;
}
