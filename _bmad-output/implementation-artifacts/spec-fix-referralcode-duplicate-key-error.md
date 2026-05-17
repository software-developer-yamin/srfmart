---
title: 'Fix referralCode duplicate key error'
type: 'one-shot'
created: '$(date -u +"%Y-%m-%dT%H:%M:%SZ")'
status: 'done'
route: 'one-shot'
---

# Fix referralCode duplicate key error

## Intent
**Problem**: When creating a user using `email-otp`, an `E11000` duplicate key MongoDB exception is thrown if the user uses a referral code during signup. `validateReferral` incorrectly returned the referrer's referral code into the new user payload as their own `referralCode`.
**Approach**: Adjust `validateReferral` in `packages/auth/src/index.ts` to only return the `referredBy` ID since `referralCode` mapping generation should distinctly map to unique values after user generation.

## Suggested Review Order

1. [packages/auth/src/index.ts](../../packages/auth/src/index.ts) - Check the `validateReferral` return tuple.
