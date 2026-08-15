# Grant CLI

The first-party terminal client for Grant. It connects to the same OAuth-protected MCP server as Claude, Codex, ChatGPT, Cursor, and other Grant integrations.

The CLI discovers tools, resources, and prompts from the live Grant MCP server. New tools therefore appear without requiring a matching CLI release.

## Install

```bash
npm install --global @devndesigner/grant-cli
grant
```

You can also run it without installing:

```bash
npx @devndesigner/grant-cli
```

The first run opens Grant's OAuth screen in your browser. Allow the connection, then return to the terminal.

## Interactive terminal

Run `grant` with no arguments and enter any live tool name. Required arguments are collected from the tool's live JSON schema.

## Commands

```bash
grant login
grant logout
grant status
grant doctor
grant tools
grant call read_creed
grant call creed_search --query "current priorities" --limit 5
grant resources
grant resource creed://profile
grant prompts
grant prompt introduce-me
```

`grant status` reports whether credentials exist locally. Use `grant doctor` to verify the live OAuth session and server capabilities.

Every MCP tool is also available directly by its exact name:

```bash
grant creed_get_section --section-id goals
```

For scripts and coding agents, use JSON mode:

```bash
grant --agent codex tools --json
grant --agent codex call creed_search --args '{"query":"current priorities","limit":5}' --json
printf '%s' '{"sectionId":"goals"}' | grant --agent codex call creed_get_section --json
```

JSON is written to stdout and diagnostics are written to stderr. Interactive formatting and ANSI colour are disabled automatically outside a terminal. Commands copied from Grant Connections include `--agent` so Grant can record real CLI attribution and last-seen activity. Omit it for unattributed manual terminal use.

## Self-hosted Grant

Use a server for one command:

```bash
grant --server http://localhost:3000/mcp doctor
```

Or save it:

```bash
grant config set server https://grant-md.vercel.app/mcp
```

`GRANT_MCP_URL` can also set the server. HTTPS is required except on localhost.

## Security

Grant CLI uses OAuth 2.1 Dynamic Client Registration and PKCE. It never asks you to copy an API token. Credentials are stored per server in the platform configuration directory with restrictive filesystem permissions and are never printed by the CLI. `grant logout` revokes the OAuth grant when the server supports RFC 7009 revocation, then removes local credentials.

Set `NO_COLOR=1` to disable terminal colour.
