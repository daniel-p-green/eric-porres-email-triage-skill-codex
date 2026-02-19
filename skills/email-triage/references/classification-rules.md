# Classification Rules and Parity Matrix

This document captures near 1:1 behavioral parity with Eric Porres' original triage logic.

## Core model

- Tier 1: Reply Needed
- Tier 2: Review
- Tier 3: Noise

## Snippet-first priority

Classify from sender, subject, snippet first.
Read full message/thread only when required for ambiguity or drafting.

## Urgency signals (auto-promote to Tier 1)

- Known family/emergency contacts
- Known work domain senders
- Deadline language: `by EOD`, `deadline`, `RSVP`, `urgent`, `asap`, `today`, `tomorrow`
- Financial alerts: bill due, invoice due, fraud, bank alerts
- School and medical providers
- Replies in threads initiated by the user

## Tier guidance

### Tier 1 (Reply Needed)

Direct asks/questions/action requests aimed at user.

### Tier 2 (Review)

Important updates usually not requiring immediate response:
- shipping and delivery updates
- calendar invites
- travel updates
- receipts and confirmations

### Tier 3 (Noise)

Bulk marketing/newsletters/social/promotional notifications.

## Alias-aware routing

Apply alias map when available.

Suggested defaults:
- family/kids aliases -> Tier 1
- financial aliases -> Tier 1
- health aliases -> Tier 1
- household/utilities aliases -> Tier 2
- travel aliases -> Tier 2
- shopping aliases -> Tier 3 (except delivery -> Tier 2, fraud -> Tier 1)
- subscriptions/media aliases -> Tier 3

Unknown alias -> content fallback.

## Required edge cases

- Empty inbox window
- Very high volume (50+)
- Ambiguous snippet requiring full read
- Unknown alias requiring content fallback

## Fixture parity map

Fixtures in `tests/fixtures/inbox-scenarios/` must satisfy:

1. Family sender ambiguous snippet -> Tier 1
2. Work deadline language -> Tier 1
3. Shipping update -> Tier 2
4. Marketing bulk -> Tier 3
5. Unknown alias fallback -> content-based tier
