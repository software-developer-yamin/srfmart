# Story 1.5: Admin User Search & Role Management

Status: ready-for-dev

## Story

As an Admin,
I want to search for users and manage the Moderator hierarchy,
So that I can oversee the community and delegate point distribution power.

## Acceptance Criteria

1. **Given** the Admin dashboard in `apps/web`
2. **When** I search for a user by email or phone number
3. **Then** the matching user profiles are displayed in a data table (FR4)
4. **And** I can toggle the "Moderator" role for any user (FR5)
5. **And** I can view and manage referral codes assigned to Moderators (FR3)
6. **And** all search and role update operations are performed via the Better Auth `admin` plugin (AD5)
7. **And** the UI uses Shadcn UI components (Table, Badge, Input) and follows the "Executive Desktop" design pattern (UX-DR6)

## Tasks / Subtasks

- [ ] **Server Route Implementation (NEW):**
    - [ ] Create `apps/server/src/routes/users.ts` to handle admin user operations.
    - [ ] Implement `GET /api/users/search` using `auth.api.listUsers`.
    - [ ] Implement `POST /api/users/:id/role` using `auth.api.setRole`.
- [ ] **Server Entry Point (UPDATE):**
    - [ ] Mount `userRoutes` at `/api/users` in `apps/server/src/index.ts`.
- [ ] **Web Admin Page (NEW):**
    - [ ] Create `apps/web/src/app/admin/users/page.tsx` for the user management interface.
    - [ ] Implement a search bar that queries the new `/api/users/search` endpoint.
    - [ ] Implement a data table using `@srfmart/ui/components/table` to display results.
- [ ] **Role Management Logic (NEW):**
    - [ ] Add a role toggle/select in the user table to change user roles between `user` and `moderator`.
    - [ ] Integrate with `authClient.admin.setRole` or the server API.
- [ ] **UX & Polish (UPDATE):**
    - [ ] Add `Badge` components for roles (e.g., Blue for Moderator, Gray for User).
    - [ ] Implement loading states using `Skeleton` components.
    - [ ] Ensure the layout follows the `Sidebar` pattern for Admins.

## Dev Notes

### Architecture & Patterns
- **Better Auth Admin Plugin (AD5):** Use `listUsers` for search and `setRole` for management.
- **RBAC:** Protect server routes with `requireRole(['admin'])`.
- **UX (UX-DR6):** Admin view should be dense and filterable ("Executive Desktop").
- **API Response:** Follow the `{ success: true, data: { ... } }` pattern.

### File Implementation Guardrails
- **`apps/server/src/routes/users.ts`:**
  - `GET /api/users/search`: Use `auth.api.listUsers` with `searchValue` and `searchField`.
  - `POST /api/users/:id/role`: Use `auth.api.setRole` to update the user's role.
- **`apps/web/src/app/admin/users/page.tsx`:**
  - Use `authClient.admin.listUsers` if calling directly from client, or `fetch` the server endpoint.
  - Use `@srfmart/ui/components/table` and `@srfmart/ui/components/badge`.

### Testing Standards
- Verify that only Admins can access the user management page.
- Verify that search works for both email and phone number.
- Verify that role changes are persisted in the database.

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.5]
- [Source: _bmad-output/planning-artifacts/architecture.md#AD5, #API & Security Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR6, #Component Strategy]

## Change Log
- 2026-05-13: Created story for Admin User Search & Role Management. Status: ready-for-dev.
