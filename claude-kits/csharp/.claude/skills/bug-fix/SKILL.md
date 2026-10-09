---
name: bug-fix
description: Reproduce-first bug fixing workflow for this .NET project - capture the symptom, find the root cause, write a failing regression test, apply the minimal fix, verify. Use for any bug report, exception, wrong API response or failing test.
---

# Bug fix workflow

1. **Understand**: state expected vs actual, the endpoint or feature, and the input that triggers it.
2. **Locate**: Grep the exception message or symbol. For messy failures, use the `debugger` agent.
3. **Reproduce in a test**: write the smallest failing test (unit first; integration if the bug is in EF, DI, model binding or middleware). Run it and confirm it fails for the right reason.
4. **Root cause**: explain in 1-3 sentences, with file:line. Fix the cause, not the symptom.
5. **Fix**: make the minimal change. If the fix needs a schema change, add a new migration. Never edit an applied one.
6. **Verify**: the regression test passes, the tests of the touched project pass, and `dotnet build -warnaserror` is clean.
7. **Report** with `templates/bug-report.md`, then suggest `/review` and `/commit`.
