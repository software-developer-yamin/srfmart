---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments: [
  '_bmad-output/planning-artifacts/prd.md',
  '_bmad-output/planning-artifacts/architecture.md',
  '_bmad-output/planning-artifacts/ux-design-specification.md',
  'docs/Srfmart_Point_system.md'
]
---

# srfmart - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for srfmart, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Users can register an account using a valid email address, email OTP validation, and a mandatory referral code.
FR2: System strictly blocks any registration attempt that lacks a valid referral code.
FR3: Moderators can generate and distribute unique referral codes to invite new users.
FR4: Admins can search for any user in the system using their email address or phone number.
FR5: Admins can assign or revoke the "Moderator" role for any existing user.
FR6: Users can view their current digital wallet point balance.
FR7: Users can transfer points upwards to a designated Admin or Moderator.
FR8: System automatically blocks any peer-to-peer point transfer attempts between standard Users.
FR9: Admins can mint (create) new points into the administrative wallet pool.
FR10: Admins and Moderators can view a ledger history of all points received, explicitly showing the sender's identifier.
FR11: Admins can execute a "Global Distribution" action to divide a specific amount of points equally among all active users.
FR12: Admins can configure a "Daily Maximum Point Limit" per user.
FR13: System automatically refunds any points that exceed a user's daily limit back to the Admin's wallet during global distribution.
FR14: Users can submit a point withdrawal request, selecting their preferred payout method (bKash, Nagad, Rocket) via a dropdown.
FR15: Moderators and Admins can view a centralized queue of all pending withdrawal requests.
FR16: Moderators and Admins can update the status of withdrawal requests (e.g., mark as Approved/Paid or Rejected).
FR17: System automatically places points in escrow when a withdrawal is requested, and finalizes or refunds the points based on Moderator/Admin approval or rejection.
FR18: System validates unique idempotency keys on all point transfers and withdrawals to absolutely prevent double-spending during network retries.
FR19: System securely validates email OTPs on the server-side to prevent client-side bypass attacks.
FR20: System captures device fingerprints during authentication to detect and flag Sybil attacks (one user managing multiple accounts).

### NonFunctional Requirements

NFR-SEC-1: ACID Compliance for all point-altering operations (minting, transferring, withdrawing) must be executed as atomic database transactions.
NFR-SEC-2: The system must reject duplicate transaction requests containing the same idempotency key within a 24-hour window.
NFR-SEC-3: Authentication email OTPs must expire exactly 5 minutes after generation and enforce a hard lockout after 3 failed attempts.
NFR-SEC-4: All client-to-server and server-to-server communication must be encrypted using TLS 1.3 or higher.
NFR-PERF-1: The primary user dashboard must fully render in under 2.0 seconds for the 95th percentile of users on mobile 4G networks.
NFR-PERF-2: Point transfer operations must complete the database write and return a success confirmation in under 1.0 second.
NFR-SCAL-1: The Admin "Global Distribution" command must be capable of processing 10,000 users in under 30 seconds.
NFR-SCAL-2: The core transaction ledger must handle 500 concurrent point transfer requests without database deadlock errors.
NFR-INT-1: Webhook receiving endpoints must acknowledge receipt within 500ms.
NFR-INT-2: Failed automated withdrawals or unprocessable webhooks must be routed to a persistent dead-letter queue.

### Additional Requirements

- AD1: Double-Entry Ledger implemented using Mongoose transactions in packages/db.
- AD2: Upward-Only Transfer Topology enforced at the API layer.
- AD3: Escrow Pattern for Withdrawals (PENDING -> APPROVED/REJECTED).
- AD4: Idempotency Keys middleware in apps/server/src/middleware/idempotency.ts.
- AD5: Better Auth User Extension (role, referredBy, balances, referralCode, phoneNumber).
- AD6: Monorepo Alignment - all new code is additive to the existing structure.
- AD7: Global Distribution Spillback Logic returns remainder to Admin's balance.
- RBAC Middleware: require-role.ts for role-based access control.
- Request Validation: Zod validation for all mutating endpoints.
- Referral Gate: databaseHooks.user.create.before in packages/auth/src/index.ts.

### UX Design Requirements

