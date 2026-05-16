# Story 2.2: Idempotency Middleware for Point Operations

Status: ready-for-dev

## Story

As a Developer,
I want to implement idempotency middleware for mutating API endpoints,
so that duplicate requests from network retries do not cause double-spending.

## Acceptance Criteria

1. **Given** a request to `/api/transactions/*` or `/api/withdrawals/*`
2. **When** an `Idempotency-Key` header is provided
3. **Then** the `idempotency.ts` middleware verifies the key in MongoDB [Source: Architecture.md#AD4]
4. **And** it rejects duplicates within a 24-hour window by returning the cached original response [Source: Epics.md#NFR-SEC-2]

## Tasks / Subtasks

- [ ] **Middleware: Create Idempotency Layer** (AC: 1, 2, 3)
  - [ ] Implement `apps/server/src/middleware/idempotency.ts`.
  - [ ] Use a dedicated `Idempotency` collection or the existing `Transaction` collection to track keys.
- [ ] **Server: Global Integration** (AC: 1, 4)
  - [ ] Register the middleware in `apps/server/src/index.ts` for all mutating financial routes.
  - [ ] Ensure the middleware returns the same 200/201 status and body for duplicate keys.
- [ ] **Verification** (AC: 4)
  - [ ] Write integration tests simulating network retries with identical keys.

## Dev Notes

### Architecture Compliance
- **AD4 (Idempotency Middleware):** The middleware should be generic but focused on point-altering operations.
- **NFR-SEC-2 (Duplicate Rejection):** Store the relationship between the key and the response.

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2]
- [Source: _bmad-output/planning-artifacts/architecture.md#AD4]
- [Source: _bmad-output/planning-artifacts/prd.md#NFR-SEC-2]
