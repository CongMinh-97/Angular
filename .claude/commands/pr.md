---
description: Prepare a pull request - verify, review, then draft title and body
argument-hint: "[base-branch, default main]"
allowed-tools: Bash(git:*), Bash(npm run verify), Bash(gh pr create:*), Read, Grep, Glob
---

Base: $ARGUMENTS (default `main`)
Commits: !`git log --oneline main..HEAD 2>/dev/null | head -30`

1. Run `npm run verify`. If it fails, stop and report the first failure.
2. Run `/review` against the base and resolve any blocking findings.
3. Draft the PR: a title in Conventional Commit style; a body with Summary (bullets), How to test (route + steps), Tests added, and Screenshots (placeholder for UI changes).
4. Show me the draft. Create it with `gh pr create` only after I confirm.
