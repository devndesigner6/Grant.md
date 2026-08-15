import "server-only";

import { getFeatureModelId } from "@/lib/ai/model-catalog";
import { readAiSettings } from "@/lib/ai/persistence";
import { decryptSecret } from "@/lib/secret-crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { SupabaseLikeClient } from "@/lib/supabase/types";
import type { AiFeature } from "@/lib/ai/features";

export type ResolvedAiCredential = {
  apiKey: string;
  modelId: string;
};

const SETUP_MESSAGE = "Add your OpenRouter key in Settings.";

export async function resolveAiCredential(
  client: unknown,
  userId: string,
  feature: AiFeature,
): Promise<ResolvedAiCredential> {
  const settings = await readAiSettings(client, userId);
  if (!settings?.encrypted_api_key || settings.key_status !== "valid") {
    throw new Error(SETUP_MESSAGE);
  }

  return {
    apiKey: decryptSecret(settings.encrypted_api_key),
    modelId: getFeatureModelId(feature),
  };
}

export async function resolveCompanyAiCredential(
  creedId: string,
  feature: AiFeature,
): Promise<ResolvedAiCredential> {
  const admin = getSupabaseAdminClient() as unknown as SupabaseLikeClient;
  const { data, error } = await admin
    .from("creed_company_ai_settings")
    .select("encrypted_openrouter_key, key_status")
    .eq("creed_id", creedId)
    .maybeSingle();
  if (error) throw new Error("Could not load company AI settings.");

  const settings = data as
    | { encrypted_openrouter_key?: string | null; key_status?: string }
    | null;
  if (!settings?.encrypted_openrouter_key || settings.key_status !== "present") {
    throw new Error(SETUP_MESSAGE);
  }

  return {
    apiKey: decryptSecret(settings.encrypted_openrouter_key),
    modelId: getFeatureModelId(feature),
  };
}
