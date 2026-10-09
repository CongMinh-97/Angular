---
name: angular-review
description: Structured review of uncommitted changes or a branch in this Angular project against the project checklist (correctness, security, performance, Angular conventions, tests). Use when asked to review code, a diff, a branch or a PR.
---

# Code review

1. Scope: `git diff --stat` (uncommitted) or `git diff <base>...HEAD --stat` (branch). For more than about 15 files, review per folder and keep notes short.
2. Delegate the read-heavy pass to the `code-reviewer` subagent so the full diff stays out of the main context. Pass the base ref if there is one.
3. Check against `references/checklist.md`.
4. Every finding needs file:line, a concrete failure scenario and a fix. Verify before reporting. Drop speculation.
5. Report with `templates/report.md`. Blocking findings first.
6. If the user asks for fixes: fix the blocking findings first, run the specs of the touched folders and typecheck, then summarise.
