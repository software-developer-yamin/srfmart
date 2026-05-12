---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-05-12'
revisedAt: '2026-05-12'
revisionReason: 'Codebase-grounded rewrite — original was conceptual, this revision maps every decision to actual files'
inputDocuments:
  - /home/yamin/Documents/smartechedge/srfmart/_bmad-output/planning-artifacts/prd.md
  - /home/yamin/Documents/smartechedge/srfmart/_bmad-output/planning-artifacts/product-brief-srfmart.md
  - /home/yamin/Documents/smartechedge/srfmart/_bmad-output/planning-artifacts/ux-design-specification.md
  - /home/yamin/Documents/smartechedge/srfmart/_bmad-output/planning-artifacts/research/market-srfmart-point-wallet-research-2026-05-12.md
  - /home/yamin/Documents/smartechedge/srfmart/_bmad-output/planning-artifacts/research/domain-srfmart-point-wallet-research-2026-05-12.md
  - /home/yamin/Documents/smartechedge/srfmart/_bmad-output/planning-artifacts/research/technical-srfmart-point-wallet-research-2026-05-12.md
  - /home/yamin/Documents/smartechedge/srfmart/docs/Srfmart_Point_system.md
project_name: 'srfmart'
user_name: 'Yamin'
date: '2026-05-12'
---

# Architecture Decision Document (Codebase-Grounded Revision)

_Revised to map every architectural decision to actual codebase files, exports, and patterns._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The system defines a hierarchical digital wallet (Admin -> Moderator -> User) with a primary focus on secure point distribution and managed withdrawals. Key features include upward-only transfers, global point distribution, and a withdrawal queue with an escrow mechanism.

**Non-Functional Requirements:**
- **Security**: 100% ledger integrity through atomic MongoDB transactions and idempotency keys.
- **Performance**: Dashboards < 2s load, point transfers < 1s completion.
- **Scalability**: 500 concurrent transfers, 10,000-user global distribution in < 30s.

**Scale & Complexity:**
- Primary domain: Fintech / Full-stack Web
- Complexity level: High
- Estimated new components: ~8 (Wallet Model, Transaction Model, Withdrawal Model, 3 route modules, idempotency middleware, auth plugin config)

### Technical Constraints & Dependencies

- **Platform**: Mobile-first Web App (Next.js 16, Express 5, Turborepo).
- **Database**: MongoDB via Mongoose 8 with Docker Compose (`pnpm db:start`).
- **Auth**: Better Auth with MongoDB adapter, email/password enabled.
- **Styling**: Tailwind CSS 4 + Shadcn UI (`@srfmart/ui`).
- **Forms**: TanStack React Form + Zod validation.
- **Logging**: evlog (Express middleware + Next.js middleware).
- **Integrations**: Manual MFS processing (Phase 1).

### Existing Codebase Inventory

| Package | Path | Current State |
|---|---|---|
| `@srfmart/db` | `packages/db/` | Mongoose connection + `auth.model.ts` (User, Session, Account, Verification) |
| `@srfmart/auth` | `packages/auth/` | Better Auth with `mongodbAdapter(client)`, email/password enabled |
| `@srfmart/env` | `packages/env/` | Environment variable management (server + web exports) |
| `@srfmart/ui` | `packages/ui/` | Shadcn components (Button, Card, Input, Label, DropdownMenu, Skeleton, Sonner) |
| `@srfmart/config` | `packages/config/` | Shared TypeScript config |
| `server` | `apps/server/` | Express 5 with evlog, identifyUser middleware, auth route handler, CORS |
| `web` | `apps/web/` | Next.js 16 with login page, dashboard shell, header, user-menu, providers |

### Cross-Cutting Concerns

- **Ledger Integrity**: Every point movement must be an immutable, atomic ledger entry.
- **Fraud Prevention**: Referral-only registration, upward-only transfers.
- **RBAC**: User/Moderator/Admin role enforcement at API layer.
- **Concurrency**: MongoDB transactions with optimistic locking on balances.

---

## Architectural Decisions (MVP Focus)

### AD1: Double-Entry Ledger via Mongoose Transactions

**Context**: Prevent double-spending and ensure accurate point balances.
**Decision**: Create a `Transaction` model in `packages/db/src/models/transaction.model.ts` as an append-only ledger. Every point operation (mint, transfer, escrow, refund, distribute) creates a transaction record within a `mongoose.startSession()` + `session.withTransaction()` block. User balances (`availableBalance`, `escrowBalance`) are updated atomically in the same transaction.
**Implementation**: The `@srfmart/db` package already exports a `client` from `mongoose.connection.getClient().db("myDB")`. Mongoose sessions are obtained via `await mongoose.startSession()`. All write operations in `apps/server/` must use this pattern.