UX-DR1: "Tap-to-Reveal" Balance Card for privacy (auto-hides after 5 seconds).
UX-DR2: Locked Recipient Card for upward transfers (auto-populated and uneditable).
UX-DR3: Secure Numeric Keypad for PIN entry bottom-sheet.
UX-DR4: Escrow Status Indicator with pulse animation and amber badge for pending withdrawals.
UX-DR5: PIN Bottom-Sheet (Drawer) required for all financial actions.
UX-DR6: Role-Based Navigation: Mobile Bottom Bar (Users), Desktop Sidebar (Admins/Mods).
UX-DR7: Full-screen Success Receipt for every point movement transaction.
UX-DR8: Early validation for referral codes during registration and balances during transfers.
UX-DR9: Skeleton UI components for loading states to reduce perceived latency.
UX-DR10: Standardized Button Hierarchy using Trust Slate (Slate-900) and Alert Red.

### FR Coverage Map

FR1: Epic 1 - Referral-based registration
FR2: Epic 1 - Referral gate enforcement
FR3: Epic 1 - Moderator invite tools
FR4: Epic 1 - Admin user search
FR5: Epic 1 - Role management
FR6: Epic 2 - Wallet balance view
FR7: Epic 3 - Upward point transfers
FR8: Epic 3 - P2P transfer blocking
FR9: Epic 2 - Administrative point minting
FR10: Epic 2 - Transaction ledger history
FR11: Epic 4 - Global point distribution
FR12: Epic 4 - Daily point limits
FR13: Epic 4 - Distribution spillback logic
FR14: Epic 5 - Withdrawal request submission
FR15: Epic 5 - Withdrawal queue monitoring
FR16: Epic 5 - Withdrawal status updates
FR17: Epic 5 - Point escrow/finalization logic
FR18: Epic 2 - Idempotency validation
FR19: Epic 1 - OTP secure validation
FR20: Epic 1 - Device fingerprinting

## Epic List

### Epic 1: Foundation, Identity & Security
Establish the core user system with referral-only registration and role-based access control. This sets up the "gated" community.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR19, FR20

### Epic 2: Core Ledger & Admin Minting
Implement the atomic double-entry ledger. This is the "brain" of the point economy.
**FRs covered:** FR6, FR9, FR10, FR18

### Epic 3: Hierarchical Point Transfers
Enable secure, upward-only point transfers. This enforces the unique trust-topology of Srfmart.
**FRs covered:** FR7, FR8

### Epic 4: Global Distribution & Daily Limits
Empower admins to distribute rewards efficiently across the entire platform.
**FRs covered:** FR11, FR12, FR13

### Epic 5: Withdrawal Management & Escrow
Implement the managed withdrawal process to convert points back to real money (BDT).
**FRs covered:** FR14, FR15, FR16, FR17

## Epic 1: Foundation, Identity & Security

Establish the core user system with referral-only registration and role-based access control. This sets up the "gated" community.

### Story 1.1: Extended User Model & Ledger Schema

As a Developer,
I want to extend the Better Auth user model and Mongoose schema,
So that the system can store roles, referral codes, and point balances required for the ledger.

**Acceptance Criteria:**

**Given** the existing `@srfmart/db` and `@srfmart/auth` packages
**When** the `userSchema` in `packages/db/src/models/auth.model.ts` is updated
**Then** it must include the following fields: `role` (enum), `referredBy`, `referralCode`, `phoneNumber`, `availableBalance`, `escrowBalance`, and `dailyPointLimit`
**And** the `packages/auth/src/index.ts` must be updated with matching `additionalFields` to ensure the auth client can access these fields.

### Story 1.2: Referral-Gated User Registration

As a new User,
I want to register for Srfmart using a referral code and email,
So that I can join the community and start earning points securely.

**Acceptance Criteria:**

**Given** a registration form in `apps/web`
**When** I enter a referral code, email, and password
**Then** the UI performs early validation to warn me if the referral code format is invalid (UX-DR8)
**And** the `databaseHooks.user.create.before` in `packages/auth` validates that the code exists in the database
**And** the system strictly blocks registration if the code is invalid or missing (FR1, FR2).

### Story 1.3: Secure Email OTP & Device Fingerprinting

As a User,
I want to verify my email via OTP and have my device fingerprinted,
So that my account is protected from Sybil attacks and automated bot farms.

**Acceptance Criteria:**

**Given** a registration attempt
**When** an OTP is generated and sent to the user's email
**Then** the OTP must expire after 5 minutes and enforce a 15-minute lockout after 3 failed attempts (NFR-SEC-3)
**And** the system must capture a device fingerprint during this process to flag potential Sybil attacks (FR20)
**And** all validation must be performed strictly on the server-side to prevent bypass (FR19).

### Story 1.4: Role-Based Navigation & API Access Control

As a User/Moderator/Admin,
I want to see a navigation menu tailored to my role,
So that I can easily access the features relevant to my responsibilities.

