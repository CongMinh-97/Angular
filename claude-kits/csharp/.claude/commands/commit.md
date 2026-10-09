---
description: Create a conventional commit for the staged or all current changes
argument-hint: "[optional message hint]"
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git commit:*), Bash(git log:*)
---

Status: !`git status --short`
Diff summary: !`git diff HEAD --stat`
Recent style: !`git log --oneline -5`

Hint: $ARGUMENTS

1. If nothing is staged, stage the files of this change. Skip `bin/`, `obj/`, `*.user`, `TestResults/` and local settings, and tell me about them.
2. Write a Conventional Commit, `type(scope): summary` (72 characters or less, imperative), plus a short why-body. Mention any migration.
3. Commit. The pre-commit hook builds and checks format. If it blocks, fix the reported issue and commit again. Never bypass the hook.