### AD2: Upward-Only Transfer Topology

**Context**: P2P transfers enable point laundering and Sybil attacks.
**Decision**: The transfer API endpoint validates `recipient` against the sender's `referredBy` field. A User can only transfer to their referring Moderator or Admin. A Moderator can only transfer to Admin. Validation is enforced in the Express route handler before any database operation.
**Implementation**: Route handler in `apps/server/src/routes/transactions.ts` checks `sender.role` and `sender.referredBy` to determine valid recipients. Hard-reject any other recipient with HTTP 403.

### AD3: Escrow Pattern for Withdrawals

**Context**: Points must be removed from circulation during manual MFS payout processing.
**Decision**: Withdrawal requests atomically move points from `availableBalance` to `escrowBalance` on the user's wallet. A `WithdrawalRequest` document tracks state (PENDING → APPROVED/REJECTED). Approval burns escrow points; rejection refunds them.
**Implementation**: Two-phase approach in `apps/server/src/routes/withdrawals.ts`:
1. **Request**: Debit `availableBalance`, credit `escrowBalance`, create WithdrawalRequest.
2. **Process**: Admin/Mod updates status. If APPROVED: zero out escrow, create BURN transaction. If REJECTED: reverse escrow to available, create REFUND transaction.

### AD4: Idempotency Keys for Write Operations

**Context**: Network retries can cause duplicate transactions.
**Decision**: All mutating endpoints (transfer, withdraw, distribute) require an `Idempotency-Key` header (client-generated UUID). The server stores used keys in a MongoDB collection with a 24-hour TTL index. Duplicate keys return the original response.
**Implementation**: Express middleware in `apps/server/src/middleware/idempotency.ts` checks/stores keys before route handlers execute. Uses MongoDB TTL index for automatic cleanup.

### AD5: Better Auth User Extension via `additionalFields`

**Context**: Users need `role`, `referredBy`, `availableBalance`, and `escrowBalance` fields.
**Decision**: Extend Better Auth's user model using the `user.additionalFields` config option in `packages/auth/src/index.ts`. Add corresponding fields to the Mongoose schema in `packages/db/src/models/auth.model.ts`. Use Better Auth's `admin` plugin for role management.
**Implementation**:
- `packages/auth/src/index.ts`: Add `user.additionalFields` with `role`, `referredBy`, `referralCode`, `phoneNumber`, `availableBalance`, `escrowBalance`.
- `packages/db/src/models/auth.model.ts`: Add matching fields to `userSchema`.
- `apps/web/src/lib/auth-client.ts`: Add matching client plugins.

### AD6: Monorepo Alignment — Zero Structural Changes

**Context**: The Turborepo monorepo has a working structure that must not be disrupted.
**Decision**: All new code is additive. No existing files are renamed or restructured. New files are created alongside existing ones following the established patterns.

---

## Implementation Patterns & Consistency Rules

### Naming Patterns

- **Database (Mongoose)**: 
    - **Collections**: Singular, lowercase (e.g., `user`, `transaction`, `withdrawal`).
    - **Fields**: camelCase (e.g., `availableBalance`, `referredBy`).
- **API (REST)**:
    - **Endpoints**: Plural, kebab-case (e.g., `/api/transactions/transfer`, `/api/withdrawals/queue`).
    - **Parameters**: camelCase (e.g., `senderId`, `amountPoints`).
- **Code**:
    - **Components**: PascalCase (e.g., `BalanceCard.tsx`).
    - **Files**: kebab-case (e.g., `withdrawal-form.tsx`).
    - **Functions/Variables**: camelCase (e.g., `handleTransfer`, `isLoading`).

### Structure Patterns

- **Frontend (Next.js)**: Feature-based organization within `apps/web/src/app/`. Shared UI components stay in `packages/ui`.
- **Backend (Express)**: Route-based organization in `apps/server/src/routes/`. Middleware in `apps/server/src/middleware/`.
- **Database**: All models must live in `packages/db/src/models/` and be exported from the package index.

### Format Patterns

- **API Response Wrapper**:
    ```json
    { "success": true, "data": { ... } }
    { "success": false, "error": { "message": "Description", "code": "ERR_CODE" } }
    ```
- **Dates**: ISO 8601 strings for all API and storage communication.

### Communication & Process Patterns

