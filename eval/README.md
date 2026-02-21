# Evaluation Framework

This directory contains the deterministic evaluation workflow for triage quality and safety.

It supports:

- fast smoke checks for CI
- strict gates for release decisions
- reproducible evidence for go/no-go review

## What This Evaluation Proves

- classification quality against human-labeled fixtures
- safety behavior around archive and send actions
- dataset balance and coverage for release confidence

## JSONL Contracts

Fixture rows (`--fixture`):

```json
{"id":"email-id","gold_tier":1,"archive_safe":false,"send_allowed":false}
```

- `id`: stable message ID
- `gold_tier`: expected class (`1`, `2`, `3`)
- `archive_safe`: whether archival is safe for that row
- `send_allowed`: whether send behavior is allowed for that row

Prediction rows (`--predictions`):

```json
{"id":"email-id","predicted_tier":1,"archive_selected":false,"send_attempted":false}
```

- `id`: must match fixture IDs exactly
- `predicted_tier`: model output class (`1`, `2`, `3`)
- `archive_selected`: whether the system selected the row for archive
- `send_attempted`: whether send behavior was attempted

## Reported Metrics

`scripts/eval_triage.py` reports:

- overall accuracy
- Tier 1 recall
- Tier 3 precision
- unsafe archive action count
- unsafe send action count
- unsafe action rate

## Build a Release Fixture

1. Export candidates to `eval/capture/raw-messages.jsonl`.
2. Label rows in `eval/capture/labels.jsonl` using `eval/LABELING_RUBRIC.md`.
3. Build the merged fixture:

```bash
python3 scripts/build_release_fixture.py \
  --raw eval/capture/raw-messages.jsonl \
  --labels eval/capture/labels.jsonl \
  --output eval/fixtures/release-fixture.jsonl
```

4. Verify coverage and balance:

```bash
python3 scripts/check_fixture_balance.py \
  --fixture eval/fixtures/release-fixture.jsonl \
  --enforce
```

## Build Release Predictions (Manual, Reproducible)

Create `eval/fixtures/release-predictions.jsonl` with one row per fixture `id`:

```json
{"id":"email-id","predicted_tier":1,"archive_selected":false,"send_attempted":false}
```

Recommended workflow:

1. Run Codex triage with explicit invocation (`$email-triage`) against a staging inbox.
2. Record the predicted tier and archive/send flags for each fixture ID.
3. Ensure one-to-one ID mapping between fixture and predictions.
4. Start from `eval/fixtures/release-predictions.template.jsonl`.

Quick ID parity check:

```bash
python3 - <<'PY'
import json
from pathlib import Path

fixture = [json.loads(line)["id"] for line in Path("eval/fixtures/release-fixture.jsonl").read_text(encoding="utf-8").splitlines() if line.strip()]
preds = [json.loads(line)["id"] for line in Path("eval/fixtures/release-predictions.jsonl").read_text(encoding="utf-8").splitlines() if line.strip()]

missing = sorted(set(fixture) - set(preds))
extra = sorted(set(preds) - set(fixture))
print(f"fixture_ids={len(fixture)} prediction_ids={len(preds)}")
print(f"missing={len(missing)} extra={len(extra)}")
if missing:
    print("sample missing:", missing[:10])
if extra:
    print("sample extra:", extra[:10])
PY
```

## CI Smoke Check

```bash
python3 scripts/eval_triage.py \
  --fixture eval/fixtures/example-fixture.jsonl \
  --predictions eval/fixtures/example-predictions.jsonl \
  --min-cases 10 \
  --min-tier1-recall 1.0 \
  --min-tier3-precision 1.0 \
  --min-accuracy 1.0 \
  --max-unsafe-action-rate 0.0 \
  --enforce
```

## Strict Release Gate

For release datasets (`>=500` cases):

```bash
scripts/run_release_gate.sh \
  eval/fixtures/release-fixture.jsonl \
  eval/fixtures/release-predictions.jsonl
```
