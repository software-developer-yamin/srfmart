# Graph Report - srfmart  (2026-05-12)

## Corpus Check
- 55 files · ~28,986 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 553 nodes · 597 edges · 46 communities (33 shown, 13 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `29967743`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_UI Layout & Header Components|UI Layout & Header Components]]
- [[_COMMUNITY_Auth Forms & Dashboard Pages|Auth Forms & Dashboard Pages]]
- [[_COMMUNITY_UI Core Utilities (Card, Checkbox, Label, Utils)|UI Core Utilities (Card, Checkbox, Label, Utils)]]
- [[_COMMUNITY_BMAD Customization Scripts|BMAD Customization Scripts]]
- [[_COMMUNITY_Theme & Global Providers|Theme & Global Providers]]
- [[_COMMUNITY_Database Models (Auth)|Database Models (Auth)]]
- [[_COMMUNITY_BMAD Config Scripts|BMAD Config Scripts]]
- [[_COMMUNITY_Core Application Architecture (Hono, Auth Client, Mongoose)|Core Application Architecture (Hono, Auth Client, Mongoose)]]
- [[_COMMUNITY_BMAD Documentation & Config|BMAD Documentation & Config]]
- [[_COMMUNITY_Server Entry Points|Server Entry Points]]
- [[_COMMUNITY_Proxy Logic|Proxy Logic]]
- [[_COMMUNITY_Logging (Evlog)|Logging (Evlog)]]
- [[_COMMUNITY_Auth Core (Packages)|Auth Core (Packages)]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config (Web)|PostCSS Config (Web)]]
- [[_COMMUNITY_Instrumentation|Instrumentation]]
- [[_COMMUNITY_Home Page|Home Page]]
- [[_COMMUNITY_DB Entry Points|DB Entry Points]]
- [[_COMMUNITY_Global Layout & Logging|Global Layout & Logging]]
- [[_COMMUNITY_Guidelines & README|Guidelines & README]]
- [[_COMMUNITY_Tsdown Config|Tsdown Config]]
- [[_COMMUNITY_Next Env Types|Next Env Types]]
- [[_COMMUNITY_PostCSS Config (UI)|PostCSS Config (UI)]]
- [[_COMMUNITY_Dashboard View|Dashboard View]]
- [[_COMMUNITY_UI Button Component|UI Button Component]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 29 edges
2. `UX Design Specification srfmart` - 12 edges
3. `Srfmart Point Wallet — Detail Pack` - 11 edges
4. `Core Principles` - 10 edges
5. `Core Principles` - 10 edges
6. `TEA Workflow Step Files` - 10 edges
7. `Design System Foundation` - 10 edges
8. `Srfmart Point System Product Requirements Document` - 10 edges
9. `Architecture Validation Results` - 10 edges
10. `Brainstorming Session: Srfmart Point System` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Hono Server Instance` --references--> `Better Auth Server Config`  [INFERRED]
  apps/server/src/index.ts → packages/auth/src/index.ts
- `Agent Guidelines` --conceptually_related_to--> `Project README`  [INFERRED]
  AGENTS.md → README.md
- `Card()` --calls--> `cn()`  [EXTRACTED]
  packages/ui/src/components/card.tsx → packages/ui/src/lib/utils.ts
- `CardHeader()` --calls--> `cn()`  [EXTRACTED]
  packages/ui/src/components/card.tsx → packages/ui/src/lib/utils.ts
- `CardTitle()` --calls--> `cn()`  [EXTRACTED]
  packages/ui/src/components/card.tsx → packages/ui/src/lib/utils.ts

## Hyperedges (group relationships)
- **BMAD Ecosystem** — bmad_manifest, tea_config, wds_config [INFERRED 0.95]

## Communities (46 total, 13 thin omitted)

### Community 0 - "UI Layout & Header Components"
Cohesion: 0.08
Nodes (28): Button(), buttonVariants, Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+20 more)

### Community 1 - "Auth Forms & Dashboard Pages"
Cohesion: 0.04
Nodes (45): Accessibility Considerations, Accessibility Strategy, Anti-Patterns to Avoid, Breakpoint Strategy, Button Hierarchy, Chosen Direction, Color System, Core User Experience (+37 more)

### Community 2 - "UI Core Utilities (Card, Checkbox, Label, Utils)"
Cohesion: 0.05
Nodes (41): AD1: Double-Entry Ledger via Mongoose Transactions, AD2: Upward-Only Transfer Topology, AD3: Escrow Pattern for Withdrawals, AD4: Idempotency Keys for Write Operations, AD5: Better Auth User Extension via `additionalFields`, AD6: Monorepo Alignment — Zero Structural Changes, API Endpoint Specification, Architectural Decisions (MVP Focus) (+33 more)

### Community 3 - "BMAD Customization Scripts"
Cohesion: 0.05
Nodes (39): Additional Requirements, Epic 1: Foundation, Identity & Security, Epic 1: Foundation, Identity & Security, Epic 2: Core Ledger & Admin Minting, Epic 2: Core Ledger & Admin Minting, Epic 3: Hierarchical Point Transfers, Epic 3: Hierarchical Point Transfers, Epic 4: Global Distribution & Daily Limits (+31 more)

### Community 4 - "Theme & Global Providers"
Cohesion: 0.06
Nodes (35): Authentication & User Management, Business Success, Compliance & Regulatory, Document Information, Executive Summary, Functional Requirements, Global Point Distribution, Integration & Reliability (Preparation for Phase 2) (+27 more)

### Community 5 - "Database Models (Auth)"
Cohesion: 0.06
Nodes (35): A — Adapt, Account Fraud, Action Planning, Bonus: Domain Pivot Ideas, Brainstorming Session: Srfmart Point System, Business/Monetization, C — Combine, Context Guidance (+27 more)

### Community 6 - "BMAD Config Scripts"
Cohesion: 0.07
Nodes (26): Additional Requirements & Constraints, Alignment Issues, Coverage Matrix, Coverage Statistics, Critical Issues Requiring Immediate Action, Document Inventory (Step 1), Epic Coverage Validation (Step 3), Epic Quality Review (Step 5) (+18 more)

### Community 7 - "Core Application Architecture (Hono, Auth Client, Mongoose)"
Cohesion: 0.12
Nodes (16): Community members can now earn, track, and securely convert loyalty points into real MFS value with a referral-only concierge wallet., Customer FAQ, Getting Started, How It Works, Internal FAQ, Q: How do I know my points are safe from hackers?, Q: How do we handle the "Scale Bottleneck" of manual withdrawals?, Q: How do we mitigate regulatory risk in Bangladesh? (+8 more)

### Community 8 - "BMAD Documentation & Config"
Cohesion: 0.12
Nodes (15): Add app-specific blocks, Add more shared components, Available Scripts, code:bash (pnpm install), code:bash (pnpm run dev), code:bash (npx shadcn@latest add accordion dialog popover sheet table -), code:tsx (import { Button } from "@srfmart/ui/components/button";), code:block5 (srfmart/) (+7 more)

### Community 9 - "Server Entry Points"
Cohesion: 0.12
Nodes (15): Async & Promises, Code Organization, Core Principles, Error Handling & Debugging, Framework-Specific Guidance, graphify, Modern JavaScript/TypeScript, Performance (+7 more)

### Community 10 - "Proxy Logic"
Cohesion: 0.13
Nodes (14): Async & Promises, Code Organization, Core Principles, Error Handling & Debugging, Framework-Specific Guidance, Modern JavaScript/TypeScript, Performance, Quick Reference (+6 more)

### Community 11 - "Logging (Evlog)"
Cohesion: 0.15
Nodes (12): 1. The Active Participant (End-User), 2. The Group Manager (Moderator), 3. The Platform Controller (Admin), Adoption Drivers, Customer Insights & Behavior Analysis, Interaction Patterns: The "Agent" Mental Model, Market Landscape: Community-Driven Economies, Market Research Scope Confirmation (+4 more)

### Community 12 - "Auth Core (Packages)"
Cohesion: 0.15
Nodes (12): Concurrency & Idempotency, Data Validation for Bangladeshi MFS, Database: MongoDB & Mongoose, Double-Entry Ledger Implementation, Implementation Approaches & Ledger Integrity, Integration Patterns & Withdrawal Management, Maker-Checker Workflow (Security), Manual Withdrawal Processing Queue (+4 more)

### Community 13 - "Next.js Config"
Cohesion: 0.27
Nodes (11): deep_merge(), _detect_keyed_merge_field(), extract_key(), find_project_root(), load_toml(), main(), _merge_arrays(), _merge_by_key() (+3 more)

### Community 14 - "PostCSS Config (Web)"
Cohesion: 0.17
Nodes (11): code:block1 (<workflow>/), Execution Rules (Summary), Modes, Notes, References, Standard Layout (per workflow), Step Naming Conventions, TEA Workflow Step Files (+3 more)

### Community 15 - "Instrumentation"
Cohesion: 0.17
Nodes (11): Competitive Intelligence, High-Priority Brainstorming Ideas for PRD Consideration, Open Questions, Regulatory Considerations, Rejected/Deferred Ideas (with rationale), Requirements Hints (from user specification), Scope Signals from User, Security Requirements (from brainstorming + technical research) (+3 more)

### Community 16 - "Home Page"
Cohesion: 0.17
Nodes (12): 1. User Model Extension (`packages/db/src/models/auth.model.ts`), 2. Transaction Model (`packages/db/src/models/transaction.model.ts`), 3. Withdrawal Request Model (`packages/db/src/models/withdrawal.model.ts`), 4. Idempotency Key Model (`packages/db/src/models/idempotency.model.ts`), AD7: Global Distribution Spillback Logic, API & Security Patterns, code:block2 (role: { type: String, enum: ['user', 'moderator', 'admin'], ), code:block3 (_id: String (auto)) (+4 more)

### Community 17 - "DB Entry Points"
Cohesion: 0.22
Nodes (5): geistMono, geistSans, metadata, Toaster(), ThemeProvider()

### Community 18 - "Global Layout & Logging"
Cohesion: 0.18
Nodes (11): Architectural Boundaries, Authentication & Authorization, code:text (srfmart/), code:block7 (apps/server/src/), code:block8 (apps/web/src/app/), Complete Project Directory Structure, Frontend Route Structure (`apps/web/src/app/`), Project Structure & Boundaries (+3 more)

### Community 19 - "Guidelines & README"
Cohesion: 0.2
Nodes (9): Executive Summary, Product Brief: Srfmart Point Wallet, Scope, Success Criteria, The Problem, The Solution, Vision, What Makes This Different (+1 more)

### Community 20 - "Tsdown Config"
Cohesion: 0.2
Nodes (10): 1.1 Design System Choice, 2.1 Defining Experience, 2.2 User Mental Model, 2.3 Success Criteria, 2.4 Novel UX Patterns, 2.5 Experience Mechanics, Customization Strategy, Design System Foundation (+2 more)

### Community 21 - "Next Env Types"
Cohesion: 0.22
Nodes (8): Account, accountSchema, Session, sessionSchema, User, userSchema, Verification, verificationSchema

### Community 22 - "PostCSS Config (UI)"
Cohesion: 0.22
Nodes (9): 1. The "Tap-to-Reveal" Balance Card, 2. The Locked Recipient Card, 3. Secure Numeric Keypad, 4. Escrow Status Indicator, Component Implementation Strategy, Component Strategy, Custom Components, Design System Components (Shadcn UI) (+1 more)

### Community 23 - "Dashboard View"
Cohesion: 0.22
Nodes (8): Anti-Fraud & Security Standards, Domain Overview: Digital Wallets in Bangladesh, Domain Research Scope Confirmation, Industry Analysis: Referral & Reward Economics, Point Economy Mechanics, Referral-Based Security & Trust, Research Report: domain, The MFS Landscape

### Community 24 - "UI Button Component"
Cohesion: 0.46
Nodes (7): deep_merge(), _detect_keyed_merge_field(), extract_key(), load_toml(), main(), _merge_arrays(), _merge_by_key()

### Community 25 - "Community 25"
Cohesion: 0.25
Nodes (8): 1. The Gated Onboarding Flow, 2. The Upward Transfer Flow (Core Experience), 3. The Withdrawal & Escrow Flow, code:mermaid (graph TD), code:mermaid (graph TD), code:mermaid (graph TD), Journey Patterns, User Journey Flows

### Community 26 - "Community 26"
Cohesion: 0.25
Nodes (8): Better Auth Server Config, Auth Data Models, Better Auth Client, Mongoose Connection, Hono Server Instance, Home Page, Sign In Form, Sign Up Form

### Community 27 - "Community 27"
Cohesion: 0.5
Nodes (4): BMAD Manifest, TEA Module Config, TEA Workflow README, WDS Module Config

## Knowledge Gaps
- **335 isolated node(s):** `identifyUser`, `app`, `nextConfig`, `config`, `{ register, onRequestError }` (+330 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `UX Design Specification srfmart` connect `Auth Forms & Dashboard Pages` to `Community 25`, `Tsdown Config`, `PostCSS Config (UI)`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `Architecture Decision Document (Codebase-Grounded Revision)` connect `UI Core Utilities (Card, Checkbox, Label, Utils)` to `Home Page`, `Global Layout & Logging`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `identifyUser`, `app`, `nextConfig` to the rest of the system?**
  _335 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Layout & Header Components` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Auth Forms & Dashboard Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `UI Core Utilities (Card, Checkbox, Label, Utils)` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `BMAD Customization Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._