- **State Management**: Use **React Server Components** for fetching; **TanStack Form** for local mutation state.
- **Error Handling**: Use early returns for validation. Log every API failure via `req.log.error` (evlog).
- **Loading States**: Use **Shadcn Skeletons** for skeleton screens and **Sonner** for action feedback.

---

## Core System Patterns (Model Details)

### Database Schema Design

All models live in `packages/db/src/models/`. The existing `auth.model.ts` is extended; new models are added as separate files.

#### 1. User Model Extension (`packages/db/src/models/auth.model.ts`)

Add to existing `userSchema`:
```
role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' }
referredBy: { type: String, ref: 'User', default: null }
referralCode: { type: String, unique: true, sparse: true }
phoneNumber: { type: String, unique: true, sparse: true }
availableBalance: { type: Number, default: 0, min: 0 }
escrowBalance: { type: Number, default: 0, min: 0 }
dailyPointLimit: { type: Number, default: null }
```

#### 2. Transaction Model (`packages/db/src/models/transaction.model.ts`)

```
_id: String (auto)
type: String, enum: ['MINT', 'TRANSFER', 'WITHDRAW_ESCROW', 'REFUND', 'DISTRIBUTE', 'BURN']
senderId: String, ref: 'User' (nullable for MINT/DISTRIBUTE)
receiverId: String, ref: 'User', required
amount: Number, required, min: 1
idempotencyKey: String, unique, sparse
status: String, enum: ['COMPLETED', 'FAILED'], default: 'COMPLETED'
metadata: Mixed (optional context, e.g., "spillback_from_distribution")
createdAt: Date
```
Collection: `transaction`. Index on `[senderId, createdAt]`, `[receiverId, createdAt]`, `[idempotencyKey]` (unique).

#### 3. Withdrawal Request Model (`packages/db/src/models/withdrawal.model.ts`)

```
_id: String (auto)
userId: String, ref: 'User', required
amountPoints: Number, required, min: 1
amountBDT: Number, required
mfsProvider: String, enum: ['bkash', 'nagad', 'rocket'], required
mfsNumber: String, required
status: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING'
processedBy: String, ref: 'User' (nullable)
processedAt: Date (nullable)
rejectionReason: String (nullable)
createdAt: Date
updatedAt: Date
```
Collection: `withdrawal`. Index on `[userId, status]`, `[status, createdAt]`.

#### 4. Idempotency Key Model (`packages/db/src/models/idempotency.model.ts`)

```
_id: String (auto)
key: String, unique, required
response: Mixed (cached response body)
statusCode: Number
createdAt: Date (TTL index: expires after 86400 seconds)
```
Collection: `idempotencyKey`.

### AD7: Global Distribution Spillback Logic

**Context**: When Admin distributes points globally with a `dailyPointLimit`, some users may reach their limit while points remain.
**Decision**: The distribution logic in `apps/server/src/routes/transactions.ts` calculates the total points that *can* be distributed. Any remainder from the "Points to Distribute" pool that cannot be allocated due to user limits is automatically returned to the Admin's `availableBalance` via a `BURN` (from pool) and `MINT` (to admin) or a direct `TRANSFER` from a system account.
**Implementation**: Atomic transaction block handles the loop and final spillback.

### API & Security Patterns

