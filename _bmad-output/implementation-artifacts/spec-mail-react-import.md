---
title: 'Fix React import in VerificationEmail template'
type: 'bugfix'
created: '2026-05-17'
status: 'done'
route: 'one-shot'
---

# Fix React import in VerificationEmail template

## Intent

**Problem:** Rendering `VerificationEmail` threw `ReferenceError: React is not defined` because the legacy React Email compilation pipeline (or an older bundler) expected `React` to be globally defined or explicitly imported for JSX scope.

**Approach:** Added the missing `import * as React from "react";` import directly to the `verification.tsx` template so it successfully constructs JSX elements at runtime.

## Suggested Review Order

1. Read `packages/mail/src/templates/verification.tsx` — verify the import has been added and nothing else was broken.
