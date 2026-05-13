# Story 1.2: Referral-Gated User Registration

Status: done

## Story

As a new User,
I want to register for Srfmart using a referral code and email,
So that I can join the community and start earning points securely.

## Acceptance Criteria

1. **Given** a registration form in `apps/web`
2. **When** I enter a referral code, email, and password
3. **Then** the UI performs early validation to warn me if the referral code format is invalid (UX-DR8)
4. **And** the `databaseHooks.user.create.before` in `packages/auth` validates that the code exists in the database
5. **And** the system strictly blocks registration if the code is invalid or missing (FR1, FR2).

## Tasks / Subtasks

- [x] Update `@srfmart/auth` package to include referral validation (AC: 4, 5)
  - [x] Import `User` model from `@srfmart/db` in `packages/auth/src/index.ts`
  - [x] Add `databaseHooks.user.create.before` to `betterAuth` configuration
  - [x] Implement logic to find a user with `referralCode` matching the input
  - [x] Throw `APIError` with `UNPROCESSABLE_ENTITY` if code is missing or no matching user is found
  - [x] If valid, set `referredBy` to the ID of the user who owns the code
- [x] Update `@srfmart/web` Sign Up UI (AC: 1, 2, 3)
  - [x] Modify `SignUpForm` in `apps/web/src/components/sign-up-form.tsx` to include a `referralCode` field
  - [x] Update Zod validation schema in `useForm` to require `referralCode` (string, min 3 chars)
  - [x] Update `onSubmit` to pass `referralCode` to `authClient.signUp.email`
  - [x] Ensure `Input` for referral code uses proper labels and error display consistent with existing fields

## Dev Notes

### Architecture & Patterns
- **Referral Gate (AD5/AD2):** Referral-only registration is a core security constraint to prevent Sybil attacks.
- **Better Auth Hooks:** Use `databaseHooks.user.create.before` for server-side enforcement. It's the intended extension point for blocking sign-ups.
- **Error Handling:** Throw `APIError` from `better-auth/api` in the hook to ensure the client receives a readable error message.
- **UI Validation (UX-DR8):** Enforce Zod validation on the client-side for immediate feedback, but the server-side hook is the source of truth.

### File Implementation Guardrails
- **`packages/auth/src/index.ts` (UPDATE):**
  - Must preserve existing `additionalFields` (role, referralCode, balances, etc.).
  - Must correctly resolve the `User` model from `packages/db`. Note: `packages/db` index currently only exports `client`, so you may need to import from `./models/auth.model` or update the index.
- **`apps/web/src/components/sign-up-form.tsx` (UPDATE):**
  - Preserve the existing `@tanstack/react-form` pattern.
  - The `referralCode` should be passed as part of the data object to `signUp.email`.

### Testing Standards
- Verify that registration fails with a 422/400 error when an invalid referral code is used.
- Verify that registration succeeds and the `referredBy` field is correctly populated when a valid code is used.

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2]
- [Source: _bmad-output/planning-artifacts/architecture.md#AD5, #Referral Gate]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#1. The Gated Onboarding Flow]

## Dev Agent Record

### Agent Model Used
google/antigravity-gemini-3-flash

### Debug Log References

### Completion Notes List
- Implemented `databaseHooks.user.create.before` in `@srfmart/auth` to enforce referral code requirement.
- Updated `SignUpForm` in `@srfmart/web` with referral code field and Zod validation.
- Fixed a type mismatch in `Dashboard` component that was blocking the build.
- Added `inferAdditionalFields` plugin to `authClient` in the web app to support custom fields in TypeScript.
- Verified logic with unit tests in `packages/auth/tests/referral.test.ts`.
- Confirmed full project build success.

### Review Findings (Round 3)

- [x] [Review][Patch] Final robustness: null guards for email comparison [packages/auth/src/index.ts:39]
- [x] [Review][Patch] Email normalization (trim/lowercase) [apps/web/src/components/sign-up-form.tsx:49]
- [x] [Review][Patch] Referral code length cap (20 chars) [apps/web/src/components/sign-up-form.tsx:52]
- [x] [Review][Patch] Use .lean() and add logging to referral query [packages/auth/src/index.ts:28]
