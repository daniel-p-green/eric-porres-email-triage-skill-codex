#!/usr/bin/env python3
"""Minimal deterministic fixture checker for tiering parity."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FIX_DIR = ROOT / "tests" / "fixtures" / "inbox-scenarios"


DEADLINE_TERMS = ("by eod", "deadline", "rsvp", "urgent", "asap", "today", "tomorrow")
NOISE_TERMS = ("unsubscribe", "limited offer", "sale", "promo", "deal")
REVIEW_TERMS = ("delivery", "shipment", "track", "schedule update", "itinerary", "receipt")


def infer_tier(fx: dict) -> str:
    message = fx.get("message", {})
    context = fx.get("context", {})

    sender = str(message.get("from", "")).lower()
    subject = str(message.get("subject", "")).lower()
    snippet = str(message.get("snippet", "")).lower()

    family = {s.lower() for s in context.get("family_senders", [])}
    work_domains = [d.lower() for d in context.get("work_domains", [])]

    text = f"{subject} {snippet}"

    if any(member in sender for member in family):
        return "reply_needed"

    if any(term in text for term in DEADLINE_TERMS):
        return "reply_needed"

    if any(domain in sender for domain in work_domains) and any(term in text for term in DEADLINE_TERMS):
        return "reply_needed"

    if any(term in text for term in NOISE_TERMS):
        return "noise"

    if any(term in text for term in REVIEW_TERMS):
        return "review"

    # Content fallback default
    return "review"



def main() -> int:
    files = sorted(FIX_DIR.glob("*.json"))
    core = [p for p in files if p.name.startswith(("01-", "02-", "03-", "04-", "05-"))]

    failures: list[str] = []
    for path in core:
        data = json.loads(path.read_text())
        expected = data.get("expected_tier")
        got = infer_tier(data)
        if expected != got:
            failures.append(f"{path.name}: expected {expected}, got {got}")

    if failures:
        print("FAIL: classification mismatches")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print(f"PASS: {len(core)} core classification fixtures matched expected tiers")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
