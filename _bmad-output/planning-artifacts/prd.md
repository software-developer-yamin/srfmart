---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
releaseMode: phased
classification:
  projectType: 'Web App / Mobile Wallet Platform'
  domain: 'Fintech'
  complexity: 'High'
  projectContext: 'brownfield'
inputDocuments: [
  '_bmad-output/planning-artifacts/product-brief-srfmart.md',
  '_bmad-output/planning-artifacts/product-brief-srfmart-distillate.md',
  '_bmad-output/brainstorming/brainstorming-session-2026-05-12-0220.md',
  '_bmad-output/planning-artifacts/research/domain-srfmart-point-wallet-research-2026-05-12.md',
  '_bmad-output/planning-artifacts/research/market-srfmart-point-wallet-research-2026-05-12.md',
  '_bmad-output/planning-artifacts/research/technical-srfmart-point-wallet-research-2026-05-12.md',
  'docs/Srfmart_Point_system.md'
]
workflowType: 'prd'
---

# Srfmart Point System Product Requirements Document

## Document Information
- **Date**: 2026-05-12
- **Status**: Draft

## Executive Summary

Srfmart is a secure, referral-based points wallet platform layered over existing Mobile Financial Services (bKash, Nagad, Rocket) in Bangladesh. It establishes a closed-loop economy where community leaders seamlessly distribute rewards and users request real-money withdrawals through a managed, highly auditable pipeline. The system provides a centralized, transparent ledger that replaces chaotic manual payout tracking with a scalable, automated accounting foundation.

### What Makes This Special

Srfmart uniquely defends against reward platform fraud through a strict referral-only growth model and a restricted transfer topology. Users can exclusively transfer points upward to Admins or Moderators—zero peer-to-peer (P2P) transfers are permitted. This architectural constraint completely neutralizes prevalent MFS fraud vectors such as Sybil attacks, bot farms, and point laundering. By ensuring every user is explicitly vouched for and maintaining absolute server-authoritative control over all balances, Srfmart leverages real-world trust networks to build a secure, scalable digital economy.

## Project Classification

- **Project Type:** Web App / Mobile Wallet Platform
- **Domain:** Fintech
- **Complexity Level:** High (strict regulatory, security, and ledger integrity requirements)
- **Project Context:** Brownfield

## Success Criteria

### User Success
- **End Users:** Can confidently view their point balance in real-time, clearly understand the BDT conversion value, and request withdrawals without friction.
- **Moderators/Admins:** Can effortlessly distribute points to legitimate users with a few clicks, eliminating the need for manual spreadsheet tracking and reducing payout errors to zero.

### Business Success
- **Trust & Integrity:** Achieve 100% trust in the platform's ledger by ensuring zero unauthorized point creation (minting) and zero fraudulent peer-to-peer transfers.
- **Operational Efficiency:** Significantly reduce the administrative overhead required to manage, verify, and process user reward payouts.

### Technical Success
- **Ledger Security:** Zero double-spending incidents, achieved through atomic MongoDB transactions and strict idempotency keys.
- **System Resilience:** Platform remains highly responsive for read-heavy dashboard queries (utilizing CQRS) while maintaining absolute write-integrity on the ledger.
- **Fraud Prevention:** Zero-trust architecture successfully blocks automated bot farms and Sybil attacks via referral-only constraints and device fingerprinting.

### Measurable Outcomes
- **0 incidents** of point laundering or unauthorized point inflation.
- **100% successful reconciliation** between the internal point ledger and external MFS (bKash/Nagad) disbursements.
- **< 2 seconds** load time for user and admin dashboards under peak load.
- **50% reduction** in manual tracking and payout processing time for community managers within the first 3 months.

## Product Scope & Phased Development

