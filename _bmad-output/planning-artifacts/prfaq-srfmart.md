---
title: "PRFAQ: srfmart"
status: "Drafting"
created: "2026-05-12"
updated: "2026-05-12"
stage: "Stage 2: The Press Release"
inputs: 
  - "docs/Srfmart_Point_system.md"
  - "_bmad-output/planning-artifacts/product-brief-srfmart.md"
  - "_bmad-output/planning-artifacts/product-brief-srfmart-distillate.md"
---

# Srfmart Launches Bangladesh’s First "Trust-First" Digital Reward Ecosystem

## Community members can now earn, track, and securely convert loyalty points into real MFS value with a referral-only concierge wallet.

**DHAKA, May 12, 2026** — Srfmart today announced the launch of its exclusive Point Wallet, a secure digital ledger designed to transform community participation into tangible rewards. Built on a foundation of high-security referral architecture, the platform solves the problem of opaque and insecure reward distribution by providing a transparent, admin-verified bridge between digital points and major Mobile Financial Services (MFS) like bKash, Nagad, and Rocket.

Until now, community leaders in Bangladesh struggled to distribute rewards fairly or track loyalty without complex spreadsheets or insecure tools. Users often felt disconnected from the value they helped create, with no clear way to verify their balance or request payouts without friction. The risk of hacking and account takeovers meant that any digital point system was often more liability than asset.

Srfmart changes this by putting security at the center of the user journey. Every user is vouched for by an existing member, and every transaction is backed by a server-authoritative, atomic ledger. For the first time, users can see exactly how their community value grows and withdraw that value with total confidence through a "concierge" manual verification process that eliminates automated fraud.

> "Our vision was to create a digital space where trust is the primary currency. By combining a referral-only model with a secure, admin-backed payout system, we've built a platform where every point has real weight and every user is a verified partner in our community's success."
> — Yamin, Founder of Srfmart

### How It Works

For a new user, the journey begins with a trusted referral. After receiving an invitation, members register using only their mobile number, secured by a robust OTP verification system. Once inside, the wallet serves as their command center.

1.  **Receive**: Points are distributed centrally by the admin, appearing instantly in the user's dashboard with a clear history of when and why they were granted.
2.  **Monitor**: Users can track their daily earning caps and view their real-time balance on a polished, mobile-first interface.
3.  **Transfer**: To convert points to value, users simply transfer them back to an admin or moderator account within the app.
4.  **Withdraw**: Users fill out a simple withdrawal form, selecting their preferred MFS provider (bKash, Nagad, or Rocket) and entering their recipient number.
5.  **Verify**: A dedicated moderator reviews the request in a secure queue. Once verified, the payout is processed manually, ensuring a human-in-the-loop security check for every BDT sent.

> "I finally have a way to see my community contribution turned into something real. The referral system makes me feel safe knowing who else is on the platform, and the withdrawal to my bKash account was seamless and verified."
> — Arefin, Early Community Member

### Getting Started

Access to the Srfmart Point Wallet is currently by invitation only. Prospective users should reach out to an existing Srfmart member to receive a referral link. Once registered, users are immediately eligible for point distributions and can begin exploring the high-trust ecosystem today.

---

## Customer FAQ

### Q: How do I know my points are safe from hackers?
A: Srfmart uses a server-authoritative ledger system. This means your balance isn't just a number on your screen—it's backed by a cryptographically secure history of every point ever granted or moved. Combined with mandatory OTP for registration and human-verified payouts, your value is protected by multiple layers of defense.

### Q: Why do I need a referral to join?
A: Srfmart is a high-trust community. By requiring a referral, we ensure that every member is connected through a real relationship. This drastically reduces spam and fraud, making the ecosystem more stable for everyone.

### Q: How long does a withdrawal take?
A: To maintain maximum security, every request is manually reviewed. This "concierge" approach typically takes 2 to 24 hours. We prioritize security to keep the system fraud-free.

### Q: What if I send points to the wrong moderator number?
A: Our UI prevents manual entry of moderator numbers—you select from a list of verified officials. If a mistake occurs, our admin team can verify the transaction on the immutable ledger and perform a manual adjustment.

### Q: Why use Srfmart instead of just using bKash directly?
A: bKash is for money; Srfmart is for *community value*. Srfmart allows community leaders to reward loyalty and participation in ways a standard bank can't. We act as the "Rewards Layer" that turns your community activity into tangible value in your bKash wallet.

---

## Internal FAQ

### Q: How do we prevent "Double Spending" or race conditions?
A: We implement MongoDB multi-document transactions. Every point transfer is an atomic operation: the user's balance is deducted and the recipient's balance is increased in a single, unbreakable transaction. If any part fails, the entire process rolls back.

### Q: How do we handle the "Scale Bottleneck" of manual withdrawals?
A: In the MVP phase (target 100-200 users), one moderator can handle the daily volume. As we scale, we will implement "Auto-Approve" thresholds for small, low-risk amounts and use AI-driven fraud detection to assist moderators.

### Q: How do we mitigate regulatory risk in Bangladesh?
A: We position Srfmart as a "Community Reward Point" platform, not a financial service. Points are rewards for community participation, not e-money. Payouts are processed through existing licensed MFS (bKash/Nagad), ensuring we stay on the "Rewards Layer" rather than the "Banking Layer."

### Q: What prevents "Point Inflation" if we run out of BDT reserves?
A: The Admin dashboard includes a "Liquidity Planner." Before distributing points, the admin sees a "Potential Payout" forecast. This ensures that the points created are always aligned with the available BDT reserves in the community trust account.

---

## The Verdict

**Concept Strength: STRONG**

*   **Forged in Steel**: The referral-only access and atomic ledger provide a rock-solid security foundation. The focus on bKash/Nagad/Rocket as exit points matches the local market perfectly.
*   **Needs More Heat**: The UI must include a "Withdrawal Status Timeline" to manage user expectations during the manual review period.
*   **Cracks in Foundation**: The long-term point-to-BDT conversion sustainability must be clearly documented in the community guidelines to avoid "bank run" scenarios.

<!-- coaching-notes-stage-1 -->
- **Concept Type**: Community Reward Ecosystem (High-Trust).
- **Assumptions**: Users value security/trust over instant payouts; Referral-only model will maintain quality.
- **Key Findings**: MongoDB transactions and Event-Sourced ledger are the non-negotiable foundations.
- **User Context**: Focus on bKash/Nagad/Rocket as primary exit points.
