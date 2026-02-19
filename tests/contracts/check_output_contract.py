#!/usr/bin/env python3
"""Contract validator for sample triage output."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SAMPLE = ROOT / "tests" / "contracts" / "sample_output.md"


def require(cond: bool, msg: str) -> None:
    if not cond:
        raise AssertionError(msg)


def main() -> int:
    text = SAMPLE.read_text()

    require(text.count("## Reply Needed (") == 1, "Missing or duplicate Reply Needed heading")
    require(text.count("## Review (") == 1, "Missing or duplicate Review heading")
    require(text.count("## Noise (") == 1, "Missing or duplicate Noise heading")

    reply_block = re.search(r"## Reply Needed \(\d+\)(.*?)## Review", text, re.S)
    require(reply_block is not None, "Cannot locate Reply Needed block")
    require(bool(re.search(r"\n1\. \*\*", reply_block.group(1))), "Reply Needed entries are not numbered")

    require(
        bool(re.search(r"\d+ marketing, \d+ social, \d+ automated, \d+ promotional", text)),
        "Noise category count line missing",
    )

    require("Reply 'archive' to confirm" in text, "Archive confirmation phrase missing")
    require("explicitly say 'send'" in text, "Send confirmation safety phrase missing")

    print("PASS: output contract checks succeeded")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
