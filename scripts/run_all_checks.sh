#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "[1/5] Running fixture classification checks"
python3 tests/classification/run_fixture_checks.py

echo "[2/5] Running output contract checks"
python3 tests/contracts/check_output_contract.py

echo "[3/5] Running required-file and trigger checks"
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

echo "[4/5] Running markdown link integrity checks"
python3 - <<'PY'
import re
from pathlib import Path

root = Path(".").resolve()
missing = []
for md in root.rglob("*.md"):
    text = md.read_text(encoding="utf-8")
    for match in re.finditer(r"\[[^\]]+\]\(([^)]+)\)", text):
        link = match.group(1).strip()
        if link.startswith(("http://", "https://", "mailto:", "#")):
            continue
        target = (md.parent / link).resolve()
        if not target.exists():
            missing.append((md.relative_to(root), link))

if missing:
    print("Broken local markdown links:")
    for file_path, link in missing:
        print(f"- {file_path} -> {link}")
    raise SystemExit(1)

print("PASS: no broken local markdown links")
PY

echo "[5/5] Validating agents/openai.yaml structure"
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

echo "PASS: all checks succeeded"
