## Deferred from: code review of 1-1-extended-user-model-ledger-schema (2026-05-16)

- **Balance Race Conditions**: Balance updates using standard `save()` instead of `$inc` are unsafe. This PR only defines schema; the logic hardening belongs in the upcoming Ledger service.
- **Index Collision Pre-flight**: Existing `null` values in the production database might cause the `unique+sparse` index creation to fail. Requires a migration script check before deployment.
- **Hardcoded Role Enums**: Roles `user`, `moderator`, and `admin` are hardcoded in both `db` and `auth` packages. These should be centralized in a shared constants file during a future refactor.

## Deferred from: code review of 1-2-referral-gated-user-registration.md (2026-05-16)

- **Registration Race Condition**: Concurrent registration requests using the same email/code could bypass uniqueness if the database lacks a strict unique index on the referral code.

