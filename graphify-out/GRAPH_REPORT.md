# Graph Report - .  (2026-05-12)

## Corpus Check
- Corpus is ~7,611 words - fits in a single context window. You may not need a graph.

## Summary
- 140 nodes · 201 edges · 25 communities (13 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 8,500 input · 1,500 output

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
- [[_COMMUNITY_DB Entry Points|DB Entry Points]]
- [[_COMMUNITY_Global Layout & Logging|Global Layout & Logging]]
- [[_COMMUNITY_Guidelines & README|Guidelines & README]]
- [[_COMMUNITY_Dashboard View|Dashboard View]]
- [[_COMMUNITY_UI Button Component|UI Button Component]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 29 edges
2. `Button()` - 7 edges
3. `authClient` - 6 edges
4. `_merge_arrays()` - 5 edges
5. `main()` - 5 edges
6. `DropdownMenuContent()` - 4 edges
7. `DropdownMenuItem()` - 4 edges
8. `Input()` - 4 edges
9. `Label()` - 4 edges
10. `_merge_arrays()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Hono Server Instance` --references--> `Better Auth Server Config`  [INFERRED]
  apps/server/src/index.ts → packages/auth/src/index.ts
- `Agent Guidelines` --conceptually_related_to--> `Project README`  [INFERRED]
  AGENTS.md → README.md
- `DropdownMenuSubTrigger()` --calls--> `cn()`  [EXTRACTED]
  packages/ui/src/components/dropdown-menu.tsx → packages/ui/src/lib/utils.ts
- `DropdownMenuSubContent()` --calls--> `cn()`  [EXTRACTED]
  packages/ui/src/components/dropdown-menu.tsx → packages/ui/src/lib/utils.ts
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  packages/ui/src/components/dropdown-menu.tsx → packages/ui/src/lib/utils.ts

## Hyperedges (group relationships)
- **BMAD Ecosystem** — bmad_manifest, tea_config, wds_config [INFERRED 0.95]

## Communities (25 total, 12 thin omitted)

### Community 0 - "UI Layout & Header Components"
Cohesion: 0.13
Nodes (14): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator() (+6 more)

### Community 1 - "Auth Forms & Dashboard Pages"
Cohesion: 0.19
Nodes (4): Button(), buttonVariants, Input(), authClient

### Community 2 - "UI Core Utilities (Card, Checkbox, Label, Utils)"
Cohesion: 0.27
Nodes (10): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), Checkbox() (+2 more)

### Community 3 - "BMAD Customization Scripts"
Cohesion: 0.27
Nodes (11): deep_merge(), _detect_keyed_merge_field(), extract_key(), find_project_root(), load_toml(), main(), _merge_arrays(), _merge_by_key() (+3 more)

### Community 4 - "Theme & Global Providers"
Cohesion: 0.22
Nodes (5): geistMono, geistSans, metadata, Toaster(), ThemeProvider()

### Community 5 - "Database Models (Auth)"
Cohesion: 0.22
Nodes (8): Account, accountSchema, Session, sessionSchema, User, userSchema, Verification, verificationSchema

### Community 6 - "BMAD Config Scripts"
Cohesion: 0.46
Nodes (7): deep_merge(), _detect_keyed_merge_field(), extract_key(), load_toml(), main(), _merge_arrays(), _merge_by_key()

### Community 7 - "Core Application Architecture (Hono, Auth Client, Mongoose)"
Cohesion: 0.25
Nodes (8): Better Auth Server Config, Auth Data Models, Better Auth Client, Mongoose Connection, Hono Server Instance, Home Page, Sign In Form, Sign Up Form

### Community 8 - "BMAD Documentation & Config"
Cohesion: 0.5
Nodes (4): BMAD Manifest, TEA Module Config, TEA Workflow README, WDS Module Config

## Knowledge Gaps
- **37 isolated node(s):** `identifyUser`, `app`, `nextConfig`, `config`, `{ register, onRequestError }` (+32 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Core Utilities (Card, Checkbox, Label, Utils)` to `UI Layout & Header Components`, `Auth Forms & Dashboard Pages`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `Button()` connect `Auth Forms & Dashboard Pages` to `UI Layout & Header Components`, `UI Core Utilities (Card, Checkbox, Label, Utils)`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `authClient` connect `Auth Forms & Dashboard Pages` to `UI Layout & Header Components`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `identifyUser`, `app`, `nextConfig` to the rest of the system?**
  _37 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Layout & Header Components` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._