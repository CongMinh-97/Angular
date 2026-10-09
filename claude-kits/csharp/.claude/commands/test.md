---
description: Write or expand xUnit tests for a file or folder, then run them
argument-hint: <file or folder>  (empty = files changed since last commit)
---

Target: $ARGUMENTS
Changed source files: !`git diff --name-only HEAD -- 'src/**/*.cs' | head -20`

If the target is empty, use the changed files above. Hand the work to the `test-engineer` agent (one per independent project or folder, in parallel). Then run `dotnet test -v q` once and report: tests added, pass/fail counts, and production bugs found (do not fix them without asking).
