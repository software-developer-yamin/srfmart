---
stepsCompleted: [1, 2]
inputDocuments: ['docs/Srfmart_Point_system.md']
workflowType: 'research'
lastStep: 2
research_type: 'domain'
research_topic: 'Srfmart Point-based Digital Wallet System'
research_goals: 'Research domain best practices for digital wallets, point distribution algorithms, referral systems, and security standards (anti-fraud, anti-hacking) within the Bangladeshi MFS context.'
user_name: 'Yamin'
date: '2026-05-12'
web_research_enabled: true
source_verification: true
---

# Research Report: domain

**Date:** 2026-05-12
**Author:** Yamin
**Research Type:** domain

---

## Domain Research Scope Confirmation

**Research Topic:** Srfmart Point-based Digital Wallet System
**Research Goals:** Research domain best practices for digital wallets, point distribution algorithms, referral systems, and security standards (anti-fraud, anti-hacking) within the Bangladeshi MFS context.

**Domain Research Scope:**

- **MFS Ecosystem in Bangladesh**: bKash, Nagad, Rocket patterns and user behaviors.
- **Referral Graph Economics**: How referral-only systems scale and prevent abuse.
- **Point Economy Best Practices**: Minting, burning, and distribution logic.
- **Security Standards**: Anti-fraud measures, NID-linked verification (e-KYC), and transaction monitoring.
- **Regulatory Compliance**: Understanding the boundaries between reward points and e-money.

**Scope Confirmed:** 2026-05-12

---

## Domain Overview: Digital Wallets in Bangladesh

### The MFS Landscape
Bangladesh is a global leader in Mobile Financial Services (MFS).
- **Dominant Players**: bKash (BRAC Bank), Nagad (Post Office), and Rocket (Dutch-Bangla Bank).
- **User Behavior**: Cash-in/Cash-out via agent networks is the primary mode of liquidity.
- **Transaction Types**: P2P (Peer-to-Peer), P2M (Peer-to-Merchant), and Bill Payments.

---

## Industry Analysis: Referral & Reward Economics

### Referral-Based Security & Trust
In the Bangladeshi context, community-based digital platforms often rely on **Trust Networks**. Srfmart's "Referral-Only" model (Admin -> Moderator -> User) mirrors traditional social structures:
1. **Gatekeeping**: Moderators act as "Know Your Customer" (KYC) proxies, ensuring that only legitimate users join the system.
2. **Accountability**: If a user is caught hacking or manipulating points, the referring Moderator is held accountable, incentivizing high-quality onboarding.

### Point Economy Mechanics
A sustainable point economy requires careful balance between **Minting** (Creation) and **Burning** (Redemption):
- **Controlled Supply**: Admin-only minting prevents hyper-inflation of points.
- **Upward-Only Liquidity**: Restricting P2P transfers ensures that all "real value" (points destined for withdrawal) must pass through a Moderator or Admin, allowing for manual risk assessment.
- **Global Distribution**: Equal distribution of points across a user base (Air-dropping) is a common pattern in 2026 to drive engagement, provided it is coupled with daily earn limits.

### Anti-Fraud & Security Standards
Digital wallets in Bangladesh face unique threats:
- **OTP Bypassing**: Attackers often use social engineering to trick users into sharing OTPs. Srfmart will mitigate this through server-side OTP validation and device fingerprinting.
- **Point Injection**: Database-level vulnerabilities could allow attackers to "increase" their balance. This is neutralized by a **Double-Entry Ledger** where balance is a summation of immutable transaction entries, rather than a single mutable field.
- **Sybil Attacks**: One person creating hundreds of accounts. The referral-only requirement and device-ID logging are the primary defenses here.

---
