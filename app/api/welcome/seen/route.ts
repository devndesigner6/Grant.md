import { NextResponse } from "next/server";
import { NO_STORE_HEADERS } from "@/lib/http-headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// Marks the one-time welcome pop-up as seen for the current user. Called
// (fire-and-forget) whenever the user closes the tour - via the X, Esc,
// overlay click, the final Done button, or an inline link (roadmap/Discord).
// Idempotent: writing welcomed_at again is harmless. Auth-gated; an unauthed
// caller gets 401.
//
// Fails soft: a write error (including welcomed_at not existing yet, before
// the migration runs) still returns 204 because the client also mirrors the
// dismissal to localStorage, so the tour never re-shows on this device even
// if the server write is lost. It is purely cosmetic state.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function POST() {
  if (!isSupabaseConfigured()) {
    return new NextResponse(null, { status: 204, headers: NO_STORE_HEADERS });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not signed in" },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  // Welcome dismissal is client-local and independent of workspace state.
  return new NextResponse(null, { status: 204, headers: NO_STORE_HEADERS });
}
