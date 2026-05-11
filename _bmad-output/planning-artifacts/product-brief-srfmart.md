---
title: "Product Brief: Srfmart Point Wallet"
status: "complete"
created: "2026-05-12"
updated: "2026-05-12"
inputs:
  - docs/Srfmart_Point_system.md
  - _bmad-output/planning-artifacts/research/market-srfmart-point-wallet-research-2026-05-12.md
  - _bmad-output/planning-artifacts/research/domain-srfmart-point-wallet-research-2026-05-12.md
  - _bmad-output/planning-artifacts/research/technical-srfmart-point-wallet-research-2026-05-12.md
  - _bmad-output/brainstorming/brainstorming-session-2026-05-12-0220.md
---

# Product Brief: Srfmart Point Wallet

## Executive Summary

Srfmart is a **referral-only, point-based digital wallet platform** built for the Bangladeshi market. It creates a closed-loop points economy where an Admin distributes points equally to all registered users, users accumulate value in their digital wallets, and withdraw real money via bKash, Nagad, or Rocket — the mobile financial services (MFS) that 200+ million Bangladeshis already trust.

The core insight is simple: **trust scales through personal networks, not marketing campaigns.** By requiring a referral to join, Srfmart builds a verified, accountable user base from day one — eliminating the fake-account plague that cripples open-registration reward platforms. Every user traces back to a real person, creating a self-policing community where fraud is socially costly.

This is not another MFS competitor. Srfmart operates *on top of* existing MFS rails (bKash/Nagad/Rocket for withdrawals), focusing exclusively on the points economy layer: distribution, accumulation, transfer, and withdrawal. The Admin-controlled distribution model with configurable daily caps creates a sustainable, predictable economy — while the referral-only growth model ensures organic, high-quality user acquisition at near-zero cost.

## The Problem

Community-based earning platforms in Bangladesh face a devastating cycle: open registration attracts bot farms and fake accounts → point inflation destroys value → real users lose trust → platform dies. Meanwhile, legitimate community platforms that distribute rewards manually through spreadsheets and personal bKash transfers waste hours of admin time daily, have zero audit trail, and inevitably face disputes over "missing" payments.

**Who feels this pain:**
- **Community leaders and business operators** who want to reward their community members but lack a secure, transparent system — currently resorting to WhatsApp groups and manual bKash transfers
- **Community members** who distrust opaque reward systems where they can't see when their money is coming or verify they received their fair share
- **Moderators** who manually process withdrawal requests with no tooling, no audit trail, and no fraud detection

## The Solution

Srfmart provides a complete points economy platform with three interfaces:

**For Users:** A mobile-first wallet showing real-time point balance (anchored to ৳ value), transparent withdrawal pipeline ("Request → Moderator Review → Approved → bKash Sent → ✅"), referral tree visualization, and daily earning notifications with cap proximity.

**For Moderators:** A smart withdrawal queue with one-tap verification workflows, suspicious pattern alerts (same IP, sudden spikes, new accounts), and daily processing summaries — turning a chaotic manual process into a streamlined, auditable operation.

**For Admins:** A point economy dashboard with bulk equal-distribution (configurable daily caps, excess auto-return), user search by phone number, point flow audit trails, moderator performance tracking, and emergency freeze controls.

## What Makes This Different

1. **Referral-only growth** — Every user is personally vouched for. No open registration means no bot farms, no Sybil attacks, no point inflation. The referral graph itself becomes a fraud detection tool.

2. **Admin-controlled, equal distribution** — Points flow from a single source (Admin) to all users equally with daily caps. This is not a "earn by doing tasks" platform — it's a structured reward distribution system with built-in economic controls.

3. **Restricted transfer topology** — Users can only transfer points to Admin or Moderator, never peer-to-peer. This eliminates the #1 fraud vector in point systems (point laundering through mule accounts) while keeping the withdrawal path clean.

4. **MFS-native withdrawals** — Cash out via the services users already have (bKash, Nagad, Rocket). No new banking relationship required. No learning curve for the end-user.

## Who This Serves

**Primary: Community Leaders / Operators** — Business owners, content creators, or organization leaders who maintain communities of 50–5,000+ members and need to distribute rewards transparently. They become the Admin.

**Secondary: Community Members** — The 18–40 age group, mobile-first Bangladeshi users who are already comfortable with bKash/Nagad. They join through a trusted referral, receive points passively, and withdraw real money.

**Tertiary: Moderators** — Trusted community members promoted by the Admin to handle day-to-day withdrawal processing and user verification.

## Success Criteria

| Metric | Target (6 months) |
|:---|:---|
| Registered users per active community | 500+ |
| Monthly active users (login ≥1x/week) | 70% of registered |
| Average withdrawal processing time | < 4 hours |
| Fraudulent account rate | < 1% |
| Withdrawal dispute rate | < 0.5% |
| Admin time spent on distribution | < 5 min/day |

## Scope

**MVP (v1.0):**
- Referral-only registration with mobile number + OTP
- Digital wallet with point balance and ৳ value display
- Admin bulk equal-distribution with configurable daily caps
- User → Admin/Moderator point transfer
- Withdrawal requests via bKash/Nagad/Rocket (moderator-approved)
- Admin panel: user search, point flow history, moderator management
- Moderator panel: withdrawal queue with approve/reject workflow
- Core security: server-authoritative balances, idempotency keys, rate limiting, device fingerprinting

**Explicitly Out (v1.0):**
- Peer-to-peer transfers
- Point marketplace / point shop
- Gamification (levels, streaks, badges)
- Automated bKash/Nagad API integration (manual transfer by moderator in v1)
- Multi-admin / multi-community support
- NID/biometric KYC

## Vision

If Srfmart succeeds as a single-community tool, it becomes a **multi-tenant community economy platform** — where any community leader can spin up their own points economy in minutes. The referral-only model scales naturally: each community is its own trust network.

**Year 1:** Proven single-community deployment with 1,000+ active users and a sustainable point economy.
**Year 2:** Multi-community SaaS with sponsored distributions ("This batch sponsored by Star Kabab 🌟"), merchant point acceptance at local shops, and a premium tier with instant withdrawals.
**Year 3:** Platform-level network effects — cross-community point interoperability, micro-lending, and integration with Bangladesh's emerging Open Banking APIs.
