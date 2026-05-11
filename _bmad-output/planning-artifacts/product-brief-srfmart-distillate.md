---
title: "Product Brief Distillate: Srfmart Point Wallet"
type: llm-distillate
source: "product-brief-srfmart.md"
created: "2026-05-12"
purpose: "Token-efficient context for downstream PRD creation"
---

# Srfmart Point Wallet — Detail Pack

## Requirements Hints (from user specification)

- User registration via mobile number only — no email, no social login
- Referral code is mandatory at registration — no public sign-up
- OTP verification required — voice call fallback for accessibility
- Point transfer UI: simple form with amount field + send button → points go to admin/moderator directly
- Admin must see which phone number sent which points
- Withdrawal form: phone number field (admin's number where money goes) + dropdown (bKash/Nagad/Rocket) + send button
- Admin panel must have user search by phone number
- Admin can promote users to Moderator role
- Moderator can view all incoming point transfers (who sent, how much)
- Moderator manages withdrawal request queue
- User can ONLY transfer to admin and moderator — no other user
- Admin has a "distribute to all" section — enters total points, auto-splits equally among all users
- Admin sets daily per-user cap — excess points after cap return to admin account
- Remaining non-automated tasks handled manually by admin (user stated: "বাকি যেসব কাজ আছে সেগুলো ম্যানুয়ালি আমি নিজে করব")

## Security Requirements (from brainstorming + technical research)

- Server-authoritative balances — client display is decorative, mismatch triggers auto-flag
- Idempotency keys on all transaction endpoints — prevent API replay attacks
- Database row-level locking for point transfers — prevent race condition double-spend
- Device fingerprinting + IP clustering — detect mass fake account creation
- 7-day cooling period for new accounts before full feature access
- Secondary PIN + 48-hour device-change lock — prevent SIM swap OTP hijack
- Referral graph cycle detection — prevent A→B→C→A referral farming loops
- Activity requirement for point distribution eligibility (min 1 login/week)
- Cryptographically signed referral links (HMAC validation)
- All time calculations server-side (UTC+6) — client time never trusted
- Event-sourced ledger — balances computed from immutable events, not mutable records
- TLS 1.3 mandatory on all endpoints
- Rate limiting: sliding window at API gateway level

## Technical Context (from technical research)

- **Recommended stack:** TypeScript/Next.js (API + dashboards), PostgreSQL (ledger with RLS), Redis (distributed locking + caching)
- **Architecture pattern:** CQRS — separate write-heavy ledger from read-heavy transaction history
- **Database:** ACID-compliant PostgreSQL for ledger; sharding by user_id for scale
- **Caching:** Redis for session tokens, distributed locks (Redlock algorithm)
- **Messaging:** Consider Kafka/RabbitMQ for event-driven notifications
- **Auth:** OAuth 2.0 + JWT with short-lived tokens; consider FIDO2/WebAuthn for future biometric
- **Deployment:** AWS (RDS, EKS) + Cloudflare (WAF/DDoS) or Vercel for dashboards
- **Testing:** Playwright for E2E, Jest for unit, K6 for load testing
- **Build:** TurboRepo (already in project)

## Competitive Intelligence

- Bangladesh MFS market: 200M+ registered accounts, Tk 10T+ annual throughput
- bKash (~45% share) = lifestyle app positioning; Nagad (~35%) = cost leader; Rocket (~10%) = salary disbursement
- Barriers to entry for full MFS: Tk 50 crore regulatory capital + Trust Account requirement
- **Srfmart differentiator:** NOT competing as MFS — operates as points economy LAYER on top of existing MFS rails
- Customer pain points: hidden charges, transaction failures, phishing, ineffective dispute resolution
- Trust is the #1 adoption driver AND barrier — security failures are the biggest deterrent

## Regulatory Considerations

- If Srfmart handles actual money (not just points), may trigger MFS Regulations 2022 compliance
- If points have fixed monetary value → potential E-Money Issuer license requirement from Bangladesh Bank
- If points are "rewards" without guaranteed cash value → lighter regulatory burden
- KYC requirements: e-KYC via NID verification through Election Commission API (for future versions)
- AML/CFT: STR reporting to BFIU if classified as financial service
- Data privacy: Digital Security Act 2018 compliance for user financial data
- **Recommendation:** Launch as "community reward points" without guaranteed monetary value to minimize regulatory scope; assess licensing needs as volume grows

## Rejected/Deferred Ideas (with rationale)

- **Peer-to-peer transfers** — Deferred. Opens point laundering vector through mule accounts. Core spec explicitly restricts transfers to admin/moderator only.
- **Automated bKash API integration** — Deferred to v2. Manual moderator processing in v1 is simpler, cheaper, and provides human fraud checkpoint.
- **NID/biometric KYC** — Deferred. Adds friction to onboarding; referral-only model provides initial trust layer. Consider for tiered verification in v2.
- **Point staking/interest** — Deferred. Interesting (brainstorming #36) but adds financial product complexity and potential regulatory triggers.
- **Crypto-style tokenization** — Rejected. Regulatory risk in Bangladesh; unnecessary for current use case.
- **Multi-admin governance (3-of-5 signing)** — Deferred. Single admin model for v1; multi-admin for multi-tenant SaaS in v2.
- **Bangla voice commands** — Deferred. High development cost; low initial ROI for small user base.

## High-Priority Brainstorming Ideas for PRD Consideration

- **#7 Withdrawal Status Timeline** — Visual pipeline eliminates trust-killing black box (MVP candidate)
- **#11 Smart Distribution Calculator** — Real-time preview before admin confirms distribution (MVP candidate)
- **#22 One-Tap Moderator Verification** — Side-by-side user profile + audit + verify workflow (MVP candidate)
- **#68 Event-Sourced Ledger** — Foundation security architecture (MVP candidate)
- **#38 Tiered KYC** — Progressive verification for v2 (phone → NID → selfie)
- **#48 Auto-Approve Small Withdrawals** — Scale moderator operations in v2
- **#74 Sponsored Distributions** — Revenue model for v2 ("This batch sponsored by...")
- **#35 Public Payout Feed** — Trust signal showing recent successful withdrawals (v1 or v2)

## User Segments Detail

- **Segment 1: Urban Professional (18-35)** — bKash power user, comfortable with apps, expects polished UX, will be referral multiplier
- **Segment 2: Semi-Urban Worker (25-45)** — Uses Nagad for cost, may need Bangla-only interface, values transparency over features
- **Segment 3: Student/Gen-Z (16-24)** — Mobile-first, social media active, motivated by gamification and badges, high referral potential but low withdrawal value

## Open Questions

1. **Point-to-BDT conversion rate** — Is it fixed (e.g., 10 pts = ৳1) or variable? This has major regulatory implications.
2. **Source of point value** — Where does the money come from when users withdraw? Admin purchases? Business revenue? This determines sustainability.
3. **Withdrawal fees** — Does Srfmart charge a fee, or is it free? Who absorbs the bKash/Nagad transfer cost?
4. **Multi-community vision** — Is this for ONE community (Yamin's own), or intended as a platform for many community leaders?
5. **Referral depth** — Does the referrer earn anything when their referral joins? Or is referral purely an access gate?
6. **Point expiry** — Do unused points expire? Brainstorming suggested 1%/day after 60 days idle — needs decision.
7. **Moderator compensation** — Are moderators paid in points? Separate compensation? Volunteer?

## Scope Signals from User

- "বাকি যেসব কাজ আছে সেগুলো ম্যানুয়ালি আমি নিজে করব" — User expects to handle some operations manually, suggesting lean v1 is acceptable
- Focus on security was emphasized multiple times — anti-hacking and OTP bypass prevention are non-negotiable
- Withdrawal channels are specifically bKash, Nagad, Rocket — no bank transfer needed
- Admin distributes points, not an automated earning system — this is a distribution platform, not a task/earn platform
