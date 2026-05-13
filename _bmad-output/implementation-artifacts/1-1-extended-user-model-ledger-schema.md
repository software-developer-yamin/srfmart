# Story: 1.1 Extended User Model & Ledger Schema

## Status: ready-for-dev

## Summary
Implement the foundational data structures for the srfmart point-wallet system by extending the Better Auth user model/schema and creating the Point Ledger schema.

## User Story
As a Developer,
I want to extend the Better Auth user model and Mongoose schema,
So that the system can store roles, referral codes, and point balances required for the ledger.

## Acceptance Criteria
- [ ] Mongoose `userSchema` in `packages/db/src/models/auth.model.ts` updated with:
    - `role`: enum ['user', 'moderator', 'admin'], default 'user'
    - `referredBy`: string (ref: 'User')
    - `referralCode`: string (unique, sparse)
    - `phoneNumber`: string (unique, sparse)
    - `availableBalance`: number, default 0
    - `escrowBalance`: number, default 0
    - `dailyPointLimit`: number, default null
- [ ] `packages/auth/src/index.ts` updated with `user.additionalFields` matching the schema extension.
- [ ] `Transaction` model created in `packages/db/src/models/transaction.model.ts` with required fields (type, senderId, receiverId, amount, status, idempotencyKey).
- [ ] `packages/db/src/index.ts` exports the new `Transaction` model.

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

## Dev Notes (Context Continuity)
- This is the first story in Epic 1. No previous story learnings available.
- Existing `packages/db/src/models/auth.model.ts` currently contains User, Session, Account, and Verification schemas.

## Project Context Facts
- **Knowledge Graph:** `graphify-out/GRAPH_REPORT.md` available for architecture mapping.
- **Standards:** `pnpm dlx ultracite fix` for formatting.

---
Ultimate context engine analysis completed - comprehensive developer guide created