**Acceptance Criteria:**

**Given** a logged-in user with a specific role
**When** the dashboard in `apps/web` renders
**Then** a Mobile Bottom Bar is shown for Users and a Desktop Sidebar is shown for Admins/Moderators (UX-DR6)
**And** the `require-role.ts` middleware in `apps/server` must restrict API access based on these roles (RBAC).

### Story 1.5: Admin User Search & Role Management

As an Admin,
I want to search for users and manage the Moderator hierarchy,
So that I can oversee the community and delegate point distribution power.

**Acceptance Criteria:**

**Given** the Admin dashboard
**When** I search for an email or phone number
**Then** the matching user profiles are displayed (FR4)
**And** I can toggle the "Moderator" role for any user (FR5)
**And** I can view and manage referral codes assigned to Moderators (FR3).

## Epic 2: Core Ledger & Admin Minting

Implement the atomic double-entry ledger. This is the "brain" of the point economy.

### Story 2.1: Transaction Model & Ledger Logic

As a Developer,
I want to implement the Transaction model and atomic ledger logic,
So that every point movement is recorded as an immutable, ACID-compliant entry.

**Acceptance Criteria:**

**Given** the `@srfmart/db` package
**When** the `Transaction` model is created in `packages/db/src/models/transaction.model.ts`
**Then** it must support types: `MINT`, `TRANSFER`, `WITHDRAW_ESCROW`, `REFUND`, `DISTRIBUTE`, `BURN` (AD1)
**And** any point movement must use `session.withTransaction()` to ensure balance updates and ledger entries are atomic (NFR-SEC-1).

### Story 2.2: Idempotency Middleware for Point Operations

As a Developer,
I want to implement idempotency middleware for mutating API endpoints,
So that duplicate requests from network retries do not cause double-spending.

**Acceptance Criteria:**

**Given** a request to `/api/transactions/*` or `/api/withdrawals/*`
**When** an `Idempotency-Key` header is provided
**Then** the `idempotency.ts` middleware verifies the key in MongoDB (AD4)
**And** it rejects duplicates within a 24-hour window by returning the cached original response (NFR-SEC-2).

### Story 2.3: Administrative Point Minting API

As an Admin,
I want to "mint" points into my administrative wallet,
So that I can provide the initial point liquidity for reward distribution.

**Acceptance Criteria:**

**Given** an Admin session
**When** I POST to `/api/transactions/mint` with an amount
**Then** the system creates a `MINT` transaction record
**And** it increases the Admin's `availableBalance` atomically (FR9)
**And** it requires a valid idempotency key.

### Story 2.4: Privacy-First User Wallet Dashboard

As a User,
I want to view my current point balance and transaction history with privacy controls,
So that I can track my earnings securely in public.

**Acceptance Criteria:**

**Given** the user dashboard in `apps/web`
**When** the page loads, my balance is hidden by default (UX-DR1)
**Then** I can "Tap-to-Reveal" the balance, which auto-hides after 5 seconds
**And** a list of my transaction history is displayed with tabular figures for legibility (FR6, FR10, UX-DR7)
**And** the UI uses Skeleton components while data is fetching (UX-DR9).

## Epic 3: Hierarchical Point Transfers

Enable secure, upward-only point transfers. This enforces the unique trust-topology of Srfmart.

### Story 3.1: Upward-Only Transfer API

As a User/Moderator,
I want to transfer points to my upline (Moderator or Admin),
So that I can settle accounts or move points through the hierarchy securely.

**Acceptance Criteria:**

**Given** a point transfer request
**When** the API receives the `recipientId`
**Then** it validates that the recipient is the sender's `referredBy` user (AD2)
**And** it strictly blocks any Peer-to-Peer (P2P) transfers between users at the same level (FR7, FR8)
**And** it executes the movement as an atomic ledger `TRANSFER` transaction.

### Story 3.2: Secure PIN Drawer for Financial Actions

As a User,
I want to confirm my transfers with a secure PIN,
So that I have a second layer of protection against unauthorized point movement.

**Acceptance Criteria:**

**Given** the transfer form in `apps/web`
**When** I tap "Next" after entering an amount
**Then** a Drawer (Bottom Sheet) slides up requesting my 4-digit PIN (UX-DR5)
**And** a custom Secure Numeric Keypad is used for entry (UX-DR3)
**And** early validation prevents me from proceeding if my balance is insufficient (UX-DR8).

### Story 3.3: Locked Recipient Transfer UI

