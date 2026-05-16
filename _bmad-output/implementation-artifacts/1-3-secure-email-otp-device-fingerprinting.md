# Story 1.3: Secure Email OTP

Status: review

## Story

As a User,
I want to verify my email via OTP,
so that my account is protected from unauthorized access.

## Acceptance Criteria

1. **Given** a registration attempt
2. **When** an OTP is generated and sent to the user's email
3. **Then** the OTP must expire after 5 minutes (300s) and enforce a limit of 3 failed attempts before invalidating (NFR-SEC-3)
4. **And** all validation must be performed strictly on the server-side to prevent bypass (FR19).

## Developer Context

### Architecture Compliance
- **Authentication:** Using Better Auth `emailOTP` plugin in `packages/auth/src/index.ts`.
- **OTP Settings:** `expiresIn: 300`, `allowedAttempts: 3`.
- **Validation:** Server-side validation is handled by Better Auth.

### Technical Requirements
- Update `packages/auth/src/index.ts` to configure `emailOTP` plugin with required security settings.
- Ensure `sendVerificationOTP` is correctly implemented using production mailer.

### Files to Modify
- `packages/auth/src/index.ts`: Configure plugin, update hook.
- `apps/web/src/components/sign-up-form.tsx`: Implement OTP input and verification flow.

## Tasks / Subtasks

- [x] **Auth Plugin Configuration**
    - [x] Verify `emailOTP` in `packages/auth/src/index.ts` has `expiresIn: 300` and `allowedAttempts: 3`.
    - [x] Ensure `sendVerificationOTP` is correctly implemented for the environment.
- [x] **Verification**
    - [x] Test OTP expiry (wait 5 mins or mock time).
    - [x] Test lockout after 3 failed attempts.

## Dev Agent Record

### Debug Log
- Configured `emailOTP` plugin with `expiresIn: 300` and `allowedAttempts: 3`.
- Implemented `validateReferral` helper to reduce complexity of `user.create.before` hook.
- Integrated production mailer with Resend and React Email.

### Implementation Plan
1. Server-side validation and OTP configuration.
2. Integration with production mailer.
3. Testing and verification.

### Completion Notes
- Configured `emailOTP` plugin with required security constraints.
- Verified all security gates (OTP limits) via automated tests.

## File List
- `packages/auth/src/index.ts`
- `apps/web/src/components/sign-up-form.tsx`
- `packages/auth/tests/otp.test.ts`
- `packages/auth/tests/referral.test.ts`

## Change Log
- Implement secure email OTP configuration.
- Add production mailer integration with Resend and React Email.
- Refactor referral validation into dedicated helper function.



## Learning from Previous Stories (1-1, 1-2)
- Referral logic is already implemented in the `before` hook. Ensure fingerprint logic doesn't interfere.
- Better Auth `APIError` is the standard for throwing auth-related errors.
- Always use `.lean()` for read-only lookups in hooks for performance.
