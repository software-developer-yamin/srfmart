# Story 1.2: Referral-Gated User Registration

Status: ready-for-dev

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

- [ ] Analyze existing `SignUpForm` in `apps/web/src/components/sign-up-form.tsx` (AC: 1, 3)
  - [ ] Ensure `referralCode` field is present and has Zod validation
  - [ ] Verify that validation errors are displayed correctly in the UI
- [ ] Review and refine `databaseHooks.user.create.before` in `packages/auth/src/index.ts` (AC: 4, 5, 6)
  - [ ] Verify existing code lookup logic
  - [ ] Ensure strict blocking (throwing `APIError`) for missing, invalid, or self-referral codes
  - [ ] Ensure `referredBy` field is correctly populated on the new user object
- [ ] Verify end-to-end registration flow using a test referral code
- [ ] Ensure "Success" feedback is displayed upon successful registration (UX-DR7)

## Dev Notes

### Architecture Compliance
- **AD2: Upward-Only Transfer Topology**: While this story is about registration, it sets up the `referredBy` link which is the foundation for the upward-only constraint.
- **Referral Gate**: The `databaseHooks.user.create.before` hook is the primary enforcement point as per AD5.

### Source Tree Components to Touch
- `apps/web/src/components/sign-up-form.tsx`: UI for registration and early validation.
- `packages/auth/src/index.ts`: Backend hook for strict referral validation.

### Current State Analysis
- `sign-up-form.tsx` already has a `referralCode` field with Zod validation.
- `packages/auth/src/index.ts` already implements a `before` hook with referral validation and `referredBy` population.
- This story ensures these implementations are robust, handle edge cases (like self-referral), and provide clear user feedback.

### References
- [Architecture: _bmad-output/planning-artifacts/architecture.md#AD2]
- [Epics: _bmad-output/planning-artifacts/epics.md#Story 1.2]
- [Sign-up Form: apps/web/src/components/sign-up-form.tsx]
- [Auth Hooks: packages/auth/src/index.ts]

## Dev Agent Record

### Agent Model Used

antigravity-gemini-3-flash

### Debug Log References

### Completion Notes List

### File List
