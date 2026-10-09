---
name: dotnet-review
description: Structured review of uncommitted changes or a branch in this .NET project against the project checklist (correctness, async, EF Core, security, API contract, tests). Use when asked to review code, a diff, a branch or a PR.
---

# Code review

1. Scope: `git diff --stat` (uncommitted) or `git diff <base>...HEAD --stat`.
2. Delegate the read-heavy pass to the `code-reviewer` agent. If the diff touches auth, endpoints, raw SQL, uploads or packages, run `security-reviewer` in parallel.
3. Check against `references/checklist.md`. Every finding needs file:line, a scenario and a fix. Verify before reporting.
4. Report with `templates/report.md`.
