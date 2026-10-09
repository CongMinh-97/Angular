---
description: Review uncommitted changes (or a branch vs base) with the project checklist
argument-hint: "[base-branch]  e.g. main; empty = uncommitted changes"
allowed-tools: Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(npx tsc:*), Bash(npx ng test:*)
---

Base: $ARGUMENTS
Changed files: !`git status --short | head -40`

Use the `angular-review` skill. Run the `code-reviewer` agent on the change set: uncommitted changes, or `git diff $ARGUMENTS...HEAD` when a base is given.
If the diff touches auth, interceptors, guards, `[innerHTML]`, uploads or `package.json`, also run the `security-reviewer` agent in parallel.
Merge both reports into the `angular-review` report template. Do not edit files unless I ask for fixes.
