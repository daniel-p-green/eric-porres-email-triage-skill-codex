#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "[1/8] Running fixture classification checks"
python3 tests/classification/run_fixture_checks.py

echo "[2/8] Running output contract checks"
python3 tests/contracts/check_output_contract.py

echo "[3/8] Running required-file and trigger checks"
required_files=(
  "skills/email-triage/SKILL.md"
  "skills/email-triage/agents/openai.yaml"
  "skills/email-triage/references/setup-gmail-mcp.md"
  "skills/email-triage/references/classification-rules.md"
  "skills/email-triage/references/reply-voice-and-guards.md"
  "skills/email-triage/references/output-contract.md"
  "tests/classification/test_tiering_matrix.md"
  "tests/contracts/test_output_format.md"
  "tests/smoke/live-gmail-checklist.md"
  "scripts/validate_release.py"
  "scripts/build_release_fixture.py"
  "scripts/check_fixture_balance.py"
  "scripts/check_canary_evidence.py"
  "scripts/check_human_signoff.py"
  "scripts/generate_release_report.py"
  "scripts/eval_triage.py"
  "eval/README.md"
  "eval/LABELING_RUBRIC.md"
  "docs/release/GO_NO_GO_CHECKLIST.md"
  "docs/release/CANARY_RUNBOOK.md"
  "docs/release/RELEASE_REPORT_TEMPLATE.md"
)
for f in "${required_files[@]}"; do
  [[ -f "$f" ]] || { echo "Missing required file: $f"; exit 1; }
done

grep -q '^name: email-triage$' skills/email-triage/SKILL.md || {
  echo "SKILL.md frontmatter missing required name"
  exit 1
}
grep -q '"check email"' skills/email-triage/SKILL.md || {
  echo "SKILL.md missing explicit trigger phrase"
  exit 1
}

echo "[4/8] Running markdown link integrity checks"
python3 - <<'PY'
import re
from pathlib import Path

root = Path(".").resolve()
missing = []
ignored_dirs = {".git", "node_modules", ".venv", "venv", "dist", "build"}
for md in root.rglob("*.md"):
    rel = md.relative_to(root)
    if any(part in ignored_dirs for part in rel.parts):
        continue
    text = md.read_text(encoding="utf-8")
    for match in re.finditer(r"\[[^\]]+\]\(([^)]+)\)", text):
        link = match.group(1).strip()
        if link.startswith(("http://", "https://", "mailto:", "#")):
            continue
        target = (md.parent / link).resolve()
        if not target.exists():
            missing.append((rel, link))

if missing:
    print("Broken local markdown links:")
    for file_path, link in missing:
        print(f"- {file_path} -> {link}")
    raise SystemExit(1)

print("PASS: no broken local markdown links")
PY

echo "[5/8] Validating agents/openai.yaml structure"
python3 - <<'PY'
from pathlib import Path

path = Path("skills/email-triage/agents/openai.yaml")
text = path.read_text(encoding="utf-8")

if not all(marker in text for marker in ("interface:", "dependencies:", "display_name:", "short_description:", "default_prompt:")):
    raise SystemExit("openai.yaml missing required interface/dependency markers")

if "$email-triage" not in text:
    raise SystemExit("openai.yaml default_prompt must reference $email-triage")

try:
    import yaml  # type: ignore
except Exception:
    print("WARN: PyYAML not installed; ran marker-based validation only")
    raise SystemExit(0)

obj = yaml.safe_load(text)
if not isinstance(obj, dict):
    raise SystemExit("openai.yaml did not parse to a mapping")
if "interface" not in obj or "dependencies" not in obj:
    raise SystemExit("openai.yaml missing top-level interface/dependencies keys")
for key in ("display_name", "short_description", "default_prompt"):
    if key not in obj["interface"]:
        raise SystemExit(f"openai.yaml missing interface.{key}")

print("PASS: openai.yaml parsed and required keys are present")
PY

echo "[6/8] Running structural release validator"
python3 scripts/validate_release.py

echo "[7/8] Running release smoke checks"
python3 scripts/check_fixture_balance.py \
  --fixture eval/fixtures/example-fixture.jsonl \
  --min-cases 10 \
  --min-tag-count 1 \
  --min-tier-count 1 \
  --required-tags "work,personal,school,medical,finance,marketing,thread-reply,ambiguity" \
  --enforce
python3 scripts/eval_triage.py \
  --fixture eval/fixtures/example-fixture.jsonl \
  --predictions eval/fixtures/example-predictions.jsonl \
  --min-cases 10 \
  --min-tier1-recall 1.0 \
  --min-tier3-precision 1.0 \
  --min-accuracy 1.0 \
  --max-unsafe-action-rate 0.0 \
  --enforce

echo "[8/8] Running release unit tests"
python3 -m unittest discover -s tests/release -p 'test_*.py' -v

echo "PASS: all checks succeeded"
