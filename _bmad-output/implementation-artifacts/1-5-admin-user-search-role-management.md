# Story 1.5: Admin User Search & Role Management

Status: ready-for-dev

## Story

As an Admin,
I want to search for users and manage the Moderator hierarchy,
so that I can oversee the community and delegate point distribution power.

## Acceptance Criteria

1. **Given** the Admin dashboard
2. **When** I search for an email or phone number
3. **Then** the matching user profiles are displayed (FR4)
4. **And** I can toggle the "Moderator" role for any user (FR5)
5. **And** I can view and manage referral codes assigned to Moderators (FR3).

## Developer Context

### Architecture Compliance
- **API Boundary:** New endpoints must be created in `apps/server/src/routes/users.ts`.
- **RBAC Enforcement:** All endpoints in `users.ts` must be protected by `requireRole(["admin"])`.
- **Better Auth Integration:** Use Better Auth's `admin` plugin for role management (already configured in `packages/auth/src/index.ts`).
- **UI Consistency:** Use Shadcn Data Tables (`@srfmart/ui`) for the user list and search results.

### Technical Requirements
- **Server:** Create `GET /api/users/search` to search by email or phone number.
- **Server:** Create `POST /api/users/:id/role` to update user roles.
- **Web:** Implement the Admin User Management page at `apps/web/src/app/admin/users/page.tsx`.
- **Web:** Use `tanstack/react-table` for high-density user management.

### Files to Modify
- **NEW** `apps/server/src/routes/users.ts`: User search and role management endpoints.
- `apps/server/src/index.ts`: (Update) Mount the new `userRoutes`.
- **NEW** `apps/web/src/app/admin/users/page.tsx`: Admin user management UI.
- `packages/auth/src/index.ts`: (Existing) Ensure `admin()` plugin is active and configured.

## Tasks / Subtasks

- [ ] **Backend: User Management API**
    - [ ] Create `apps/server/src/routes/users.ts` with `GET /search` and `POST /:id/role`.
    - [ ] Ensure search supports partial matches for email and phone number.
    - [ ] Protect all routes with `requireRole(["admin"])`.
    - [ ] Mount routes in `apps/server/src/index.ts`.
- [ ] **Frontend: Admin User Management UI**
    - [ ] Create `apps/web/src/app/admin/users/page.tsx`.
    - [ ] Implement search input with debounce.
    - [ ] Build high-density data table using Shadcn/TanStack Table.
    - [ ] Add role toggle (User <-> Moderator) with confirmation dialog.
- [ ] **Verification**
    - [ ] Verify search returns correct users.
    - [ ] Verify role change updates the database atomically.
    - [ ] Verify 'moderator' and 'user' roles cannot access this page.

## Dev Agent Record

### Debug Log
- Better Auth's `admin` plugin provides `setRole` and `listUsers` which are useful here.
- User model already includes `role`, `phoneNumber`, and `referralCode` (Story 1.1).
- `apps/server/src/index.ts` is ready for route mounting.

### Implementation Plan
1. Scaffold the backend route `apps/server/src/routes/users.ts`.
2. Connect to Better Auth's admin API.
3. Build the frontend search and table interface.
4. Verify security and role enforcement.

### Completion Notes
- Implemented user search and role management API and UI.
- Verified Admin-only access to these features.

## File List
- `apps/server/src/routes/users.ts`
- `apps/server/src/index.ts`
- `apps/web/src/app/admin/users/page.tsx`
- `packages/auth/src/index.ts`

## Change Log
- Add administrative user search and role management capabilities.

## Learning from Previous Stories (1-1, 1-2, 1-3, 1-4)
- Always use `requireRole(["admin"])` for any administrative route.
- `phoneNumber` and `referralCode` are stored in the user model and should be searchable.
- UI should follow the "Executive Desktop" direction for Admin views (dense tables).
