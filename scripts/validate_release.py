#!/usr/bin/env python3
"""Deterministic release validation for the Codex email triage skill repo."""

from __future__ import annotations

import re
import sys
from pathlib import Path


PLACEHOLDER_PATTERNS = [
    ("yourdomain placeholder", re.compile(r"\byourdomain(?:\.com)?\b", re.IGNORECASE)),
    ("yourcompany placeholder", re.compile(r"\byourcompany(?:\.com)?\b", re.IGNORECASE)),
    ("[Your Name] placeholder", re.compile(r"\[Your Name\]")),
    ("TODO marker", re.compile(r"\bTODO\b")),
    ("FIXME marker", re.compile(r"\bFIXME\b")),
    ("TBD marker", re.compile(r"\bTBD\b")),
]

TARGET_GLOBS = [
    "README.md",
    ".agents/skills/email-triage/SKILL.md",
    ".agents/skills/email-triage/references/*.md",
    ".agents/skills/email-triage/agents/openai.yaml",
    "tests/**/*.md",
]

REQUIRED_PATHS = [
    "scripts/check_fixture_balance.py",
    "scripts/check_canary_evidence.py",
    "scripts/check_human_signoff.py",
    "scripts/generate_release_report.py",
    "eval/LABELING_RUBRIC.md",
    "docs/release/GO_NO_GO_CHECKLIST.md",
    "docs/release/CANARY_RUNBOOK.md",
]


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def parse_frontmatter(markdown_text: str) -> str | None:
    if not markdown_text.startswith("---\n"):
        return None
    end_index = markdown_text.find("\n---\n", 4)
    if end_index == -1:
        return None
    return markdown_text[4:end_index]


def check_required_paths(root: Path, failures: list[str]) -> None:
    for rel_path in REQUIRED_PATHS:
        path = root / rel_path
        if not path.exists():
            failures.append(f"Missing required release file: {rel_path}")


def check_skill_frontmatter(root: Path, failures: list[str]) -> None:
    skill_file = root / ".agents" / "skills" / "email-triage" / "SKILL.md"
    if not skill_file.exists():
        failures.append(f"Missing skill file: {skill_file}")
        return

    frontmatter = parse_frontmatter(read_text(skill_file))
    if frontmatter is None:
        failures.append(f"Missing YAML frontmatter in {skill_file}")
        return

    for field in ("name", "description"):
        if not re.search(rf"(?m)^{field}\s*:\s*(.+)$", frontmatter):
            failures.append(f"Missing or empty `{field}` in {skill_file}")

    if not re.search(r'"check email"', read_text(skill_file)):
        failures.append(f"Missing explicit trigger phrase `\"check email\"` in {skill_file}")


def check_openai_agent_manifest(root: Path, failures: list[str]) -> None:
    agent_path = root / ".agents" / "skills" / "email-triage" / "agents" / "openai.yaml"
    if not agent_path.exists():
        failures.append(f"Missing agent manifest: {agent_path}")
        return

    text = read_text(agent_path)
    required_markers = (
        "interface:",
        "dependencies:",
        "display_name:",
        "short_description:",
        "default_prompt:",
        "$email-triage",
    )
    for marker in required_markers:
        if marker not in text:
            failures.append(f"Missing `{marker}` in {agent_path}")


def check_placeholders(root: Path, failures: list[str]) -> None:
    files_to_scan: set[Path] = set()
    for glob_pattern in TARGET_GLOBS:
        files_to_scan.update(root.glob(glob_pattern))

    for file_path in sorted(files_to_scan):
        if not file_path.is_file():
            continue

        lines = read_text(file_path).splitlines()
        for index, line in enumerate(lines, start=1):
            for label, pattern in PLACEHOLDER_PATTERNS:
                if pattern.search(line):
                    relpath = file_path.relative_to(root)
                    failures.append(
                        f"Placeholder check failed ({label}) at {relpath}:{index}: {line.strip()}"
                    )


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    failures: list[str] = []

    check_required_paths(root, failures)
    check_skill_frontmatter(root, failures)
    check_openai_agent_manifest(root, failures)
    check_placeholders(root, failures)

    if failures:
        print("Release validation failed.")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Release validation passed.")
    print("- Required release files are present.")
    print("- Skill frontmatter and trigger markers are valid.")
    print("- openai.yaml includes required interface/dependency markers.")
    print("- No blocked template placeholders were found.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
