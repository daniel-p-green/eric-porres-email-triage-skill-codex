# Live Gmail Smoke Checklist

Use this checklist in a real Gmail MCP-connected Codex session.

## Preconditions

- Gmail MCP server configured and authenticated.
- Inbox access available.

## Steps

1. Prompt: "check email"
2. Verify output contains:
   - `# Inbox Triage - <date>`
   - `## Reply Needed (N)` with numbered entries
   - `## Review (N)`
   - `## Noise (N)` with counts
3. Prompt: "draft a reply to #1"
4. Verify draft generated and explicit send confirmation requested.
5. Prompt: "archive noise"
6. Verify a second explicit archive confirmation is requested before archive action.
7. Confirm no send/archive action occurs before explicit confirmation.

## Pass criteria

- All structural sections present
- Numbered Tier 1 draft references work
- Send gate and archive gate both require explicit confirmation
- No destructive delete behavior observed
