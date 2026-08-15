export type McpAccessDeniedReason =
  | "missing_read_scope"
  | "missing_propose_scope"
  | "missing_direct_edit_scope"
  | "section_not_available"
  | "section_read_only";

type McpAccessDeniedInput = {
  clientName: string;
  requestedAction: string;
  reason: McpAccessDeniedReason;
  sectionId?: string;
  requestId?: string | null;
  // Deliberately accepted but never emitted. This keeps the audit boundary
  // defensive if a future caller passes request or section content by mistake.
  content?: unknown;
};

function safeIdentifier(value: string | undefined | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, 120) : undefined;
}

/**
 * Metadata for a refused MCP operation. It is intentionally limited to the
 * access decision itself: no profile body, prompts, bearer token, or secret
 * can cross this boundary into the audit log.
 */
export function buildMcpAccessDeniedMetadata(
  input: McpAccessDeniedInput,
): Record<string, string> {
  const sectionId = safeIdentifier(input.sectionId);
  const requestId = safeIdentifier(input.requestId);

  return {
    integration: "mcp",
    clientName: safeIdentifier(input.clientName) ?? "unknown",
    requestedAction: safeIdentifier(input.requestedAction) ?? "unknown",
    reason: input.reason,
    ...(sectionId ? { sectionId } : {}),
    ...(requestId ? { requestId } : {}),
  };
}

export function classifyMcpAccessDenial(error: unknown): McpAccessDeniedReason | null {
  if (!(error instanceof Error)) return null;
  if (error.message.startsWith("Section ") && error.message.includes("is read-only")) {
    return "section_read_only";
  }
  if (error.message.startsWith("No section matches ")) {
    // Hidden and archived sections intentionally share this result with an
    // unknown section so an agent cannot use errors as a visibility oracle.
    return "section_not_available";
  }
  return null;
}
