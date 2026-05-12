---
stepsCompleted: [1, 2, 3]
inputDocuments: ['docs/Srfmart_Point_system.md', 'packages/db/src/index.ts']
workflowType: 'research'
lastStep: 3
research_type: 'technical'
research_topic: 'Srfmart Point-based Digital Wallet System'
research_goals: 'Align the system architecture with the existing MongoDB/Mongoose stack, focusing on secure point distribution, real-time updates, and administrative controls within the established Turborepo structure.'
user_name: 'Yamin'
date: '2026-05-12'
web_research_enabled: true
source_verification: true
---

# Research Report: technical

**Date:** 2026-05-12
**Author:** Yamin
**Research Type:** technical

---

## Technical Research Scope Confirmation

**Research Topic:** Srfmart Point-based Digital Wallet System
**Research Goals:** Align the system architecture with the existing MongoDB/Mongoose stack, focusing on secure point distribution, real-time updates, and administrative controls within the established Turborepo structure.

**Technical Research Scope:**

- **Core Stack Analysis**: Deep-dive into MongoDB/Mongoose for ledger integrity (transactions, sessions).
- **Architecture Analysis**: Turborepo monorepo patterns and Next.js server/client boundaries.
- **Implementation Approaches**: secure point distribution algorithms and referral graph management.
- **Integration Patterns**: Manual withdrawal processing queues and MFS integration prep.
- **Security Considerations**: Preventing point inflation, Sybil attacks, and unauthorized transfers.

**Research Methodology:**

- **Codebase-First**: Primary reference is the existing `packages/db` and `apps/server` structure.
- **Web Research**: Complementary data on secure MongoDB ledger patterns and Bangladeshi MFS standards.
- **Source Verification**: Rigorous verification of technical claims.

**Scope Confirmed:** 2026-05-12

---

## Technical Overview & Stack Analysis (Aligned with Codebase)

### Database: MongoDB & Mongoose
The project is explicitly using **MongoDB** with the **Mongoose** ODM. 
- **Current State**: `packages/db/src/index.ts` connects to `DATABASE_URL` and exports a `client`.
- **Ledger Strategy**: For a point system, we must use **MongoDB Transactions** (multi-document ACID transactions) to ensure atomic balance updates.
- **Schema Patterns**: Use a **Double-Entry Ledger** pattern where every point movement is a record in a `Transactions` collection, and balances are derived or cached in the `User` collection.

### Project Structure: Turborepo Monorepo
The project uses a modern monorepo structure:
- `apps/server`: Likely the API backend.
- `apps/web`: The Next.js frontend.
- `packages/db`: Shared database models and connection logic.
- `packages/env`: Type-safe environment variable management.

---

## Implementation Approaches & Ledger Integrity

### Double-Entry Ledger Implementation
To ensure absolute accuracy and auditability, the system will implement a **Double-Entry Ledger** pattern in MongoDB:
1. **Immutable Transactions**: Every point movement (Mint, Transfer, Distribution, Withdrawal) is recorded as a single document in a `Transactions` collection.
2. **Atomic Entries**: Each transaction consists of multiple `Entries` (Debits and Credits). For a transfer:
   - Debit the Sender's account.
   - Credit the Receiver's account.
3. **Transaction Session**: Both entries must be wrapped in a `ClientSession.withTransaction()` block to ensure ACID compliance.

### Concurrency & Idempotency
1. **Idempotency Keys**: Every API request that modifies a balance must include a client-generated `idempotencyKey`. A unique index on this key in the `Transactions` collection will prevent accidental double-processing on retries.
2. **Optimistic Locking**: Use a `__v` (version) field on the `Accounts` document to ensure that balance updates only happen if the document hasn't been modified since it was read.

---

## Integration Patterns & Withdrawal Management

### Manual Withdrawal Processing Queue
For the MVP, withdrawals are processed manually via bKash, Nagad, or Rocket. The technical workflow is designed to bridge the gap between virtual points and real-world currency:

1. **Escrow Mechanism**:
   - When a user requests a withdrawal, the system creates a `Transaction` of type `WITHDRAWAL_REQUEST`.
   - The points are debited from the `UserWallet` and credited to a `SystemEscrow` account.
   - Status is set to `PENDING`.
2. **Admin/Moderator Dashboard**:
   - A secure queue displays all `PENDING` withdrawal requests.
   - Admin verifies the user and the legitimacy of the points.
3. **Approval & Payout**:
   - Admin marks the request as `APPROVED`.
   - Admin manually executes the MFS transfer (bKash/Nagad).
   - Admin inputs the `MFS_Transaction_ID` into Srfmart.
   - System moves points from `SystemEscrow` to a `SystemPayout` (burn) account and marks status as `COMPLETED`.
4. **Rejection**:
   - If Admin marks as `REJECTED`, the system executes a reversal transaction: Debit `SystemEscrow` and Credit `UserWallet`.

### Maker-Checker Workflow (Security)
To prevent internal fraud, the system can support a **Maker-Checker** pattern:
- **Moderator (Maker)**: Reviews and "Pre-approves" a withdrawal request.
- **Admin (Checker)**: Performs the final approval and logs the MFS payout.

### Data Validation for Bangladeshi MFS
- **Mobile Number Validation**: Regex-based validation for 11-digit numbers with correct prefixes (017, 018, 019, 016, 015, 013, 014).
- **MFS Type Enforcement**: Enum-based selection (bKash, Nagad, Rocket) to ensure correct routing in the admin dashboard.

---
