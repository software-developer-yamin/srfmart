---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-05-12'
inputDocuments:
  - /home/yamin/Documents/smartechedge/srfmart/_bmad-output/planning-artifacts/prd.md
  - /home/yamin/Documents/smartechedge/srfmart/_bmad-output/planning-artifacts/product-brief-srfmart.md
  - /home/yamin/Documents/smartechedge/srfmart/_bmad-output/planning-artifacts/ux-design-specification.md
  - /home/yamin/Documents/smartechedge/srfmart/_bmad-output/planning-artifacts/research/market-srfmart-point-wallet-research-2026-05-12.md
  - /home/yamin/Documents/smartechedge/srfmart/_bmad-output/planning-artifacts/research/domain-srfmart-point-wallet-research-2026-05-12.md
  - /home/yamin/Documents/smartechedge/srfmart/_bmad-output/planning-artifacts/research/technical-srfmart-point-wallet-research-2026-05-12.md
  - /home/yamin/Documents/smartechedge/srfmart/docs/Srfmart_Point_system.md
workflowType: 'architecture'
project_name: 'srfmart'
user_name: 'Yamin'
date: '2026-05-12'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The system defines a hierarchical digital wallet (Admin -> Moderator -> User) with a primary focus on secure point distribution and managed withdrawals. Key features include upward-only transfers, global point distribution, and a withdrawal queue with an escrow mechanism. Architecturally, this requires a strictly enforced directed graph for transaction routing and a centralized authorization authority.

**Non-Functional Requirements:**
- **Security**: Must ensure 100% ledger integrity through atomic MongoDB transactions and idempotency keys to prevent double-spending or point duplication.
- **Performance**: Dashboards must load in < 2s, and point transfers must complete in < 1s.
- **Scalability**: Must handle 500 concurrent transfers and process global distributions for 10,000 users in under 30 seconds without disrupting system availability.

**Scale & Complexity:**
The project is categorized as **High Complexity** due to its fintech nature, requiring high-stakes ledger accuracy, strict regulatory compliance (Bangladesh Bank), and advanced fraud detection (device fingerprinting).

- Primary domain: Fintech / Full-stack Web
- Complexity level: High
- Estimated architectural components: ~12 (Auth, Ledger, Withdrawal Engine, Distribution Engine, Risk/Fraud Dashboard, RBAC, etc.)

### Technical Constraints & Dependencies

- **Platform**: Mobile-first Web App (Next.js).
- **Database**: MongoDB with atomic transactions/ACID compliance.
- **Infrastructure**: Compliance with Bangladesh data residency and financial regulations.
- **Integrations**: Manual MFS processing (Phase 1) transitioning to automated bKash/Nagad API integrations (Phase 2).

### Cross-Cutting Concerns Identified

- **Ledger Integrity**: Ensuring every point movement is recorded in an immutable, atomic ledger.
- **Fraud Prevention**: Neutralizing Sybil attacks and point laundering via referral-only gates and upward-only transfer constraints.
- **Concurrency Management**: Handling high volumes of simultaneous transactions and batch updates without system degradation.
- **RBAC**: Enforcing strict permission boundaries between User, Moderator, and Admin roles.

## Architectural Decisions (MVP Focus)

### AD1: Event-Sourced Double-Entry Ledger Strategy
**Context**: We need to prevent double-spending and ensure 100% accurate point balances, even under heavy concurrent load.
**Decision**: Implement a double-entry ledger system using MongoDB multi-document transactions. Balances will not just be a mutable number on the User document; they will be calculated (or cached and strictly verified) against an immutable append-only `Transaction` collection.
**Consequences**: This guarantees ACID compliance but requires careful transaction handling in the Express server (`apps/server`) and Mongoose (`@srfmart/db`).

### AD2: Upward-Only Transfer Topology
**Context**: Sybil attacks and point laundering through peer-to-peer (P2P) transfers are the biggest threats.
**Decision**: The transfer API will strictly validate the recipient. A standard `User` can only transfer to their referring `Moderator` or the `Admin`. A `Moderator` can only transfer to the `Admin`. P2P transfers between standard users will be hard-blocked at the API route and database level.
**Consequences**: Eliminates point laundering completely. UI must securely hide recipient selection and auto-lock to the upline.

