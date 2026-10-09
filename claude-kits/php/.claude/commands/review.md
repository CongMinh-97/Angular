---
description: Review uncommitted changes (or a branch vs base) with the project checklist
argument-hint: "[base-branch]  empty = uncommitted changes"
allowed-tools: Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(./vendor/bin/phpstan:*), Bash(php artisan test:*), Bash(composer audit:*)
---

Base: $ARGUMENTS
Changed files: !`git status --short | head -40`

Use the `php-review` skill: run the `code-reviewer` agent (plus `security-reviewer` in parallel if the diff touches auth, policies, routes, raw queries, Blade `{!! !!}`, uploads or `composer.json`). Merge both into the report template. Do not edit files unless I ask for fixes.
