# Output Contract

The triage output must follow this markdown structure exactly.

```markdown
# Inbox Triage - <YYYY-MM-DD>
[<N> emails scanned from last <window>]

## Reply Needed (N)

1. **<Sender>** - <Subject>
   <One-line summary of action needed>
   -> Suggested: <Reply | Schedule | Forward>

2. ...

## Review (N)

- **<Sender>** - <Subject> - <One-line summary>
- ...

## Noise (N)

<N> marketing, <N> social, <N> automated, <N> promotional
-> Want me to archive these?
```

## Contract checks

1. Exactly three tier sections: Reply Needed, Review, Noise.
2. Reply Needed entries are numbered.
3. Noise section includes category counts.
4. Archive prompt explicitly asks for confirmation.
5. No wording implies automatic send/archive.

## Empty inbox variant

```markdown
# Inbox Triage - <YYYY-MM-DD>
[0 emails scanned from last <window>]

Nothing new in the selected window. Inbox is clean.
```
