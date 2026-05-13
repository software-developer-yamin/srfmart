---
title: 'Story 1.4: Role-Based Navigation & API Access Control'
type: 'feature'
created: '2026-05-13'
status: 'in-progress'
baseline_commit: '46b209b87278bfee5f8aac4d40ce9477deb35397'
context: ['{project-root}/_bmad-output/planning-artifacts/prd.md', '{project-root}/_bmad-output/planning-artifacts/ux-design-specification.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The application currently lacks role-based differentiation in the UI and enforcement at the API layer. Users, Moderators, and Admins all see the same interface, and sensitive endpoints are not protected by role-specific checks.

**Approach:** Implement a responsive navigation system that displays a Mobile Bottom Bar for standard Users and a Desktop Sidebar for Admins/Moderators (UX-DR6). Additionally, create and apply a `require-role` middleware to restrict API access based on the user's role (RBAC).

## Boundaries & Constraints

**Always:** Use the `role` field from the Better Auth session. Adhere to Tailwind CSS and Shadcn UI patterns for navigation components.

**Ask First:** If the proposed layout for the Desktop Sidebar significantly deviates from the existing header structure.

**Never:** hardcode roles in the UI components without using a centralized configuration or utility. Do not bypass the auth session for role checks.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| User Access | role: 'user' | Shows Mobile Bottom Bar; No Admin/Mod links | Access denied to /api/admin/* |
| Admin Access | role: 'admin' | Shows Desktop Sidebar with all management links | Full access |
| Unauthorized | No session | Redirect to /sign-in | 401 Unauthorized |
| Role Mismatch | role: 'user' calling admin API | 403 Forbidden | Return clear RBAC error |

</frozen-after-approval>

## Code Map

- `apps/web/src/components/layout/nav.tsx` -- New component for role-based navigation.
- `apps/web/src/app/(dashboard)/layout.tsx` -- Integration point for navigation.
- `apps/server/src/middleware/require-role.ts` -- New middleware for RBAC enforcement.
- `apps/server/src/routes/admin.ts` -- Example route requiring high-level role.
- `packages/auth/src/index.ts` -- Source of session/role definitions.

## Tasks & Acceptance

**Execution:**
- [ ] `apps/server/src/middleware/require-role.ts` -- Create middleware that validates `c.get('user').role` against required levels -- Ensure server-side RBAC.
- [ ] `apps/web/src/components/layout/mobile-nav.tsx` -- Implement Bottom Bar for 'user' role -- Mobile-first UX for community members.
- [ ] `apps/web/src/components/layout/sidebar.tsx` -- Implement Sidebar for 'admin'/'moderator' -- Professional tools for staff.
- [ ] `apps/web/src/app/(dashboard)/layout.tsx` -- Conditionally render `MobileNav` or `Sidebar` based on `useSession()` data -- Unify navigation strategy.

**Acceptance Criteria:**
- Given a logged-in user with 'user' role, when the dashboard renders, then the Mobile Bottom Bar is visible.
- Given a request to an admin-only endpoint, when a 'user' makes the request, then the server returns a 403 Forbidden.

## Design Notes

The `require-role` middleware should be Hono-compatible and typed using the inferred session user.

```typescript
export const requireRole = (roles: string[]) => {
  return createMiddleware(async (c, next) => {
    const user = c.get('user');
    if (!user || !roles.includes(user.role)) {
      throw new HTTPException(403, { message: 'Forbidden' });
    }
    await next();
  });
};
```

## Verification

**Commands:**
- `pnpm dlx ultracite check apps/web apps/server` -- expected: SUCCESS
- `pnpm test apps/server` -- expected: RBAC tests pass
