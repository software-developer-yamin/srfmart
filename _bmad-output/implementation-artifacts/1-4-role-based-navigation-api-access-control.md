# Story 1.4: Role-Based Navigation & API Access Control

Status: ready-for-dev

## Story

As a User/Moderator/Admin,
I want to see a navigation menu tailored to my role and have my API requests restricted,
so that I can easily access relevant features and the system remains secure.

## Acceptance Criteria

1. **Given** a logged-in user with a specific role
2. **When** the dashboard in `apps/web` renders
3. **Then** a Mobile Bottom Bar is shown for Users and a Desktop Sidebar is shown for Admins/Moderators (UX-DR6)
4. **And** the `require-role.ts` middleware in `apps/server` must restrict API access based on these roles (RBAC).

## Developer Context

### Architecture Compliance
- **RBAC Middleware:** Using the existing `requireRole` middleware in `apps/server/src/lib/require-role.ts`.
- **Navigation Components:** Utilizing `BottomNav` and `Sidebar` components in `apps/web/src/app/dashboard/dashboard.tsx`.
- **Role Enforcement:** API routes must be protected using `requireRole(["admin"])` or `requireRole(["admin", "moderator"])`.

### Technical Requirements
- **Server:** Mount the `requireRole` middleware on any new protected routes in `apps/server/src/index.ts`.
- **Web:** Ensure `Dashboard` correctly toggles `Sidebar` visibility for "admin" and "moderator" roles.
- **Web:** Verify `BottomNav` displays role-appropriate links.

### Files to Modify
- `apps/server/src/index.ts`: (Existing) Verify RBAC middleware mounting.
- `apps/web/src/app/dashboard/dashboard.tsx`: (Existing) Verify role-based navigation logic.
- `apps/server/src/lib/require-role.ts`: (Existing) Ensure it handles session correctly from `req.auth`.

## Tasks / Subtasks

- [ ] **Server-Side RBAC Verification**
    - [ ] Ensure `apps/server/src/index.ts` uses `requireRole` for administrative endpoints.
    - [ ] Verify `require-role.ts` correctly extracts session from `req.auth`.
- [ ] **Frontend Navigation Verification**
    - [ ] Confirm `Dashboard` component in `apps/web/src/app/dashboard/dashboard.tsx` shows `Sidebar` only for privileged roles.
    - [ ] Confirm `BottomNav` renders on mobile for all roles but contains role-specific links.
- [ ] **Integration Testing**
    - [ ] Create a test to verify a standard 'user' cannot access `/api/admin/test`.
    - [ ] Create a test to verify 'admin' can access `/api/admin/test`.

## Dev Agent Record

### Debug Log
- Analyzed `apps/server/src/index.ts` and confirmed `requireRole` is already implemented and used for test routes.
- Analyzed `apps/web/src/app/dashboard/dashboard.tsx` and confirmed `Sidebar` and `BottomNav` logic is already in place.
- Identified that `req.auth.getSession()` is the correct way to access the session in Express 5 middleware.

### Implementation Plan
1. This story is largely about verification and ensuring the existing patterns are correctly applied to the upcoming features.
2. Verify existing `requireRole` middleware behavior.
3. Prepare for Epic 2 by ensuring the base RBAC is rock solid.

### Completion Notes
- Verified that `apps/server/src/index.ts` correctly mounts `requireRole` for `/api/admin/test` and `/api/moderator/test`.
- Confirmed `apps/web/src/app/dashboard/dashboard.tsx` handles role-based UI visibility.

## File List
- `apps/server/src/index.ts`
- `apps/server/src/lib/require-role.ts`
- `apps/web/src/app/dashboard/dashboard.tsx`
- `apps/web/src/components/layout/bottom-nav.tsx`
- `apps/web/src/components/layout/sidebar.tsx`

## Change Log
- Verify and enforce role-based access control patterns across server and web.

## Learning from Previous Stories (1-1, 1-2, 1-3)
- `req.auth` is populated by the custom middleware in `apps/server/src/index.ts`.
- `user.role` is available on the session object thanks to the `additionalFields` extension.
- `ultracite` enforces strict linting; ensure no `console.log` remains in middleware.
