## Deferred from: code review (2026-05-13) (1-1-extended-user-model-ledger-schema.md)
- **Idempotency Key Usage**: While the field exists, the system context for how it's generated/used is missing in this diff.
- **Indentation Inconsistency**: Mass shift from spaces to tabs; deferred to project-wide lint fix to avoid noisy diffs.

## Deferred from: code review of 1-2-referral-gated-user-registration (2026-05-13)
- Inactive Referrer Check [packages/auth/src/index.ts:25]: The system validates code existence but not referrer status (active/deleted), as account status logic is not yet fully implemented.
- Points Initialization [packages/auth/src/index.ts:18]: Registration logic sets the referral link but does not yet initialize points balances or transactions, as this is scoped to Epic 2.
