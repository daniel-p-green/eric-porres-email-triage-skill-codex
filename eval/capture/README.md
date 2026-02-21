# Capture Inputs

This directory stores raw message captures and human labels used to build release fixtures.

## Files

- `raw-messages.jsonl`: captured candidate rows (ID + message metadata)
- `labels.jsonl`: reviewer labels keyed by `id`
- `raw-messages.template.jsonl`: schema template for capture rows
- `labels.template.jsonl`: schema template for label rows

## Build Fixture

```bash
python3 scripts/build_release_fixture.py \
  --raw eval/capture/raw-messages.jsonl \
  --labels eval/capture/labels.jsonl \
  --output eval/fixtures/release-fixture.jsonl
```

## Data Handling

- Keep capture files local and sanitized.
- Use stable IDs to preserve deterministic mapping.
- Follow `eval/LABELING_RUBRIC.md` for consistent tier and safety labeling.
