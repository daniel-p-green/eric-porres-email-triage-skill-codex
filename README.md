# Eric Porres Email Triage Skill For Codex

Based on the original workflow by Eric Porres.

This repository ports Eric Porres' inbox triage method to Codex as a global skill package while preserving the original operating model: snippet-first triage, three-tier prioritization, reply drafting, and explicit confirmation gates before any send or archive action.

## Teaser

<video src="assets/video/codex-teaser-low.mp4" poster="assets/video/codex-teaser-poster.png" controls preload="metadata" width="960">
  Your browser does not support embedded video.
</video>

- Low-res teaser: `assets/video/codex-teaser-low.mp4`
- High-res teaser: `assets/video/codex-teaser.mp4`
- Poster frame: `assets/video/codex-teaser-poster.png`

## Why This Exists

Most inbox tooling optimizes for filtering mechanics. This workflow optimizes for decision quality.

- Scan recent inbox traffic using a reliable time window
- Classify for action priority, not label aesthetics
- Draft high-context replies only for items that require action
- Keep user control with explicit confirmation checkpoints

## Feature Highlights

- Snippet-first inbox triage for speed and token efficiency
- Three-tier output: Reply Needed, Review, Noise
- Alias-aware routing with content fallback
- Thread-aware drafting for Tier 1 responses
- Strict safety defaults with no implicit execution

## Install

Install as a global Codex skill:

```bash
mkdir -p ~/.codex/skills
cp -R skills/email-triage ~/.codex/skills/email-triage
```

Restart Codex after installation.

## Gmail MCP Setup

This skill requires a configured Gmail MCP server.

Template setup pattern:

```bash
codex mcp add gmail --url https://<your-gmail-mcp-server>/mcp
codex mcp login gmail
```

Full setup and troubleshooting:
- `skills/email-triage/references/setup-gmail-mcp.md`

## Usage Prompts

- "check email"
- "triage my inbox"
- "morning email"
- "inbox summary"
- "draft a reply to #2"
- "archive noise"

## Output Contract

The skill returns:

- `# Inbox Triage - <date>`
- `## Reply Needed (N)` with numbered entries
- `## Review (N)`
- `## Noise (N)` with category counts

Contract reference:
- `skills/email-triage/references/output-contract.md`

## Safety Model

- Never send email without explicit confirmation
- Never archive without explicit confirmation
- Never permanently delete
- Never auto-execute destructive inbox actions

## Quality Gates

Run the validation suite:

```bash
bash scripts/run_all_checks.sh
```

Checks include:

1. Fixture-based classification parity
2. Output contract validation
3. Required file and trigger checks
4. Markdown link integrity checks
5. `agents/openai.yaml` structure checks

Manual live verification checklist:
- `tests/smoke/live-gmail-checklist.md`

## Compatibility Summary

| Area | Claude Plugin | Codex Skill Port |
|---|---|---|
| Packaging | `.claude-plugin` + commands + skill | Global Codex skill (`~/.codex/skills/email-triage`) |
| Entry | `/email`, `/summary`, natural language | Natural language trigger phrases |
| Core triage logic | `skills/email-triage/SKILL.md` | `skills/email-triage/SKILL.md` |
| Gmail dependency | Gmail MCP tools | Gmail MCP tools |
| Safety posture | Explicit confirmation | Explicit confirmation |

Behavior target is near 1:1 parity with Eric's original workflow.

## Attribution

This is an independent Codex adaptation of:

- Original project: [ericporres/email-triage-plugin](https://github.com/ericporres/email-triage-plugin)
- Original author: [Eric Porres](https://github.com/ericporres)

Attribution is intentionally prominent in this repository name, README, NOTICE, and licensing context.

## Repository Layout

```text
eric-porres-email-triage-skill-codex/
├── README.md
├── LICENSE
├── NOTICE.md
├── assets/video/
├── skills/email-triage/
├── tests/
├── scripts/
└── video/teaser/
```

## License

MIT. See `LICENSE` and `NOTICE.md`.
