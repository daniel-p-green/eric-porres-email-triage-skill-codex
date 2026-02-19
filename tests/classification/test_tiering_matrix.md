# Classification Test Matrix

This test pack verifies near 1:1 tiering behavior parity for critical inbox scenarios.

## Automated fixture checks

Run:

```bash
python3 tests/classification/run_fixture_checks.py
```

Expected:
- all fixture classification checks pass
- no mismatch between expected and inferred tier for core tiering fixtures

## Required scenario coverage

1. `01-family-ambiguous-snippet.json` -> `reply_needed`
2. `02-work-deadline-language.json` -> `reply_needed`
3. `03-shipping-update.json` -> `review`
4. `04-marketing-bulk.json` -> `noise`
5. `05-unknown-alias-content-fallback.json` -> `review`

## Failure-mode fixtures (assert presence and semantics)

- `06-empty-inbox-state.json`
- `07-high-volume-state.json`
- `08-missing-tools-state.json`
- `09-ambiguous-thread-requires-read.json`

These are validated as contract fixtures and used by smoke testing.
