---
description: Write or expand unit tests for a file or folder, then run them
argument-hint: <file or folder>  (empty = files changed since last commit)
---

Target: $ARGUMENTS
Changed source files: !`git diff --name-only HEAD -- 'src/**/*.ts' ':!**/*.spec.ts' | head -20`

If the target is empty, use the changed source files above.
Hand the work to the `test-engineer` agent (one agent per independent folder, in parallel when there are several). Each agent follows the `angular-testing` skill and runs only its own specs.
Then run `npm run test:ci` once and report: the specs added or changed, pass/fail counts, and any production bugs the tests exposed (do not fix them without asking).