### AD3: Escrow Pattern for Withdrawals
**Context**: When users request real-money withdrawals, points must be removed from circulation but not permanently deleted until the manual MFS (bKash/Nagad) payout is confirmed.
**Decision**: Implement an "Escrow" state. A withdrawal request deducts available points and moves them to an `escrowBalance` on the user's wallet. The Admin/Moderator dashboard will manage a queue of these requests. Once paid manually, the escrow points are finalized (burned/transferred to admin). If rejected, they are refunded to the available balance.

### AD4: Idempotency Keys for Write Operations
**Context**: Network instability can cause clients to retry requests, leading to duplicate point transfers.
**Decision**: Every mutating API request (Transfer, Withdraw, Global Distribution) must include a client-generated UUID `Idempotency-Key` in the headers. The server will track these keys in a fast store (or MongoDB with TTL) to reject duplicates within a 24-hour window.

### AD5: Monorepo Alignment
**Context**: The project is a Turborepo monorepo with predefined packages. We must not modify this structure unnecessarily.
**Decision**: 
- `apps/web`: Next.js frontend, consuming APIs. UI components built with Shadcn (`@srfmart/ui`).
- `apps/server`: Express backend, exposing secure REST/RPC endpoints.
- `@srfmart/db`: Mongoose schemas and connection logic.
- `@srfmart/auth`: Better Auth configuration.

## Core System Patterns

### Database Schema Design (MongoDB/Mongoose)
The `@srfmart/db` package will require three primary models:
1. **User Model**: Extended from Better Auth, including `role` (Admin, Moderator, User), `referredBy` (ObjectId linking to upline), `availableBalance`, and `escrowBalance`.
2. **Transaction Model**: The immutable ledger. Fields: `transactionId`, `senderId`, `receiverId`, `amount`, `type` (MINT, TRANSFER, WITHDRAW_ESCROW, REFUND, DISTRIBUTE), `status`, and `timestamp`.
3. **WithdrawalRequest Model**: Tracks the state of fiat payouts. Fields: `userId`, `amountPoints`, `amountBDT`, `mfsProvider` (bKash/Nagad), `mfsNumber`, `status` (PENDING, APPROVED, REJECTED), and `processedBy`.

### API & Security Patterns
- **Authentication**: `identifyUser` middleware (Better Auth) is already injected into the Express server. All protected routes must verify the `req.log` or session to ensure the user is authenticated and authorized for the requested role.
- **Request Validation**: Use Zod (available in workspace) to strictly validate all incoming payloads in `apps/server` before any database interaction.
- **Referral Gate**: Registration endpoint must require a valid referral code. If missing or invalid, the request is immediately rejected.

## Codebase Implementation Structure

To build the MVP without disrupting the existing architecture, development will be mapped as follows:

- **`packages/db/src/models/`**: 
  - Define `User.ts` (with hierarchy and balances).
  - Define `Transaction.ts` (the ledger).
  - Define `Withdrawal.ts` (the queue).
- **`packages/auth/src/index.ts`**:
  - Configure Custom Fields in Better Auth to handle `role` and `referredBy` upon registration.
- **`apps/server/src/`**:
  - `routes/transactions.ts`: Endpoints for upward transfers and global distribution (with MongoDB transactions).
  - `routes/withdrawals.ts`: Endpoints for requesting and managing withdrawals.
  - `middlewares/idempotency.ts`: Middleware to enforce duplicate request prevention.
- **`apps/web/src/`**:
  - `app/(dashboard)`: Protected routes for balances, ledgers, and transfers.
  - `components/features/`: Custom UI for the Locked Recipient Card and Escrow Status Indicators.

## Validation & Readiness

This architecture strictly adheres to the MVP philosophy:
✅ **Security First**: Double-entry ledger and idempotency keys ensure trust.
✅ **Fraud Prevention**: Upward-only topology and referral gates are baked into the data model.
✅ **Codebase Alignment**: The plan utilizes the existing Turborepo structure, Express backend, and Next.js frontend perfectly.

**Next Logical Step**: The architecture is solid and aligned with the codebase. We can now transition to the **Implementation Phase** (Story creation or direct coding).
