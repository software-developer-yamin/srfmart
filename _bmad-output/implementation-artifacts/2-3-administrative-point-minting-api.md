# Story 2.3: Administrative Point Minting API

Status: done

## 📖 Story Foundation

As an Admin,
I want to "mint" points into my administrative wallet,
So that I can provide the initial point liquidity for reward distribution.

### 🎯 Acceptance Criteria

- **Given** an Admin session
- **When** I POST to `/api/transactions/mint` with an amount
- **Then** the system creates a `MINT` transaction record
- **And** it increases the Admin's `availableBalance` atomically (FR9)
- **And** it requires a valid idempotency key.

## 🧠 Developer Context

This story implements the core mechanism for introducing points into the Srfmart economy. Admins act as the source of liquidity. Because this operation fundamentally alters the total supply of points, it must be rigorously secured, strictly atomic, and guarded against network-induced duplicate requests.

## 🛣️ Technical Requirements & Guardrails

### 1. Architecture Compliance
- **Double-Entry Ledger (AD1):** The minting operation must be executed within a MongoDB Transaction using `session.withTransaction()`. It must create a `Transaction` record (type: `MINT`) and update the Admin's user record (`availableBalance` increment) atomically.
- **Idempotency (AD4):** The route must utilize the Idempotency Middleware created in Story 2.2 to prevent double-minting on network retries. Ensure the `Idempotency-Key` header is present and validated.
- **Role-Based Access Control:** This endpoint is STRICTLY for Admins. Ensure the `identifyUser` middleware (or equivalent auth validation) checks that `user.role === 'admin'` before proceeding.

### 2. Files & API Structure
- **Endpoint:** `POST /api/transactions/mint` mounted in `apps/server/src/routes/transactions.ts`.
- **Request Body (JSON):** 
  - `amount`: Number (must be > 0)
- **Relevant Models (`packages/db/src/models/`):** 
  - `transaction.model.ts` (Already created in 2.1)
  - `auth.model.ts` (User schema)

### 3. Implementation Steps
1. **Route Def:** In `apps/server/src/routes/transactions.ts`, define the `POST /mint` endpoint.
2. **Access Control:** Enforce `admin` role requirement. Return `403 Forbidden` if unauthorized.
3. **Input Validation:** Validate the `amount` is a positive number.
4. **Idempotency:** Delegate to `idempotencyMiddleware` (or enforce it locally if middleware integration is partial).
5. **Atomic Transaction Block:**
   ```typescript
   const session = await mongoose.startSession();
   await session.withTransaction(async () => {
       // 1. Create Transaction Document
       // senderId: null, receiverId: adminUserId, type: 'MINT', amount
       // 2. Update Admin (User) Document
       // $inc: { availableBalance: amount }
   });
   session.endSession();
   ```
6. **Error Handling:** Catch transaction aborts and return appropriate 500/400 errors.

### 4. Code Standards & Patterns
- **No Floating Promises:** Always `await` async operations and Mongoose calls.
- **Evlog Logging:** Log significant events like minting success and validation failures using the established `evlog` pattern.
- **Meaningful Errors:** Throw or return descriptive errors (e.g., "Amount must be greater than zero", "Invalid Idempotency Key").

### 5. Testing Requirements
- The route handler should be testable.
- Ensure failure cases (non-admin access, negative amounts, missing idempotency key) are handled gracefully and do not commit partial transactions.

## 📈 Completion Status
- Story ID: 2.3
- Status: done
- Notes: Ultimate context engine analysis completed - comprehensive developer guide created.

### Review Findings
- [x] [Review][Patch] Unreviewed implementation mounted to the application — The diff mounts `transactionRoutes` in `apps/server/src/index.ts` (line 55), but the actual implementation file `apps/server/src/routes/transactions.ts` is either missing from the diff or untracked. Ensure the file is tracked and committed.
- [x] [Review][Patch] Missing Implementation Files — The files `apps/server/src/routes/transactions.ts` and `apps/server/src/tests/transactions.test.ts` are completely missing from the reviewed diff (they are untracked). This violates all Acceptance Criteria as the logic cannot be verified or merged safely. Stage these files!
