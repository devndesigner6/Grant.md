import type { AiFeature } from "@/lib/ai/features";

// OpenRouter does not publish a comparable quality benchmark for every model.
// Grant therefore records only provider metadata and never invents a quality
// score. The `uncertain` value keeps historical usage rows type-compatible.
export type AiModelQuality = "uncertain";

export type AiModelCatalogItem = {
  id: string;
  name: string;
  provider: string;
  quality: AiModelQuality;
  inputCostPerMillion: number;
  outputCostPerMillion: number;
  description: string;
  contextLength?: number;
};

type OpenRouterModel = {
  id: string;
  name?: string;
  description?: string;
  context_length?: number;
  architecture?: {
    input_modalities?: string[];
    output_modalities?: string[];
    modality?: string;
  };
  pricing?: {
    prompt?: string;
    completion?: string;
  };
};

export const AI_MODEL_QUALITY_META: Record<AiModelQuality, { label: string; color: string; tint: string }> = {
  uncertain: {
    label: "Provider metadata",
    color: "#9CA3AF",
    tint: "#F3F4F6",
  },
};

export const DEFAULT_AI_MODEL_ID = "openai/gpt-5.5";

const FEATURE_MODEL_ENV: Record<AiFeature, string> = {
  analysis: "ANALYSIS_MODEL",
  tab: "TAB_MODEL",
  panel: "PANEL_MODEL",
};

const FEATURE_MODEL_DEFAULT: Record<AiFeature, string> = {
  analysis: "anthropic/claude-haiku-4.5",
  tab: "openai/gpt-oss-120b",
  panel: "openai/gpt-oss-120b",
};

export function getFeatureModelId(feature: AiFeature): string {
  return process.env[FEATURE_MODEL_ENV[feature]]?.trim() || FEATURE_MODEL_DEFAULT[feature];
}

// Agent edits are the Panel feature's mutating mode, so they share the same
// configured model instead of introducing a separate legacy environment value.
export function getAgentModelId(): string {
  return getFeatureModelId("panel");
}

const FALLBACK_MODELS: AiModelCatalogItem[] = [
  {
    id: "anthropic/claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    quality: "uncertain",
    inputCostPerMillion: 0,
    outputCostPerMillion: 0,
    description: "Configured fallback. Live provider metadata is unavailable.",
  },
  {
    id: "openai/gpt-oss-120b",
    name: "GPT-OSS 120B",
    provider: "OpenAI",
    quality: "uncertain",
    inputCostPerMillion: 0,
    outputCostPerMillion: 0,
    description: "Configured fallback. Live provider metadata is unavailable.",
  },
  {
    id: DEFAULT_AI_MODEL_ID,
    name: "GPT-5.5",
    provider: "OpenAI",
    quality: "uncertain",
    inputCostPerMillion: 0,
    outputCostPerMillion: 0,
    description: "Configured fallback. Live provider metadata is unavailable.",
  },
];

const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";
const MODEL_CACHE_MS = 10 * 60_000;
let cachedCatalog: { models: AiModelCatalogItem[]; expiresAt: number } | null = null;