### MVP Strategy & Philosophy
**MVP Approach**: Security & Trust MVP. The primary focus is establishing absolute integrity in the ledger mechanics and enforcing the structural point-flow constraints. We will intentionally accept manual operational overhead (e.g., manual withdrawal processing by Admins) to de-risk technical complexity and prevent automated loss events in Phase 1.
**Resource Requirements**: A lean, highly-skilled full-stack team capable of writing strict MongoDB transactions and implementing a secure Next.js frontend (e.g., 1 Tech Lead/Backend, 1-2 Frontend Engineers).

### MVP Feature Set (Phase 1)
**Core User Journeys Supported**:
- Primary User Balance & Transfer Journey
- Moderator Community Management Journey
- Admin Manual Payout & Risk Journey
- Security Edge-Case: Sybil/Double-Spend Blocking

**Must-Have Capabilities**:
- Atomic MongoDB Ledger (Mint, Transfer, Request Withdrawal).
- Strict idempotency key validation on all transaction write paths.
- Next.js Web Application with distinct, secure routing for Admin, Moderator, and User roles.
- Moderator-assisted manual registration flow (open signups completely disabled).
- Manual MFS withdrawal queue (Admin dashboard for marking requests as paid/rejected).

### Post-MVP Features

**Phase 2 (Growth)**:
- Automated MFS disbursements via direct bKash/Nagad API integration (including robust webhook receivers).
- Frictionless bulk-invite tools and self-service QR-code onboarding flows for Moderators.
- Advanced administrative analytics and heuristic fraud detection dashboards.

**Phase 3 (Vision / Expansion)**:
- External Merchant API allowing third-party platforms to plug into and utilize the Srfmart point economy.
- Multi-tier or multi-currency point abstraction.

### Risk Mitigation Strategy
**Technical Risks**: The largest risk is a ledger vulnerability (race condition or double-spend) leading to point inflation. *Mitigation*: The MVP uses a manual withdrawal process, removing external MFS API instability from the critical path and allowing human review of outgoing cash flow.
**Market Risks**: Severe user acquisition bottlenecks due to the strict referral-only gate. *Mitigation*: Ensure the Moderator interface for adding users is exceptionally fast, allowing community leaders to onboard users without friction.
**Resource Risks**: Backend security complexity consuming all engineering cycles. *Mitigation*: Heavily leverage Next.js Server Components and React Query to simplify frontend state management, keeping the engineering focus on backend integrity.

## User Journeys

### Journey 1: Kamal cashes out his hard-earned points (Primary User - Success Path)
- **Opening Scene**: Kamal, a university student, has accumulated 500 points by participating in community tasks. He needs some pocket money to pay for a textbook.
- **Rising Action**: Kamal logs into the Srfmart platform on his phone. His dashboard clearly displays his 500 points and the equivalent value in BDT. He taps "Withdraw," selects his saved bKash mobile number, and enters the amount.
- **Climax**: He submits the request. The UI instantly confirms submission and updates his dashboard to show the 500 points as "Locked/Pending."
- **Resolution**: A few hours later, Kamal receives an SMS from bKash. He checks Srfmart and sees the status has changed to "Approved." He feels relieved, his trust in the platform is solidified, and he's motivated to participate in more tasks.

### Journey 2: Kamal attempts an unauthorized transfer (Primary User - Edge Case / Security)
- **Opening Scene**: Kamal’s friend, Jamal, asks to borrow 100 points. Kamal agrees and opens the Srfmart app to transfer the points.
- **Rising Action**: Kamal navigates to the "Transfer" section. He tries to search for Jamal's username or email address but gets no results.
- **Climax**: He reads a system tooltip explaining that points can only be transferred upward to his referring Moderator or Admin. The system strictly blocks Peer-to-Peer (P2P) transfers.
- **Resolution**: Kamal cannot send the points to Jamal. While slightly inconvenient for Kamal, this architectural constraint successfully prevents a potential point-laundering scenario, preserving the system's economic integrity.

