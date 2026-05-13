# Story 1.4: Role-Based Navigation & API Access Control

Status: done

## Story

As a User/Moderator/Admin,
I want to see a navigation menu tailored to my role,
so that I can easily access the features relevant to my responsibilities.

## Acceptance Criteria

1. **Given** a logged-in user with a specific role
2. **When** the dashboard in `apps/web` renders
3. **Then** a Mobile Bottom Bar is shown for Users and a Desktop Sidebar is shown for Admins/Moderators (UX-DR6)
4. **And** the `require-role.ts` middleware in `apps/server` must restrict API access based on these roles (RBAC)
5. **And** the `packages/auth/src/index.ts` must include the `admin` plugin to support role management

## Tasks / Subtasks

- [x] **Auth Configuration (UPDATE):**
    - [x] Update `packages/auth/src/index.ts` to include the Better Auth `admin` plugin (AC: 5)
    - [x] Ensure `user.additionalFields.role` is correctly configured (AC: 5)
- [x] **Server RBAC Implementation (NEW):**
    - [x] Create `apps/server/src/lib/require-role.ts` middleware (AC: 4)
    - [x] Middleware must verify session via Better Auth and check `user.role` (AC: 4)
- [x] **Web Navigation Components (NEW):**
    - [x] Create `apps/web/src/components/layout/bottom-nav.tsx` for mobile Users (AC: 3, UX-DR6)
    - [x] Create `apps/web/src/components/layout/sidebar.tsx` for Desktop Admin/Moderators (AC: 3, UX-DR6)
- [x] **Dashboard Integration (UPDATE):**
    - [x] Update `apps/web/src/app/dashboard/dashboard.tsx` to conditionally render navigation based on `session.user.role` (AC: 3)
    - [x] Ensure responsive breakpoints (Tailwind) hide/show navigation appropriately (AC: 3)
- [x] **API Protection (UPDATE):**
    - [x] Update `apps/server/src/index.ts` to prepare for route-level protection (AC: 4)

### Review Findings

1. **`decision-needed`** findings:
   - [x] [Review][Decision] Missing Navigation for Admin/Moderator on Mobile — The logic currently hides the Sidebar on mobile (`hidden md:flex`) and only renders the `BottomNav` for the `user` role. This leaves Admin and Moderator users with no way to navigate the application on mobile devices.
   - [x] [Review][Decision] Missing Role Field in Auth Schema — While the `admin` plugin is enabled, the `user.role` field is not explicitly defined in `additionalFields`. Better Auth requires this to extend the base schema for non-standard fields.

2. **`patch`** findings:
   - [x] [Review][Patch] Missing Session Middleware in Server [apps/server/src/index.ts]
   - [x] [Review][Patch] Information Leakage in Error Messages [apps/server/src/lib/require-role.ts]
   - [x] [Review][Patch] Hardcoded Server Port [apps/server/src/index.ts]
   - [x] [Review][Patch] Layout Padding Inconsistency [apps/web/src/app/dashboard/dashboard.tsx]
   - [x] [Review][Patch] Unsafe Logger Access in Middleware [apps/server/src/lib/require-role.ts]

3. **`defer`** findings:
   - [x] [Review][Defer] Magic Strings — Role names like "admin" and "moderator" are raw strings across multiple files. — deferred, pre-existing
   - [x] [Review][Defer] Type Casting — Use of (req as any) in the middleware bypasses TypeScript safety. — deferred, pre-existing

## Dev Notes

### Architecture & Patterns
- **RBAC (AD5):** Use the `admin` plugin for Better Auth. Roles are enforced via the `requireRole` middleware in the Express server.
- **UX (UX-DR6):** Role-Based Navigation. Use `session.user.role` to determine which layout to render.
- **Responsive Strategy:** Standard Users are mobile-first (Bottom Nav), while Admins/Moderators are desktop-first (Sidebar).

### File Implementation Guardrails
- **`packages/auth/src/index.ts` (UPDATE):**
  - Add `admin()` to the `plugins` array.
- **`apps/server/src/lib/require-role.ts` (NEW):**
  - Implement `requireRole(...allowedRoles)` middleware.
  - It should use `auth.getSession({ headers: req.headers })` to verify the session.
- **`apps/web/src/app/dashboard/dashboard.tsx` (UPDATE):**
  - Conditionally render the new navigation components.
- **`apps/server/src/index.ts` (UPDATE):**
  - Prepare for future route mounting (mounting dummy routes for transactions/withdrawals if necessary to test RBAC).

### Testing Standards
- Verify Users cannot access Moderator/Admin nav items.
- Verify API returns 403 Forbidden for unauthorized roles.
- Verify navigation correctly switches between Mobile (Bottom Bar) and Desktop (Sidebar) based on role and screen size.

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.4]
- [Source: _bmad-output/planning-artifacts/architecture.md#AD5, #API & Security Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR6, #Navigation Patterns]

## Dev Agent Record

### Agent Model Used
google/antigravity-gemini-3-flash

### Completion Notes List
- Configured Better Auth `admin` plugin in `packages/auth`.
- Implemented `requireRole` middleware in `apps/server` for RBAC.
- Created `BottomNav` component for mobile users.
- Created `Sidebar` component for desktop moderators and admins.
- Integrated role-based navigation into the `Dashboard` component with responsive design.
- Added tests for `requireRole` middleware and verified they pass.
- Mounted placeholder protected routes in `apps/server` to verify RBAC setup.

### File List
- `packages/auth/src/index.ts`
- `apps/server/src/lib/require-role.ts`
- `apps/web/src/components/layout/bottom-nav.tsx`
- `apps/web/src/components/layout/sidebar.tsx`
- `apps/web/src/app/dashboard/dashboard.tsx`
- `apps/server/src/index.ts`
- `apps/web/src/lib/auth-client.ts`
- `apps/server/tests/rbac.test.ts`

## Change Log
- 2026-05-13: Created story for Role-Based Navigation and API Access Control. Status: ready-for-dev.
- 2026-05-13: Implemented role-based navigation and RBAC middleware. Verified with tests. Status: review.