---

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
srfmart/
├── apps/
│   ├── server/                 # Express 5 API
│   │   ├── src/
│   │   │   ├── index.ts        # Entry point & Route mounting
│   │   │   ├── routes/         # Feature-based routes
│   │   │   │   ├── transactions.ts  # Mint, Transfer, Distribute
│   │   │   │   ├── withdrawals.ts   # Queue, Approve, Reject
│   │   │   │   └── users.ts         # Profile, Search, Role management
│   │   │   ├── middleware/
│   │   │   │   ├── idempotency.ts   # AD4 implementation
│   │   │   │   └── auth.ts          # Better Auth session check
│   │   │   └── lib/
│   │   │       └── require-role.ts  # RBAC middleware
│   ├── web/                    # Next.js 16 Frontend
│   │   ├── src/app/
│   │   │   ├── dashboard/      # User/Mod Wallet view
│   │   │   ├── admin/          # Admin-only (Distribution, Users)
│   │   │   ├── moderator/      # Mod-only (Withdrawal Queue)
│   │   │   └── login/          # Auth entry
│   │   ├── src/components/
│   │   │   ├── wallet/         # BalanceCard, TransferForm
│   │   │   └── admin/          # DistributionForm, UserTable
├── packages/
│   ├── db/                     # Mongoose Models & Connection
│   │   ├── src/models/
│   │   │   ├── auth.model.ts   # User, Session (Extended)
│   │   │   ├── transaction.model.ts # AD1 & AD7
│   │   │   ├── withdrawal.model.ts  # AD3
│   │   │   └── idempotency.model.ts # AD4
│   ├── auth/                   # Better Auth Shared Config
│   ├── ui/                     # Shadcn / Tailwind 4 Components
│   └── env/                    # Shared Environment Validation
```

### Architectural Boundaries

**API Boundaries:**
All point-mutating operations MUST go through `apps/server/src/routes/transactions.ts` to ensure atomic session handling and idempotency.

**Component Boundaries:**
Frontend components in `apps/web` communicate with the backend via the `auth-client` and standard `fetch` calls. Shared UI components stay in `packages/ui` and are stateless where possible.

**Data Boundaries:**
`packages/db` is the single source of truth for Mongoose models. Application code must not define ad-hoc schemas for core ledger entities.

### Requirements to Structure Mapping

**Feature/Epic Mapping:**
- **Point Wallet**: `apps/web/src/components/wallet/`, `packages/db/src/models/transaction.model.ts`
- **Admin Distribution**: `apps/web/src/app/admin/distribute/`, `apps/server/src/routes/transactions.ts`
- **Withdrawal Queue**: `apps/web/src/app/moderator/withdrawals/`, `packages/db/src/models/withdrawal.model.ts`
- **Referral System**: `packages/auth/src/index.ts` (hooks), `apps/web/src/app/login/`

---

```
apps/server/src/
├── index.ts              (existing — add route mounting)
├── middleware/
│   └── idempotency.ts    (new — idempotency key middleware)
├── routes/
│   ├── transactions.ts   (new — transfer, mint, distribute)
│   └── withdrawals.ts    (new — request, approve, reject, list)
└── lib/
    └── require-role.ts   (new — role-based access middleware)
```

#### Authentication & Authorization

The existing `identifyUser` middleware (evlog) already injects user info into `req.log`. For route-level RBAC:
- Create `requireRole(...roles)` middleware in `apps/server/src/lib/require-role.ts`.
- This middleware reads the user session from Better Auth headers, checks `user.role` against allowed roles, and returns 403 if unauthorized.
- Mount after `identifyUser` on protected routes.

#### Request Validation

Zod is already a workspace dependency. Every route handler validates the request body with a Zod schema before touching the database. Validation schemas are co-located with route files.

#### Referral Gate

The sign-up flow must be modified:
- `packages/auth/src/index.ts`: Add a `databaseHooks.user.create.before` hook that validates the `referralCode` field exists and resolves to a valid user. If invalid, throw to block registration.
- `apps/web/src/components/sign-up-form.tsx`: Add a `referralCode` field to the form.

### Frontend Route Structure (`apps/web/src/app/`)

```
apps/web/src/app/
├── layout.tsx                (existing)
├── page.tsx                  (existing — home)
├── login/
│   └── page.tsx              (existing — sign in/up toggle)
├── dashboard/
│   ├── page.tsx              (existing — extend with wallet view)
│   ├── dashboard.tsx         (existing — extend with balance card)
│   ├── transfer/
│   │   └── page.tsx          (new — upward transfer form)
│   ├── withdraw/
│   │   └── page.tsx          (new — withdrawal request form)
│   └── history/
│       └── page.tsx          (new — transaction history)
├── admin/
│   ├── page.tsx              (new — admin dashboard)
│   ├── distribute/
│   │   └── page.tsx          (new — global distribution form)
│   ├── withdrawals/
│   │   └── page.tsx          (new — withdrawal queue management)
│   └── users/
│       └── page.tsx          (new — user search & role management)
└── moderator/
    ├── page.tsx              (new — moderator dashboard)
    └── withdrawals/
        └── page.tsx          (new — withdrawal queue for mod)
```

---

## API Endpoint Specification

### Transaction Endpoints (`/api/transactions`)

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/transactions/transfer` | ✅ | user, mod | Transfer points upward |
| POST | `/api/transactions/mint` | ✅ | admin | Mint new points |
| POST | `/api/transactions/distribute` | ✅ | admin | Global point distribution |
| GET | `/api/transactions/history` | ✅ | all | User's transaction history |

### Withdrawal Endpoints (`/api/withdrawals`)

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/withdrawals/request` | ✅ | user, mod | Submit withdrawal |
| GET | `/api/withdrawals/queue` | ✅ | mod, admin | List pending withdrawals |
| POST | `/api/withdrawals/:id/approve` | ✅ | mod, admin | Approve & mark paid |
| POST | `/api/withdrawals/:id/reject` | ✅ | mod, admin | Reject & refund |

### User/Admin Endpoints (`/api/users`)

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/users/search` | ✅ | admin | Search users by phoneNumber/email |
| POST | `/api/users/:id/role` | ✅ | admin | Assign/revoke moderator |
| GET | `/api/users/me/wallet` | ✅ | all | Get own balance info |

