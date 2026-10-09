---
description: Write or expand Pest/PHPUnit tests for a file or folder, then run them
argument-hint: <file or folder>  (empty = files changed since last commit)
---

Target: $ARGUMENTS
Changed source files: !`git diff --name-only HEAD -- 'app/**/*.php' 'routes/*.php' | head -20`

If the target is empty, use the changed files above. Hand the work to the `test-engineer` agent (one per independent area, in parallel). Then run `php artisan test --compact` once and report: tests added, pass/fail counts, and production bugs found (do not fix them without asking).
