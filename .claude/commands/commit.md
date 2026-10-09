---
description: Create a conventional commit for the staged or all current changes
argument-hint: "[optional message hint]"
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git commit:*), Bash(git log:*)
---

Status: !`git status --short`
Diff summary: !`git diff HEAD --stat`
Recent style: !`git log --oneline -5`

Hint: $ARGUMENTS

1. If nothing is staged, stage the files that belong to this change. Skip stray files (logs, coverage, `.env*`) and tell me about them.
2. Write a Conventional Commit: `type(scope): summary` (feat, fix, refactor, test, docs, style, chore, perf). Keep the summary at 72 characters or less, in imperative mood. Add a short body with the why and any breaking change.
3. Commit. The pre-commit hook runs typecheck and the format check. If it blocks, fix the reported issue and commit again. Never use `--no-verify`.
