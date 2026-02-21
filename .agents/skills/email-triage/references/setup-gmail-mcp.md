# Gmail MCP Setup (Provider-agnostic)

This skill requires a Gmail MCP server in Codex.

## Required capability classes

The configured Gmail MCP server should provide equivalent capabilities for:
- inbox search/list
- message read
- thread read
- draft/send operations
- archive operations

Tool names can vary by provider. Capability parity matters more than exact tool naming.

## Template setup pattern

```bash
codex mcp add gmail --url https://<your-gmail-mcp-server>/mcp
codex mcp login gmail
```

Restart Codex after setup.

## Missing tools behavior

If Gmail tools are unavailable:
1. Stop triage immediately.
2. Explain Gmail MCP is required.
3. Provide template setup command pattern above.
4. Ask user to retry after setup.

## Quick verification checklist

1. MCP server appears in Codex config.
2. Authentication succeeds.
3. A basic inbox search works.
4. A basic message read works.
5. Archive and draft capabilities are present.

## Troubleshooting

- Auth failures: re-run `codex mcp login gmail`.
- Missing capability tools: use a provider that exposes search/read/thread/draft/archive capabilities.
- Wrong server alias: ensure commands and config use consistent server key (for example `gmail`).
