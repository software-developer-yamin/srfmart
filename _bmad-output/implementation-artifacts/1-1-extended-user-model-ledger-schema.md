# Story 1.1: Extended User Model & Ledger Schema

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Developer,
I want to extend the Better Auth user model and Mongoose schema,
so that the system can store roles, referral codes, and point balances required for the ledger.

## Acceptance Criteria

1. **Given** the existing `@srfmart/db` and `@srfmart/auth` packages
2. **When** the `userSchema` in `packages/db/src/models/auth.model.ts` is updated
3. **Then** it must include the following fields: `role` (enum: 'user', 'moderator', 'admin'), `referredBy` (String, ref: 'User'), `referralCode` (String, unique, sparse), `phoneNumber` (String, unique, sparse), `availableBalance` (Number, default: 0), `escrowBalance` (Number, default: 0), and `dailyPointLimit` (Number, default: null)
4. **And** the `packages/auth/src/index.ts` must be updated with matching `additionalFields` to ensure the auth client can access these fields.
5. **And** the `@srfmart/db` package index (`packages/db/src/index.ts`) must export the models to ensure workspace-wide accessibility.

## Tasks / Subtasks

- [x] Verify existing schema and auth configuration (AC: 1)
- [x] Update `userSchema` in `packages/db/src/models/auth.model.ts` (AC: 2, 3)
  - [x] Add `role` enum with default 'user'
  - [x] Add `referredBy` as String with ref to User
  - [x] Add `referralCode` (unique, sparse)
  - [x] Add `phoneNumber` (unique, sparse)
  - [x] Add `availableBalance` and `escrowBalance` with default 0
  - [x] Add `dailyPointLimit` with default null
- [x] Update `betterAuth` configuration in `packages/auth/src/index.ts` (AC: 4)
  - [x] Add `user.additionalFields` matching the new DB fields
  - [x] Ensure `role` is not user-inputtable (`input: false`)
- [x] Update `@srfmart/db` index in `packages/db/src/index.ts` (AC: 5)
  - [x] Export `User`, `Session`, `Account`, and `Verification` from the package root
- [x] Run basic connectivity and type checks to ensure no regressions in auth flow

## Dev Notes

### Architecture Compliance
- **AD5: Better Auth User Extension**: This story directly implements AD5. The user model extension is the backbone for RBAC (Epic 1) and the Ledger (Epic 2).
- **Atomic Transactions**: While this story focuses on schema, all future point operations must use `session.withTransaction()` as per AD1.
- **Field Naming**: Follow camelCase for all new fields as per the project's naming patterns.

### Source Tree Components to Touch
- `packages/db/src/models/auth.model.ts`: Primary file for Mongoose schema updates.
- `packages/auth/src/index.ts`: Primary file for Better Auth configuration.
- `packages/db/src/index.ts`: Update exports for package consumption.

### Current State Analysis
- `auth.model.ts` already contains some of these fields (role, referredBy, referralCode, etc.) based on initial scaffolding, but they need to be verified against the exact requirements in the AC.
- `packages/auth/src/index.ts` already has `additionalFields` defined. This story ensures they are perfectly aligned and correctly typed.

### References
- [Architecture: _bmad-output/planning-artifacts/architecture.md#AD5]
- [Epics: _bmad-output/planning-artifacts/epics.md#Story 1.1]
- [DB Model: packages/db/src/models/auth.model.ts]
- [Auth Config: packages/auth/src/index.ts]

## Dev Agent Record

### Agent Model Used

antigravity-gemini-3-flash

### Debug Log References

### Completion Notes List

- Verified existing schema and auth configuration.
- Confirmed `userSchema` in `packages/db/src/models/auth.model.ts` includes `role`, `referredBy`, `referralCode`, `phoneNumber`, `availableBalance`, `escrowBalance`, and `dailyPointLimit`.
- Confirmed `packages/auth/src/index.ts` has matching `additionalFields` with `role.input: false`.
- Updated `packages/db/src/index.ts` to export all auth models.
- Created and passed `packages/db/src/models/auth.model.test.ts` to verify model correctness.

### File List

- `packages/db/src/models/auth.model.ts`
- `packages/auth/src/index.ts`
- `packages/db/src/index.ts`
- `packages/db/src/models/auth.model.test.ts` (new)
