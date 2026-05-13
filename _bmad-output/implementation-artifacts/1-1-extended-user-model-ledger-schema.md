# Story: 1.1 Extended User Model & Ledger Schema

## Status: review

## Summary
Implement the foundational data structures for the srfmart point-wallet system by extending the Better Auth user model/schema and creating the Point Ledger schema.

## User Story
As a Developer,
I want to extend the Better Auth user model and Mongoose schema,
So that the system can store roles, referral codes, and point balances required for the ledger.

## Acceptance Criteria
- [x] Mongoose `userSchema` in `packages/db/src/models/auth.model.ts` updated with:
    - `role`: enum ['user', 'moderator', 'admin'], default 'user'
    - `referredBy`: string (ref: 'User')
    - `referralCode`: string (unique, sparse)
    - `phoneNumber`: string (unique, sparse)
    - `availableBalance`: number, default 0
    - `escrowBalance`: number, default 0
    - `dailyPointLimit`: number, default null
- [x] `packages/auth/src/index.ts` updated with `user.additionalFields` matching the schema extension.
- [x] `Transaction` model created in `packages/db/src/models/transaction.model.ts` with required fields (type, senderId, receiverId, amount, status, idempotencyKey).
- [x] `packages/db/src/index.ts` exports the new `Transaction` model.

## Tasks/Subtasks
- [x] **Task 1: Extend User Schema**
    - [x] Create failing test to verify user schema extensions
    - [x] Update `packages/db/src/models/auth.model.ts` with new fields
    - [x] Verify tests pass
- [x] **Task 2: Update Better Auth Config**
    - [x] Update `packages/auth/src/index.ts` with `additionalFields`
    - [x] Verify integration
- [x] **Task 3: Create Transaction Model**
    - [x] Create failing test for Transaction model
    - [x] Create `packages/db/src/models/transaction.model.ts`
    - [x] Export from `packages/db/src/index.ts`
    - [x] Verify tests pass

## Developer Context
### Project Context Reference
- **Project Type:** Web App / Mobile Wallet Platform (Fintech)
- **Database:** MongoDB via Mongoose 8
- **Auth:** Better Auth v1.x with MongoDB adapter
- **Frameworks:** Next.js 16 (App Router), Express 5

### Guardrails & Architecture Compliance
- **AD1 (Double-Entry Ledger):** All point operations must be recorded in the `Transaction` ledger using atomic sessions.
- **AD5 (User Extension):** Better Auth fields must align perfectly between `auth.model.ts` (DB) and `auth/src/index.ts` (Auth logic).
- **Naming Conventions:** camelCase for fields (e.g., `availableBalance`), singular lowercase for collections (e.g., `transaction`).
- **File Patterns:** New files should be added to `packages/db/src/models/`.

### Technical Requirements
- Use `mongoose.Schema` for all definitions.
- Ensure `referralCode` and `phoneNumber` are `sparse: true` in Mongoose to avoid null-collision on unique indexes.
- Transaction types allowed: `MINT`, `TRANSFER`, `WITHDRAW_ESCROW`, `REFUND`, `DISTRIBUTE`, `BURN`.

### Library/Framework Requirements
- **Better Auth:** Use `user.additionalFields` in the server config.
- **Mongoose:** Use multi-document transactions where applicable for subsequent stories (this story sets up the schema).

### Testing Requirements
- Verify schema validation with unit tests (e.g., ensure `availableBalance` defaults to 0).
- Confirm `referralCode` uniqueness constraint.

## Dev Agent Record
### Implementation Plan
1.  **Red Phase (Task 1):** Create a test script to check for the new fields in the User model.
2.  **Green Phase (Task 1):** Modify `packages/db/src/models/auth.model.ts` to include the requested fields.
3.  **Refactor Phase (Task 1):** Ensure formatting and standards.
4.  **Repeat for Task 2 and Task 3.**

### Debug Log
- [2026-05-13] Initialized story implementation. Added Tasks/Subtasks section.
- [2026-05-13] Completed Task 1: Extended User schema in `auth.model.ts` and verified with unit test.
- [2026-05-13] Completed Task 2: Updated Better Auth config in `packages/auth/src/index.ts` with `additionalFields`.
- [2026-05-13] Completed Task 3: Created `Transaction` model and exported it. Verified with unit test.

### Completion Notes
- Foundational schemas for srfmart are now in place.
- User model extended with fintech-specific fields (roles, balances, referrals).
- Transaction model created to support atomic double-entry ledger.
- All changes verified with unit tests using `tsx`.

## File List
- packages/db/src/models/auth.model.ts (Modified)
- packages/auth/src/index.ts (Modified)
- packages/db/src/models/transaction.model.ts (New)
- packages/db/src/index.ts (Modified)

## Change Log
- [2026-05-13] Started implementation of Story 1.1.
- [2026-05-13] Implemented extended User schema and Transaction ledger schema.
