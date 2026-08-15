import { NextResponse } from "next/server";
import {
  readAiUsageSummary,
  readCompanyAiUsageSummary,
  type AiMode,
  type AiUsageRange,
} from "@/lib/ai/persistence";
import { requireApiAuth } from "@/lib/api-auth";
import { resolveMemberCompanyCreed, resolveMemberCompanyCreedById } from "@/lib/creed-context";

const ranges = new Set<AiUsageRange>(["7d", "30d", "90d"]);

export async function GET(request: Request) {
  const auth = await requireApiAuth();
  if (auth instanceof NextResponse) return auth;

  const url = new URL(request.url);
  const range = url.searchParams.get("range") as AiUsageRange | null;
  const resolvedRange = range && ranges.has(range) ? range : "90d";
  const mode: AiMode = "byok";

  // Company members can view the pooled model-usage chart for the company Creed
  // they belong to. An explicit `?creedId=` pins the company (validated),
  // independent of the cookie.
  const requestedCreedId = url.searchParams.get("creedId")?.trim();
  const company = requestedCreedId
    ? await resolveMemberCompanyCreedById(auth.supabase, auth.user, requestedCreedId)
    : await resolveMemberCompanyCreed(auth.supabase, auth.user);
  let usage;
  if (company) {
    usage = await readCompanyAiUsageSummary(company.creedId, resolvedRange, mode);
  } else {
    usage = await readAiUsageSummary(auth.supabase, auth.user.id, resolvedRange, mode);
  }
  return NextResponse.json({ usage });
}
