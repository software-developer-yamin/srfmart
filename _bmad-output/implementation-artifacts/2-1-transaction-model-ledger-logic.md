# Story 2.1: Transaction Model & Ledger Logic

Status: in-progress

## Story

As a Developer,
I want to implement the Transaction model and atomic ledger logic,
so that every point movement is recorded as an immutable, ACID-compliant entry.

## Acceptance Criteria

1. **Given** the `@srfmart/db` package
2. **When** the `Transaction` model is updated in `packages/db/src/models/transaction.model.ts`
3. **Then** it must support types: `MINT`, `TRANSFER`, `WITHDRAW_ESCROW`, `REFUND`, `DISTRIBUTE`, `BURN` [Source: Epics.md#Story 2.1]
4. **And** any point movement must use `session.withTransaction()` to ensure balance updates and ledger entries are atomic [Source: Architecture.md#AD1]
5. **And** the `availableBalance` and `escrowBalance` must be updated within the same transaction to maintain consistency [Source: PRD.md#NFR-SEC-1]
6. **And** transaction records must include an `idempotencyKey` to prevent duplicate processing [Source: Architecture.md#AD4]

## Tasks / Subtasks

- [x] **Database: Refine Transaction Model** (AC: 1, 2, 3)
  - [x] Update `packages/db/src/models/transaction.model.ts` to strictly match the enum types in AC 3.
  - [x] Ensure `senderId` and `receiverId` validation logic handles `MINT`, `BURN`, and `DISTRIBUTE` cases.
  - [x] Verify `idempotencyKey` is unique and indexed.
- [x] **Database: Atomic Ledger Helper** (AC: 4, 5)
  - [x] Create a reusable utility/service in `packages/db` (e.g., `packages/db/src/ledger.ts`) for executing atomic point movements.
  - [x] Implement `executeTransfer` logic with balance checks and transaction record creation.
- [x] **Verification** (AC: 4, 6)
  - [x] Write unit tests in `packages/db/src/models/transaction.model.test.ts` to verify atomic failures (e.g., balance doesn't change if transaction fails).
  - [x] Verify idempotency constraint at the database level.

## Dev Notes

### Architecture Compliance
- **Ledger Integrity (AD1):** Use `session.withTransaction()` from Mongoose. The `@srfmart/db` package already handles the connection; you must use the session correctly for all writes.
- **Double-Entry Logic:** Every increase in one balance must correspond to a transaction entry. For transfers, it's a debit from sender and credit to receiver.
- **Atomicity (NFR-SEC-1):** Never update a balance without a corresponding transaction record in the same atomic block.

### Project Structure Notes
- **Models:** `packages/db/src/models/transaction.model.ts` exists but needs refinement to strictly follow the latest enum definitions.
- **Service Layer:** New logic for executing these transactions should be co-located in `packages/db/src/` to be shared across `apps/server` and potentially `apps/web` (via server actions/API).

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 2]
- [Source: _bmad-output/planning-artifacts/architecture.md#AD1]
- [Source: _bmad-output/planning-artifacts/prd.md#NFR-SEC-1]

## Dev Agent Record

### Agent Model Used
antigravity-gemini-3-flash

### Completion Notes List
- Ultimate context engine analysis completed - comprehensive developer guide created.
- Transaction model reviewed and aligned with AD1 requirements.
- ACID compliance and atomicity guardrails established.
