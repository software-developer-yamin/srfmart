## Deferred from: code review of 1-4-role-based-navigation-api-access-control.md (Sat May 16 2026)

- **Hardcoded Links** [apps/web/src/components/layout/bottom-nav.tsx:14]: Navigation components use hardcoded "/dashboard" strings. Deferred as future-proofing for i18n/base-path changes is out of scope.
- **Dashboard Header Availability** [apps/web/src/app/dashboard/page.tsx:9]: Potential for headers() to fail in certain Next.js environments. Deferred as this is a pre-existing pattern.
## Deferred from: code review of 1-5-admin-user-search-role-management.md (Sat May 16 2026)
- Missing CSRF Protection [apps/server/src/routes/users.ts:1]: Pre-existing architectural issue; needs a global API security strategy rather than a per-route fix.
