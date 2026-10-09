---
description: Prepare a pull request - verify, review, then draft title and body
argument-hint: "[base-branch, default main]"
allowed-tools: Bash(git:*), Bash(dotnet build:*), Bash(dotnet test:*), Bash(dotnet format:*), Bash(gh pr create:*), Read, Grep, Glob
---

Base: $ARGUMENTS (default `main`)
Commits: !`git log --oneline main..HEAD 2>/dev/null | head -30`

1. Run `dotnet build -warnaserror -v q && dotnet test -v q && dotnet format --verify-no-changes`. Stop on the first failure.
2. Run `/review` against the base and resolve the blocking findings.
3. Draft the PR: a Conventional title, then Summary, API changes (routes, contracts), Migrations, How to test, and Tests added.
4. Show me the draft. Run `gh pr create` only after I confirm.