---

## Integration Points

### Server Entry Point Changes (`apps/server/src/index.ts`)

The existing Express app needs these additions (append, do not restructure):
1. Import and mount `transactionRoutes` at `/api/transactions`
2. Import and mount `withdrawalRoutes` at `/api/withdrawals`
3. Import and mount `userRoutes` at `/api/users`
4. Add `idempotencyMiddleware` to mutating routes

### Auth Config Changes (`packages/auth/src/index.ts`)

Extend `createAuth()` with:
1. `user.additionalFields` — role, referredBy, referralCode, balances
2. `databaseHooks.user.create.before` — referral code validation
3. `plugins: [admin()]` — for role management capabilities

### Auth Client Changes (`apps/web/src/lib/auth-client.ts`)

Extend `createAuthClient()` with matching client-side plugins to access additional user fields in session.

### DB Package Export Changes (`packages/db/src/index.ts`)

Export new models alongside existing `client` export. Add:
```
export { Transaction } from './models/transaction.model'
export { WithdrawalRequest } from './models/withdrawal.model'
export { IdempotencyKey } from './models/idempotency.model'
```

---

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All decisions (AD1-AD7) are technologically compatible. The ledger integrity logic works in concert with the hierarchical topology to ensure a secure, fraud-resistant system.

**Pattern Consistency:**
Naming and structure patterns are consistent across the monorepo, ensuring AI agents implement compatible code.

**Structure Alignment:**
The Turborepo structure supports all defined architectural boundaries and integration points.

### Requirements Coverage Validation ✅

**Feature Coverage:**
- **Point Wallet**: Fully supported by AD1, AD3, and AD5.
- **Admin Actions**: Fully supported by AD1 and AD7.
- **Security/Referral**: Fully supported by AD2 and AD5 hooks.

**Functional Requirements Coverage:**
All functional categories from the Bengali spec (Transfer, Withdraw, Search, Distribute) are mapped to specific ADs.

**Non-Functional Requirements Coverage:**
Security (transactions), performance (indexing), and scalability (monorepo) are addressed.

### Implementation Readiness Validation ✅

**Decision Completeness:** All 7 core decisions are documented with implementation details.
**Structure Completeness:** Complete project tree provided for immediate scaffold execution.
**Pattern Completeness:** Naming, structure, and communication patterns are finalized.

### Architecture Readiness Assessment

**Overall Status:** **READY FOR IMPLEMENTATION**
**Confidence Level:** **High**

**Key Strengths:**
- Atomic ledger integrity.
- Inherent fraud prevention via topology.
- Clear feature-to-directory mapping.

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented.
- Use implementation patterns consistently.
- Respect project structure and boundaries.

**First Implementation Priority:**
Proceed to **Epic & Story creation** to break down these decisions into actionable development tasks.

---

### Codebase Alignment Checklist

✅ **Express 5 server** — routes mount via `app.use()`, matching existing pattern
✅ **Mongoose 8** — all models use `new Schema()` + `model()`, matching `auth.model.ts` pattern
✅ **Better Auth** — `additionalFields` + `databaseHooks` are documented config options
✅ **Turborepo** — no changes to `turbo.json` or workspace structure needed
✅ **Shadcn UI** — new dashboard components use existing `@srfmart/ui` components
✅ **TanStack Form + Zod** — new forms follow existing `sign-up-form.tsx` pattern
✅ **evlog** — existing logging middleware covers new routes automatically

### Security Checklist

✅ **Double-entry ledger** — atomic MongoDB transactions prevent point inflation
✅ **Idempotency keys** — prevent duplicate transactions from network retries
✅ **Upward-only topology** — eliminates P2P point laundering
✅ **Referral gate** — blocks open registration (Sybil prevention)
✅ **Role-based access** — middleware enforces Admin/Mod/User boundaries
✅ **Escrow pattern** — points locked during withdrawal processing

### What Is NOT in MVP

❌ Automated MFS API integration (Phase 2)
❌ Device fingerprinting (Phase 2)
❌ QR-code onboarding (Phase 2)
❌ Advanced fraud analytics dashboard (Phase 2)
❌ Multi-currency support (Phase 3)
❌ Merchant API (Phase 3)

### Next Step

This architecture is implementation-ready. Proceed to **Epic & Story creation** for ordered implementation.