### Journey 3: Rahim distributes weekly rewards (Moderator - Success Path)
- **Opening Scene**: Rahim manages a team of 20 community volunteers. It’s Friday, and he needs to distribute 100 points to each active member as a reward. Previously, this meant chaotic WhatsApp groups and manual Excel tracking.
- **Rising Action**: Rahim logs into his Moderator dashboard. He sees that the Admin has allocated 5,000 points to his wallet. He navigates to his "Referrals / Team" list.
- **Climax**: He selects the active users and executes the transfers. The points are instantly deducted from his wallet and credited to his volunteers. 
- **Resolution**: The entire process takes two minutes. Rahim has a clear, immutable audit log of exactly who received what, saving him hours of administrative headache and disputes.

### Journey 4: Admin Zaman prevents a coordinated attack (Admin - Operations & Support)
- **Opening Scene**: Zaman is reviewing the daily withdrawal queue on the Admin dashboard before processing payouts via the corporate bKash portal.
- **Rising Action**: A withdrawal request for 10,000 points catches his eye. The Srfmart risk dashboard flags the request with a warning: the requesting user received these points from three different newly created Moderators within a 10-minute window.
- **Climax**: Zaman clicks into the user's profile to view the transaction graph. Recognizing the pattern of a coordinated Sybil attack, he clicks "Reject & Freeze Account."
- **Resolution**: The points are nullified, and the fraudulent withdrawal is stopped before any real money leaves the system. Zaman feels entirely in control of the platform's liability exposure.

## Technical Architecture & Constraints

*(This section consolidates domain compliance, web architecture, and platform innovation requirements.)*

### Compliance & Regulatory
- **Bangladesh Bank Guidelines**: The system must operate within the legal frameworks governing digital rewards and MFS transactions in Bangladesh, avoiding classification as an unlicensed banking entity.
- **AML/CFT Monitoring**: Anti-Money Laundering (AML) heuristics must be applied to withdrawal requests, flagging high-velocity or unusually large point movements.
- **Data Privacy & Residency**: User data (especially email addresses and transaction histories) must comply with local data protection regulations, ideally storing data on domestic or compliant cloud infrastructure.

### Technical Architecture & Novel Patterns
- **Trust-Graph Topology Enforcement**: While most reward platforms suffer from Sybil attacks due to open registration, Srfmart prevents them by mirroring real-world community trust hierarchies (Admin -> Moderator -> User). You have to be explicitly vouched for to participate.
- **Upward-Only Liquidity Constraints**: By completely disabling peer-to-peer (P2P) transfers, Srfmart eradicates the dark market for point laundering. Points can only be moved upward to trusted nodes for withdrawal, making the theft or farming of points fundamentally useless to attackers.
- **Event-Driven CQRS**: The architecture separates write operations (point minting, transfers, withdrawals) from read operations (user balance dashboards). This ensures heavy dashboard queries do not lock the transaction ledger, maintaining performance under load.
- **Atomic Ledger & Idempotency**: Core point transactions are executed using MongoDB with multi-document transactions, guaranteeing ACID compliance. Every transaction endpoint requires a unique client-generated idempotency key to completely eliminate double-spending from network retries.

### Web App Implementation
- **Frontend Framework**: Srfmart operates as a mobile-first web application using Next.js. It utilizes Server Components for optimized initial load speeds and secure data fetching.
- **State & Caching**: Aggressive caching of read models (balances/history) via tools like React Query, with strict invalidation hooks tied to write operations.
- **Webhook Reliability (Phase 2)**: Implementation of a robust, queue-based webhook receiver to handle asynchronous status updates from MFS (bKash/Nagad) APIs, ensuring no payment status events are dropped during traffic spikes.
- **Authentication**: Gated authentication flow requiring cryptographically signed referral links or email OTPs, utilizing device fingerprinting to detect Sybil attacks.

## Functional Requirements

