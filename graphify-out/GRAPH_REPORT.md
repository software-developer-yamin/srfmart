# Graph Report - srfmart  (2026-05-12)

## Corpus Check
- 42 files · ~7,611 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 201 nodes · 257 edges · 29 communities (16 shown, 13 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `36d7d23c`
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
- [[_COMMUNITY_Tsdown Config|Tsdown Config]]
- [[_COMMUNITY_Next Env Types|Next Env Types]]
- [[_COMMUNITY_PostCSS Config (UI)|PostCSS Config (UI)]]
- [[_COMMUNITY_Dashboard View|Dashboard View]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 29 edges
2. `Core Principles` - 10 edges
3. `Core Principles` - 10 edges
4. `TEA Workflow Step Files` - 10 edges
5. `srfmart` - 8 edges
6. `Button()` - 7 edges
7. `authClient` - 6 edges
8. `Ultracite Code Standards` - 6 edges
9. `_merge_arrays()` - 5 edges
10. `main()` - 5 edges

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

## Communities (29 total, 13 thin omitted)

### Community 0 - "UI Layout & Header Components"
Cohesion: 0.12
Nodes (24): Button(), buttonVariants, Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+16 more)

### Community 1 - "Auth Forms & Dashboard Pages"
Cohesion: 0.2
Nodes (3): Input(), Label(), authClient

### Community 2 - "UI Core Utilities (Card, Checkbox, Label, Utils)"
Cohesion: 0.12
Nodes (15): Add app-specific blocks, Add more shared components, Available Scripts, code:bash (pnpm install), code:bash (pnpm run dev), code:bash (npx shadcn@latest add accordion dialog popover sheet table -), code:tsx (import { Button } from "@srfmart/ui/components/button";), code:block5 (srfmart/) (+7 more)

### Community 3 - "BMAD Customization Scripts"
Cohesion: 0.12
Nodes (15): Async & Promises, Code Organization, Core Principles, Error Handling & Debugging, Framework-Specific Guidance, graphify, Modern JavaScript/TypeScript, Performance (+7 more)

### Community 4 - "Theme & Global Providers"
Cohesion: 0.13
Nodes (14): Async & Promises, Code Organization, Core Principles, Error Handling & Debugging, Framework-Specific Guidance, Modern JavaScript/TypeScript, Performance, Quick Reference (+6 more)

### Community 5 - "Database Models (Auth)"
Cohesion: 0.16
Nodes (6): geistMono, geistSans, metadata, ModeToggle(), Toaster(), ThemeProvider()

### Community 6 - "BMAD Config Scripts"
Cohesion: 0.27
Nodes (11): deep_merge(), _detect_keyed_merge_field(), extract_key(), find_project_root(), load_toml(), main(), _merge_arrays(), _merge_by_key() (+3 more)

### Community 7 - "Core Application Architecture (Hono, Auth Client, Mongoose)"
Cohesion: 0.17
Nodes (11): code:block1 (<workflow>/), Execution Rules (Summary), Modes, Notes, References, Standard Layout (per workflow), Step Naming Conventions, TEA Workflow Step Files (+3 more)

### Community 8 - "BMAD Documentation & Config"
Cohesion: 0.22
Nodes (8): Account, accountSchema, Session, sessionSchema, User, userSchema, Verification, verificationSchema

### Community 9 - "Server Entry Points"
Cohesion: 0.46
Nodes (7): deep_merge(), _detect_keyed_merge_field(), extract_key(), load_toml(), main(), _merge_arrays(), _merge_by_key()

### Community 10 - "Proxy Logic"
Cohesion: 0.25
Nodes (8): Better Auth Server Config, Auth Data Models, Better Auth Client, Mongoose Connection, Hono Server Instance, Home Page, Sign In Form, Sign Up Form

### Community 11 - "Logging (Evlog)"
Cohesion: 0.5
Nodes (4): BMAD Manifest, TEA Module Config, TEA Workflow README, WDS Module Config

## Knowledge Gaps
- **81 isolated node(s):** `identifyUser`, `app`, `nextConfig`, `config`, `{ register, onRequestError }` (+76 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Layout & Header Components` to `Auth Forms & Dashboard Pages`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `Button()` connect `UI Layout & Header Components` to `Auth Forms & Dashboard Pages`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `authClient` connect `Auth Forms & Dashboard Pages` to `UI Layout & Header Components`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `identifyUser`, `app`, `nextConfig` to the rest of the system?**
  _81 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Layout & Header Components` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `UI Core Utilities (Card, Checkbox, Label, Utils)` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `BMAD Customization Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._