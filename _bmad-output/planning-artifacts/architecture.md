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
