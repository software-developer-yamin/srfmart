# Story 1.2: Referral-Gated User Registration

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a new User,
I want to register for Srfmart using a referral code and email,
so that I can join the community and start earning points securely.

## Acceptance Criteria

1. **Given** a registration form in `apps/web`
2. **When** I enter a referral code, email, and password
3. **Then** the UI performs early validation to warn me if the referral code format is invalid (UX-DR8)
4. **And** the `databaseHooks.user.create.before` in `packages/auth/src/index.ts` validates that the code exists in the database
5. **And** the system strictly blocks registration if the code is invalid or missing (FR1, FR2).
6. **And** self-referral must be strictly blocked at the hook level.

## Tasks / Subtasks

- [x] Analyze existing `SignUpForm` in `apps/web/src/components/sign-up-form.tsx` (AC: 1, 3)
  - [x] Ensure `referralCode` field is present and has Zod validation
  - [x] Verify that validation errors are displayed correctly in the UI
- [x] Review and refine `databaseHooks.user.create.before` in `packages/auth/src/index.ts` (AC: 4, 5, 6)
  - [x] Verify existing code lookup logic
  - [x] Ensure strict blocking (throwing `APIError`) for missing, invalid, or self-referral codes
  - [x] Ensure `referredBy` field is correctly populated on the new user object
- [x] Verify end-to-end registration flow using a test referral code
- [x] Ensure "Success" feedback is displayed upon successful registration (UX-DR7)

### Review Findings

- [x] [Review][Decision] OTP Persistence & State Loss — Referral code is currently lost if user reloads during OTP step. Should it be stored in `localStorage`? (Implemented)
- [x] [Review][Patch] Normalization & Persistence Gap [packages/auth/src/index.ts:101]
- [x] [Review][Patch] Runtime Fragility (Null Guard) [packages/auth/src/index.ts:59]
- [x] [Review][Patch] Test Assertion Mismatch [packages/auth/tests/referral.test.ts:79]
- [x] [Review][Defer] Registration Race Condition [packages/auth/src/index.ts:73] — deferred, pre-existing
