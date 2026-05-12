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

A: Srfmart uses a server-authoritative ledger system. This means your balance isn't just a number on your screen—it's backed by a cryptographically secure history of every point ever granted or moved. Even if someone tried to "spoof" their app, the server would instantly detect the mismatch and flag the account. Combined with mandatory OTP for registration and human-verified payouts, your value is protected by multiple layers of defense.

### Q: Why do I need a referral to join?

A: Srfmart is a high-trust community. By requiring a referral, we ensure that every member is connected to the network through a real relationship. This drastically reduces spam, fake accounts, and fraudulent activity, making the ecosystem more stable and valuable for everyone.

### Q: How long does a withdrawal take?

A: To maintain the highest level of security, every withdrawal request is manually reviewed by a moderator. This "concierge" approach typically takes between 2 to 24 hours. While we prioritize speed, we will never sacrifice the human-in-the-loop verification that keeps the system fraud-free.

---

## Internal FAQ

### Q: How do we prevent "Double Spending" or race conditions in point transfers?

A: We implement MongoDB multi-document transactions at the database level. Every point transfer is an atomic operation: the user's balance is deducted and the recipient's balance is increased in a single, unbreakable transaction. If any part of the process fails, the entire transaction is rolled back, ensuring the ledger always balances to zero.

### Q: What prevents a user from creating 100 accounts to bypass the daily point cap?

A: Our security suite includes device fingerprinting and IP clustering detection. If multiple registrations originate from the same device or network within a short window, they are flagged for admin review. Furthermore, the referral requirement acts as a natural "Proof of Humanity"—if one user refers 100 bots, the entire chain is easily identified and pruned.

---

## The Verdict

{Concept strength assessment — what's forged in steel, what needs more heat, what has cracks in the foundation.}

<!-- coaching-notes-stage-1 -->
- **Concept Type**: Community Reward Ecosystem (High-Trust).
- **Assumptions**: Users value security and trust over instant automated payouts; Referral-only model will maintain quality without stifling growth.
- **Key Findings**: MongoDB transactions and Event-Sourced ledger are the non-negotiable tech foundations.
- **User Context**: Focus on bKash/Nagad/Rocket as primary "exit" points for digital value.
