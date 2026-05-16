# Story 1.5: Admin User Search & Role Management

Status: done

## Story

As an Admin,
I want to search for users and manage the Moderator hierarchy,
so that I can oversee the community and delegate point distribution power.

## Acceptance Criteria

1. **Given** the Admin dashboard
2. **When** I search for an email or phone number
3. **Then** matching user profiles (email, name, role, referral code, phone) are displayed (FR4)
4. **And** I can filter the list by role (Admin, Moderator, User) to manage the hierarchy
5. **And** I can toggle the "Moderator" role for any user using a secure confirmation dialog (FR5)
6. **And** I can view the unique referral code assigned to each Moderator (FR3)
7. **And** I can generate a new referral code for a Moderator if they don't have one

## Developer Context

### Architecture Compliance
- **API Strategy:** Leverage Better Auth `admin` plugin for role updates where possible. Custom search logic goes in `apps/server/src/routes/users.ts`.
- **RBAC Enforcement:** Protect all endpoints with `requireRole(["admin"])`.
- **UI Components:** Use Shadcn **Data Table** (built with `tanstack/react-table` and `@srfmart/ui/components/table`) and `@srfmart/ui/components/empty` for the management interface.
- **Data Table Features:** Implement sorting (by Email/Role), column visibility (to hide/show referral codes), and pagination (for NFR-PERF-1 compliance).
- **UX Requirements:** Implement 300ms debounce on search (UX-DR9) and use `packages/ui/src/components/skeleton.tsx` for loading states.

### Technical Requirements
- **Server:** `GET /api/users/search` - supports partial matches on `email` and `phoneNumber`. Must handle `null` phone numbers gracefully.
- **Server:** `POST /api/users/:id/role` - updates `user.role` using Better Auth `admin.setRole`.
- **Server:** `POST /api/users/:id/referral-code` - generates a unique `referralCode` for the user.
- **Web:** Page at `apps/web/src/app/admin/users/page.tsx` using `tanstack/react-table`.
- **Consistency:** Follow the "Executive Desktop" dense table pattern (Slate-900 headers).

### Files to Modify
- **NEW** `apps/server/src/routes/users.ts`: Admin search and role management endpoints.
- `apps/server/src/index.ts`: Mount `userRoutes` at `/api/users`.
- **NEW** `apps/web/src/app/admin/users/page.tsx`: Admin user management dashboard.
- `packages/auth/src/index.ts`: Verify `admin()` plugin is active for server-side role management.

## Tasks / Subtasks

- [x] **Backend: Admin User API**
    - [x] Create `apps/server/src/routes/users.ts`.
    - [x] Implement search with MongoDB `$or` for email and phone.
    - [x] Implement role toggle using `auth.api.setRole`.
    - [x] Implement referral code generation logic.
    - [x] Mount routes in `apps/server/src/index.ts` with `requireRole(["admin"])`.
- [x] **Frontend: User Management Dashboard**
    - [x] Create `apps/web/src/app/admin/users/page.tsx`.
    - [x] Implement search bar with `use-debounce`.
    - [x] Build sophisticated **Data Table** using `@srfmart/ui/components/table` and `tanstack/react-table` patterns (sorting, column visibility, and pagination).
    - [x] Add role toggle switch/dropdown with `AlertDialog` confirmation.
    - [x] Handle empty results with `@srfmart/ui/components/empty`.

### Review Findings

- [x] [Review][Decision] Missing Role Filter UI & Logic — AC 4 mandates role filtering, but the backend doesn't apply it and the frontend has no selector.
- [x] [Review][Decision] Moderator Role "Ghost Sessions" — Moderators are updated via direct DB calls instead of Better Auth admin plugin.
- [x] [Review][Decision] Hardcoded Roles — "admin", "moderator", and "user" are hardcoded throughout the stack.
- [x] [Review][Patch] ReDoS Vulnerability [apps/server/src/routes/users.ts:37]
- [x] [Review][Patch] Atomic Referral Generation [apps/server/src/routes/users.ts:187]
- [x] [Review][Patch] Unbounded Regex Search [apps/server/src/routes/users.ts:39]
- [x] [Review][Patch] Role Update Result Handling [apps/server/src/routes/users.ts:122]
- [x] [Review][Patch] Type Safety on Search Params [apps/server/src/routes/users.ts:22]
- [x] [Review][Patch] Table Body Map Guard [apps/web/src/app/admin/users/page.tsx:102]
- [x] [Review][Patch] Clipboard API Guard [apps/web/src/app/admin/users/page.tsx:280]
- [x] [Review][Patch] Forwarding Headers to Auth API [apps/server/src/routes/users.ts:109]
- [x] [Review][Patch] Backend Dynamic Sorting [apps/server/src/routes/users.ts:49]
- [x] [Review][Defer] Missing CSRF Protection [apps/server/src/routes/users.ts:1] — deferred, pre-existing strategy needed for entire API.

- [ ] **Verification**
    - [ ] Verify search handles `sparse` fields (phone/referral) without crashing.
    - [ ] Verify `admin` plugin correctly persists role changes to MongoDB.
    - [ ] Verify security: `user` and `moderator` roles must receive 403 Forbidden.

## Dev Agent Record

### Implementation Plan
- Implemented Admin User Search API with MongoDB regex search and pagination.
- Integrated Better Auth `admin.setRole` for secure role updates.
- Built a type-safe Admin Dashboard using TanStack Table with sorting and debounced search.
- Added role management with Moderator hierarchy support and secure confirmation dialogs.
- Automated referral code generation for Moderators and Admins.

### Learning from Previous Stories (1-1, 1-4)
- User fields like `phoneNumber` and `referralCode` are available in the session/user object but may be undefined.
- `requireRole` extracts the session via `req.auth.getSession()`.
- Use `sonner` for role-change success/error notifications.

### Completion Notes
- Backend API endpoints for user search, role management, and referral code generation are active.
- Frontend Admin Dashboard implemented with robust data table and search features.
- All code follows strict type-safety (no `any` or `@ts-ignore`).
- Verification checklist remaining for final manual/automated testing.

## Change Log
- Refined story to include Moderator hierarchy management and referral code visibility.
- Mandated use of existing UI components (Table, Empty, Skeleton).
- Clarified Better Auth admin plugin usage for role management.
