# Output Contract Test

This test verifies output shape and safety wording.

## Automated check

Run:

```bash
python3 tests/contracts/check_output_contract.py
```

Expected:
- output includes exactly three required headings
- Tier 1 block is numbered
- Noise line has category counts
- archive line explicitly asks for confirmation
- send safety line explicitly requires confirmation wording

## Test artifacts

- Sample output under test: `tests/contracts/sample_output.md`
- Contract definition: `.agents/skills/email-triage/references/output-contract.md`
