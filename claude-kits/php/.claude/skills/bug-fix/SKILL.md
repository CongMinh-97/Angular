---
name: bug-fix
description: Reproduce-first bug fixing workflow for this PHP/Laravel project - capture the symptom, find the root cause, write a failing regression test, apply the minimal fix, verify. Use for any bug report, exception, wrong response, or failing test.
---

# Bug fix workflow

1. **Understand**: state expected vs actual, the route or page, the user role and the input.
2. **Locate**: Grep the exception or message, or grep the log for the last error. Do not read the whole log. For messy failures, use the `debugger` agent.
3. **Reproduce in a test**: write the smallest failing test (Feature for HTTP/DB behaviour, Unit for pure logic). Run it and confirm it fails for the right reason.
4. **Root cause**: explain in 1-3 sentences, with file:line. Fix the cause, not the symptom.
5. **Fix**: make the minimal change. Schema changes go in a new migration.
6. **Verify**: the regression test passes, the tests of the touched area pass, and phpstan plus `pint --test` are clean on the changed files.
7. **Report** with `templates/bug-report.md`, then suggest `/review` and `/commit`.