function providerFromModelId(id: string) {
  const raw = id.split("/")[0] || "OpenRouter";
  const known: Record<string, string> = {
    openai: "OpenAI",
    anthropic: "Anthropic",
    google: "Google",
    "google-deepmind": "Google",
    "x-ai": "xAI",
    meta: "Meta",
    "meta-llama": "Meta",
    mistralai: "Mistral",
    mistral: "Mistral",
    deepseek: "DeepSeek",
    qwen: "Qwen",
    moonshotai: "Moonshot",
    moonshot: "Moonshot",
    "z-ai": "Z.ai",
    zai: "Z.ai",
    cohere: "Cohere",
    perplexity: "Perplexity",
    amazon: "Amazon",
    microsoft: "Microsoft",
    ai21: "AI21",
    nvidia: "NVIDIA",
    nousresearch: "Nous Research",
    inflection: "Inflection",
  };

  return known[raw] ?? raw.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function dollarsPerMillion(value: unknown) {
  const numeric = typeof value === "string" ? Number(value) : typeof value === "number" ? value : 0;
  return Number.isFinite(numeric) ? numeric * 1_000_000 : 0;
}

const NON_TEXT_OUTPUT_MODALITIES = new Set(["image", "audio", "video", "speech"]);
const NON_TEXT_MODEL_PATTERNS = [
  /image/i,
  /vision[-_]?gen/i,
  /\bdall[-_ ]?e\b/i,
  /\bimagen\b/i,
  /\bflux\b/i,
  /\bsdxl\b/i,
  /stable[-_]?diffusion/i,
  /\bnano[-_ ]?banana\b/i,
  /\bideogram\b/i,
  /\bplayground[-_ ]?v\d/i,
  /\bkandinsky\b/i,
  /\baudio\b/i,
  /\btts\b/i,
  /\bwhisper\b/i,
  /\bspeech\b/i,
  /\bvideo\b/i,
  /\bsora\b/i,
  /\bveo\b/i,
];

function normalizeOpenRouterModel(model: OpenRouterModel): AiModelCatalogItem | null {
  const inputModalities = model.architecture?.input_modalities ?? [];
  const outputModalities = model.architecture?.output_modalities ?? [];
  const modality = model.architecture?.modality ?? "";
  const readsText = inputModalities.includes("text") || modality.includes("text");
  const writesText = outputModalities.includes("text") || modality.endsWith("->text");

  if (!readsText || !writesText || outputModalities.some((item) => NON_TEXT_OUTPUT_MODALITIES.has(item))) {
    return null;
  }
  if (modality.includes("->image") || modality.includes("->audio") || modality.includes("->video")) {
    return null;
  }
  if (NON_TEXT_MODEL_PATTERNS.some((pattern) => pattern.test(`${model.id} ${model.name ?? ""}`))) {
    return null;
  }

  return {
    id: model.id,
    name: model.name?.replace(/^[^:]+:\s*/, "").trim() || model.id,
    provider: providerFromModelId(model.id),
    quality: "uncertain",
    inputCostPerMillion: dollarsPerMillion(model.pricing?.prompt),
    outputCostPerMillion: dollarsPerMillion(model.pricing?.completion),
    description: model.description?.trim() || "Available through OpenRouter.",
    contextLength: model.context_length,
  };
}

function sortModels(models: AiModelCatalogItem[]) {
  return [...models].sort((left, right) => {
    if (left.id === DEFAULT_AI_MODEL_ID) return -1;
    if (right.id === DEFAULT_AI_MODEL_ID) return 1;
    return left.provider.localeCompare(right.provider) || left.name.localeCompare(right.name);
  });
}

export async function getOpenRouterModelCatalog({ force = false }: { force?: boolean } = {}) {
  if (!force && cachedCatalog && cachedCatalog.expiresAt > Date.now()) return cachedCatalog.models;

  try {
    const response = await fetch(OPENROUTER_MODELS_URL, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const payload = (await response.json()) as { data?: OpenRouterModel[] };
    if (!response.ok || !Array.isArray(payload.data)) throw new Error("Could not load OpenRouter models");

    const models = sortModels(
      payload.data
        .map(normalizeOpenRouterModel)
        .filter((model): model is AiModelCatalogItem => Boolean(model)),
    );
    cachedCatalog = { models, expiresAt: Date.now() + MODEL_CACHE_MS };
    return models;
  } catch {
    return FALLBACK_MODELS;
  }
}

export async function getAiModel(modelId: string | null | undefined) {
  const models = await getOpenRouterModelCatalog();
  return models.find((model) => model.id === modelId) ?? models.find((model) => model.id === DEFAULT_AI_MODEL_ID) ?? FALLBACK_MODELS[0];
}

export async function estimateAiCostUsd({
  modelId,
  inputTokens,
  outputTokens,
}: {
  modelId: string;
  inputTokens: number;
  outputTokens: number;
}) {
  const model = await getAiModel(modelId);
  return (
    (inputTokens / 1_000_000) * model.inputCostPerMillion +
    (outputTokens / 1_000_000) * model.outputCostPerMillion
  );
}
