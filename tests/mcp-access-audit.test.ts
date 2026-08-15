import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildMcpAccessDeniedMetadata } from "../lib/mcp-access-audit.ts";

test("MCP denial audit metadata identifies the decision without retaining profile content", () => {
  const metadata = buildMcpAccessDeniedMetadata({
    clientName: "Codex",
    requestedAction: "direct_edit_creed",
    reason: "missing_direct_edit_scope",
    sectionId: "private-notes",
    requestId: "request-123",
    content: "This must never enter the audit log.",
  });

  assert.deepEqual(metadata, {
    integration: "mcp",
    clientName: "Codex",
    requestedAction: "direct_edit_creed",
    reason: "missing_direct_edit_scope",
    sectionId: "private-notes",
    requestId: "request-123",
  });
  assert.equal("content" in metadata, false);
});

test("MCP scope and section refusals are recorded through the metadata-only audit boundary", () => {
  const route = readFileSync(new URL("../app/mcp/route.ts", import.meta.url), "utf8");

  assert.match(route, /action: "mcp\.access_denied"/);
  assert.match(route, /buildMcpAccessDeniedMetadata/);
  assert.match(route, /"missing_read_scope"/);
  assert.match(route, /"missing_propose_scope"/);
  assert.match(route, /"missing_direct_edit_scope"/);
  assert.match(route, /classifyMcpAccessDenial\(error\)/);
});
