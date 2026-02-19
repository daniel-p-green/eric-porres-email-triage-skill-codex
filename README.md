# eric-porres-email-triage-skill-codex

Based on the original workflow by Eric Porres.

This repository ports Eric Porres' inbox triage workflow to Codex as a global skill package while preserving the original model: snippet-first triage, three-tier prioritization, reply drafting, and explicit confirmation gates before any send or archive action.

## Attribution

This project is an independent Codex adaptation of:
- Original project: https://github.com/ericporres/email-triage-plugin
- Original author: Eric Porres

Attribution is intentionally prominent in this repository name, README, NOTICE, and licensing context.

## What This Skill Does

- Scans Gmail inbox with a time window (default: last 24 hours)
- Classifies messages into:
  - Reply Needed
  - Review
  - Noise
- Drafts replies for Tier 1 items with voice guidance
- Requires explicit confirmation before send/archive

## Install (Global Codex Skill)

### Option A: Install from local clone

```bash
mkdir -p ~/.codex/skills
cp -R skills/email-triage ~/.codex/skills/email-triage
```

Restart Codex after installation.

### Option B: Install from published repo

Use your normal skill installation workflow once this repo is published.

## Gmail MCP Setup (Provider-Agnostic)

This skill expects a Gmail MCP server to be configured in Codex.

Template setup command pattern:

```bash
codex mcp add gmail --url https://<your-gmail-mcp-server>/mcp
codex mcp login gmail
```

Then restart Codex. For detailed setup and troubleshooting, see:
- `skills/email-triage/references/setup-gmail-mcp.md`

## Usage Prompts (Codex)

- "check email"
- "triage my inbox"
- "morning email"
- "inbox summary"
- "draft a reply to #2"
- "archive noise"

## Output Contract

The skill must produce:

- `# Inbox Triage - <date>`
- `## Reply Needed (N)` with numbered entries
- `## Review (N)`
- `## Noise (N)` with category counts

Contract details:
- `skills/email-triage/references/output-contract.md`

## Safety Guarantees

- Never send email without explicit confirmation
- Never archive without explicit confirmation
- Never permanently delete

## Test Strategy

Layered validation is included:

1. Fixture classification checks
- `tests/classification/run_fixture_checks.py`
- `tests/classification/test_tiering_matrix.md`

2. Output contract checks
- `tests/contracts/check_output_contract.py`
- `tests/contracts/test_output_format.md`

3. Live Gmail smoke checklist
- `tests/smoke/live-gmail-checklist.md`

Run all checks:

```bash
bash scripts/run_all_checks.sh
```

## Claude Plugin vs Codex Skill

| Area | Claude plugin | Codex skill port |
|---|---|---|
| Packaging | `.claude-plugin` + commands + skill | Codex global skill (`~/.codex/skills/email-triage`) |
| Entry | `/email`, `/summary`, natural language | natural language trigger phrases |
| Core logic | `skills/email-triage/SKILL.md` | `skills/email-triage/SKILL.md` |
| Gmail dependency | Gmail MCP tools | Gmail MCP tools |
| Safety model | explicit confirmation | explicit confirmation |

Behavior is intentionally near 1:1 with Eric's workflow.

## Repository Layout

```text
eric-porres-email-triage-skill-codex/
├── README.md
├── LICENSE
├── NOTICE.md
├── skills/
│   └── email-triage/
│       ├── SKILL.md
│       ├── agents/openai.yaml
│       └── references/
│           ├── setup-gmail-mcp.md
│           ├── classification-rules.md
│           ├── reply-voice-and-guards.md
│           └── output-contract.md
├── tests/
│   ├── fixtures/inbox-scenarios/*.json
│   ├── classification/
│   ├── contracts/
│   └── smoke/
└── scripts/run_all_checks.sh
```

## License

MIT. See `LICENSE` and `NOTICE.md`.
