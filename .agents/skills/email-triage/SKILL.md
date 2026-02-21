---
name: email-triage
description: This skill should be used when the user asks to "check email", "triage my inbox", "check my email", "morning email", or "inbox summary". Scans recent inbox messages, classifies them into three priority tiers, drafts replies for urgent items, and enforces explicit confirmation before send or archive actions.
---

# Email Triage Skill (Codex Port)

Preserve the original Eric Porres triage workflow with near 1:1 behavior:
- snippet-first scanning
- three-tier classification
- reply drafting for urgent messages
- explicit confirmation before send/archive

## Use When

- User explicitly invokes `$email-triage` and wants inbox triage.
- User asks for a time-windowed Gmail summary with clear priority tiers.
- User wants draft help for urgent inbox items.

## Don't Use When

- User asks to modify labels/filters or inbox rules.
- User asks to permanently delete email.
- User asks to triage a non-Gmail inbox without Gmail MCP capability.
- User asks for autonomous send/archive actions without explicit confirmation.

## Step 0: Preflight, Consent, and Context

1. Confirm Gmail MCP tools are available.
2. If Gmail tools are missing, stop triage and provide setup guidance from:
- `references/setup-gmail-mcp.md`
3. Determine the intended inbox query window.
4. Before any Gmail MCP read/search call, ask for explicit consent with the exact query.
- Example: "I'm about to scan `in:inbox newer_than:1d` using Gmail MCP. Reply `yes` to proceed, or tell me a different window/filter."
5. If user says "no", stop and offer options:
- change window (for example `12h`, `3d`)
- add a sender/filter
- cancel triage
6. Load optional user context if present (family contacts, aliases, voice profile).

## Step 1: Time-windowed Inbox Scan

Use a time-windowed query, not unread-state filtering.

Only execute this step after explicit user consent in Step 0.

Default query:

```text
in:inbox newer_than:1d
```

Use intent-based variants:
- "just today" -> `newer_than:12h`
- "catch me up" / "this week" -> `newer_than:3d`

Prefer snippet-first classification to limit expensive reads.

## Step 2: Snippet-first Classification

Classify from sender + subject + snippet first.

Only read full message/thread when:
- item is Tier 1
- Tier 2 item is ambiguous
- user asks for reply drafting details

Tier definitions:
- Reply Needed: direct asks, deadlines, urgent family/work/financial/school/medical
- Review: relevant updates that may not need reply
- Noise: bulk marketing/newsletters/social/promotional

Detailed rules and parity matrix:
- `references/classification-rules.md`

## Step 3: Present Standard Output

Use the strict output format from:
- `references/output-contract.md`

Must include:
- `# Inbox Triage - <date>`
- `## Reply Needed (N)` with numbered items
- `## Review (N)`
- `## Noise (N)` with category counts

## Step 4: Reply Drafting

When asked to draft (for example, "draft a reply to #3"):

1. Read full message if not already loaded.
2. Read full thread for context.
3. Draft concise reply in configured voice.
4. Present draft for review.
5. Require explicit confirmation before any send action.

Voice and guardrails:
- `references/reply-voice-and-guards.md`

## Step 5: Archive Offer (Noise only)

If Tier 3 exists:
1. Offer archive action.
2. List what will be archived.
3. Require explicit confirmation.
4. Archive only after confirmation.
5. Report archive results.

Never auto-archive. Never delete permanently.

## Edge Cases

- Empty inbox window: return clean inbox message.
- High volume (>50): warn and offer batching/filtering.
- Ambiguous snippets: read full message before hard classification.
- Unknown alias: fall back to content-based classification.

## Additional Resources

- Setup and troubleshooting: `references/setup-gmail-mcp.md`
- Tiering and urgency rules: `references/classification-rules.md`
- Voice and safety guardrails: `references/reply-voice-and-guards.md`
- Output schema: `references/output-contract.md`