### Authentication & User Management
- FR1: Users can register an account using a valid email address, email OTP validation, and a mandatory referral code.
- FR2: System strictly blocks any registration attempt that lacks a valid referral code.
- FR3: Moderators can generate and distribute unique referral codes to invite new users.
- FR4: Admins can search for any user in the system using their email address.
- FR5: Admins can assign or revoke the "Moderator" role for any existing user.

### Point Ledger & Transfers
- FR6: Users can view their current digital wallet point balance.
- FR7: Users can transfer points upwards to a designated Admin or Moderator.
- FR8: System automatically blocks any peer-to-peer point transfer attempts between standard Users.
- FR9: Admins can mint (create) new points into the administrative wallet pool.
- FR10: Admins and Moderators can view a ledger history of all points received, explicitly showing the sender's email address.

### Global Point Distribution
- FR11: Admins can execute a "Global Distribution" action to divide a specific amount of points equally among all active users.
- FR12: Admins can configure a "Daily Maximum Point Limit" per user.
- FR13: System automatically refunds any points that exceed a user's daily limit back to the Admin's wallet during global distribution.

### Withdrawal Management
- FR14: Users can submit a point withdrawal request, selecting their preferred payout method (bKash, Nagad, Rocket) via a dropdown.
- FR15: Moderators and Admins can view a centralized queue of all pending withdrawal requests.
- FR16: Moderators and Admins can update the status of withdrawal requests (e.g., mark as Approved/Paid or Rejected).
- FR17: System automatically places points in escrow when a withdrawal is requested, and finalizes or refunds the points based on Moderator/Admin approval or rejection.

### Security & System Integrity
- FR18: System validates unique idempotency keys on all point transfers and withdrawals to absolutely prevent double-spending during network retries.
- FR19: System securely validates email OTPs on the server-side to prevent client-side bypass attacks.
- FR20: System captures device fingerprints during authentication to detect and flag Sybil attacks (one user managing multiple accounts).

## Non-Functional Requirements

### Security & Data Integrity
- **NFR-SEC-1 (ACID Compliance)**: All point-altering operations (minting, transferring, withdrawing) must be executed as atomic database transactions. The system must guarantee zero point-duplication under concurrent request load (race conditions).
- **NFR-SEC-2 (Idempotency)**: The system must reject duplicate transaction requests containing the same idempotency key within a 24-hour window.
- **NFR-SEC-3 (OTP Security)**: Authentication email OTPs must expire exactly 5 minutes after generation and enforce a hard lockout (15-minute cooldown) after 3 consecutive failed attempts.
- **NFR-SEC-4 (Encryption)**: All client-to-server and server-to-server communication must be encrypted using TLS 1.3 or higher.

### Performance
- **NFR-PERF-1 (Dashboard Load)**: The primary user dashboard (fetching current point balance) must fully render in under 2.0 seconds for the 95th percentile of users on mobile 4G networks.
- **NFR-PERF-2 (Transaction Speed)**: Point transfer operations must complete the database write and return a success confirmation to the client in under 1.0 second.

### Scalability
- **NFR-SCAL-1 (Global Distribution Execution)**: The Admin "Global Distribution" command must be capable of processing and updating balances for 10,000 users in under 30 seconds without causing table locks that disrupt standard user read queries.
- **NFR-SCAL-2 (Concurrency)**: The core transaction ledger must successfully handle 500 concurrent point transfer requests without throwing database deadlock errors.

### Integration & Reliability (Preparation for Phase 2)
- **NFR-INT-1 (Webhook Speed)**: Webhook receiving endpoints (for future bKash/Nagad integration) must acknowledge receipt (HTTP 200) within 500ms to prevent timeout-triggered retries from the payment gateway.
- **NFR-INT-2 (Dead-Letter Queue)**: Any failed automated withdrawal or unprocessable webhook payload must be automatically routed to a persistent dead-letter queue for Admin manual review; no financial state changes can be silently dropped.
