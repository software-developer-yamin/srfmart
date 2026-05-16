# Story 1.3: Secure Email OTP & Device Fingerprinting

Status: ready-for-dev

## Story

As a User,
I want to verify my email via OTP and have my device fingerprinted,
so that my account is protected from Sybil attacks and automated bot farms.

## Acceptance Criteria

1. **Given** a registration attempt
2. **When** an OTP is generated and sent to the user's email
3. **Then** the OTP must expire after 5 minutes (300s) and enforce a limit of 3 failed attempts before invalidating (NFR-SEC-3)
4. **And** the system must capture a device fingerprint during authentication to flag potential Sybil attacks (FR20)
5. **And** all validation must be performed strictly on the server-side to prevent bypass (FR19).
6. **And** registration must be blocked if the device fingerprint is associated with too many existing accounts (Sybil prevention).

## Developer Context

### Architecture Compliance
- **Authentication:** Using Better Auth `emailOTP` plugin in `packages/auth/src/index.ts`.
- **OTP Settings:** `expiresIn: 300`, `allowedAttempts: 3`.
- **Device Fingerprinting:** We need to capture a unique device ID from the client and store it on the User model. 
- **Validation:** Server-side validation is handled by Better Auth, but Sybil checks must be added to the `user.create.before` hook.

### Technical Requirements
- Update `packages/auth/src/index.ts` to configure `emailOTP` plugin with required security settings.
- Implement device fingerprinting capture on the client-side (`apps/web`) using a library like `@fingerprintjs/fingerprintjs`.
- Add `deviceFingerprint` field to the User model extension in `packages/auth` and `packages/db`.
- Update the `databaseHooks.user.create.before` in `packages/auth/src/index.ts` to:
    - Check if the provided `deviceFingerprint` is already used by > 2 other accounts.
    - Block registration if limit is exceeded (Throw `APIError`).

### Files to Modify
- `packages/auth/src/index.ts`: Configure plugin, update hook, add `deviceFingerprint` to `additionalFields`.
- `packages/db/src/models/auth.model.ts`: Add `deviceFingerprint` to `userSchema`.
- `apps/web/src/components/sign-up-form.tsx`: Capture fingerprint and pass it to the sign-up request.
- `apps/web/src/lib/auth-client.ts`: Ensure client-side plugins are correctly configured.

## Tasks / Subtasks

- [ ] **Infrastructure & Schema**
    - [ ] Add `deviceFingerprint` string field to `userSchema` in `packages/db/src/models/auth.model.ts`.
    - [ ] Add `deviceFingerprint` to `additionalFields` in `packages/auth/src/index.ts`.
- [ ] **Auth Plugin Configuration**
    - [ ] Verify `emailOTP` in `packages/auth/src/index.ts` has `expiresIn: 300` and `allowedAttempts: 3`.
    - [ ] Ensure `sendVerificationOTP` is correctly implemented for the environment.
- [ ] **Sybil Prevention Hook**
    - [ ] Modify `databaseHooks.user.create.before` in `packages/auth/src/index.ts`.
    - [ ] Add logic to count users with the same `deviceFingerprint`.
    - [ ] Reject registration if count > 2 (allow max 3 accounts per device).
- [ ] **Client-Side Integration**
    - [ ] Install `@fingerprintjs/fingerprintjs` in `apps/web`.
    - [ ] Update `SignUpForm` in `apps/web/src/components/sign-up-form.tsx` to:
        - Generate fingerprint on mount.
        - Include `deviceFingerprint` in the `authClient.signUp.email()` call.
- [ ] **Verification**
    - [ ] Test OTP expiry (wait 5 mins or mock time).
    - [ ] Test lockout after 3 failed attempts.
    - [ ] Test Sybil blocking by attempting to register 4 accounts with the same fingerprint.

## Learning from Previous Stories (1-1, 1-2)
- Referral logic is already implemented in the `before` hook. Ensure fingerprint logic doesn't interfere.
- Better Auth `APIError` is the standard for throwing auth-related errors.
- Always use `.lean()` for read-only lookups in hooks for performance.
