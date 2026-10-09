---
description: Review uncommitted changes (or a branch vs base) with the project checklist
argument-hint: "[base-branch]  empty = uncommitted changes"
allowed-tools: Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(dotnet build:*), Bash(dotnet test:*), Bash(dotnet list:*)
---

Base: $ARGUMENTS
Changed files: !`git status --short | head -40`

Use the `dotnet-review` skill: run the `code-reviewer` agent (plus `security-reviewer` in parallel if the diff touches auth, endpoints, raw SQL, uploads or `*.csproj`). Merge both into the report template. Do not edit files unless I ask for fixes.