As a User,
I want the transfer recipient to be pre-selected and locked,
So that I don't have to worry about routing points to the wrong person.

**Acceptance Criteria:**

**Given** the transfer screen
**When** the page renders
**Then** a "Locked Recipient Card" is displayed showing my Moderator/Admin's name and avatar (UX-DR2)
**And** the recipient field is uneditable, eliminating routing errors.

## Epic 4: Global Distribution & Daily Limits

Empower admins to distribute rewards efficiently across the entire platform.

### Story 4.1: Admin Global Distribution API

As an Admin,
I want to distribute points to all active users with a single action,
So that I can reward the entire community efficiently without manual entry.

**Acceptance Criteria:**

**Given** an Admin session and a pool of points
**When** I POST to `/api/transactions/distribute` with an amount
**Then** the system identifies all active users with the `user` role (FR11)
**And** it divides the points equally and updates each user's balance atomically
**And** it completes the operation for up to 10,000 users in under 30 seconds (NFR-SCAL-1).

### Story 4.2: Daily Point Limit Enforcement

As an Admin,
I want to set and enforce a daily point limit per user,
So that I can prevent point inflation and control the maximum reward per user.

**Acceptance Criteria:**

**Given** a user or a global setting
**When** a `dailyPointLimit` is configured (FR12)
**Then** any transaction that would result in the user exceeding their total received points for that day must be partially or fully blocked
**And** the check must be performed within the atomic transaction block to prevent race conditions.

### Story 4.3: Distribution Spillback & Admin Refund

As an Admin,
I want excess points from global distribution to be automatically refunded to me,
So that no points are "lost" if users have reached their daily limits.

**Acceptance Criteria:**

**Given** a global distribution execution
**When** a user's `dailyPointLimit` prevents them from receiving the full allocated share
**Then** the system calculates the "spillback" amount (FR13, AD7)
**And** it creates a `REFUND` transaction that returns those points to the Admin's `availableBalance` atomically.

## Epic 5: Withdrawal Management & Escrow

Implement the managed withdrawal process to convert points back to real money (BDT).

### Story 5.1: Point Withdrawal Request API

As a User,
I want to request a point withdrawal to my MFS account (bKash/Nagad/Rocket),
So that I can convert my digital earnings into real money securely.

**Acceptance Criteria:**

**Given** an available balance
**When** I POST to `/api/withdrawals/request` with an amount and MFS details (FR14)
**Then** the points are atomically debited from my `availableBalance` and credited to my `escrowBalance` (FR17, AD3)
**And** a `WithdrawalRequest` is created in the `PENDING` state
**And** it requires a valid idempotency key.

### Story 5.2: Managed Withdrawal Queue

As an Admin/Moderator,
I want to view and manage a queue of pending withdrawals,
So that I can process payouts accurately and fairly.

**Acceptance Criteria:**

**Given** an Admin/Moderator session
**When** I navigate to the withdrawal queue (FR15)
**Then** I see all `PENDING` requests with user identifiers, MFS provider, and BDT equivalent
**And** the UI uses high-density Shadcn data tables with sorting and filtering.

### Story 5.3: Withdrawal Approval & Point Burning

As an Admin/Moderator,
I want to approve a withdrawal after paying the user,
So that the system records the transaction as completed and finalized.

**Acceptance Criteria:**

**Given** a `PENDING` withdrawal request
**When** I click "Approve/Mark Paid" (FR16)
**Then** the points are removed from the user's `escrowBalance`
**And** a `BURN` transaction is recorded to remove the points from circulation
**And** the request status changes to `APPROVED`.

### Story 5.4: Withdrawal Rejection & Point Refund

As an Admin/Moderator,
I want to reject a withdrawal request if there is an error,
So that the user's points are safely returned to their wallet.

**Acceptance Criteria:**

**Given** a `PENDING` withdrawal request
**When** I click "Reject" and provide a reason (FR16)
**Then** the points are atomically moved from the user's `escrowBalance` back to their `availableBalance`
**And** a `REFUND` transaction is recorded
**And** the request status changes to `REJECTED`.

### Story 5.5: Escrow State UX Indicators

As a User,
I want to see a clear indicator for my pending withdrawals,
So that I know my points are safe but currently locked for processing.

**Acceptance Criteria:**

**Given** a pending withdrawal
**When** I view my dashboard
**Then** an "Escrow Status Indicator" is displayed with a pulse animation and amber badge (UX-DR4)
**And** the amount is clearly excluded from my "Available Balance" but visible in the "Locked/Pending" section.





