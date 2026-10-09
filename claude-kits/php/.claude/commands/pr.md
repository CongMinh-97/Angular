---
description: Prepare a pull request - verify, review, then draft title and body
argument-hint: "[base-branch, default main]"
allowed-tools: Bash(git:*), Bash(php artisan test:*), Bash(./vendor/bin/phpstan:*), Bash(./vendor/bin/pint:*), Bash(gh pr create:*), Read, Grep, Glob
---

Base: $ARGUMENTS (default `main`)
Commits: !`git log --oneline main..HEAD 2>/dev/null | head -30`

1. Run `php artisan test --compact && ./vendor/bin/phpstan analyse --no-progress && ./vendor/bin/pint --test`. Stop on the first failure.
2. Run `/review` against the base and resolve the blocking findings.
3. Draft the PR: a Conventional title, then Summary, Routes and contract changes, Migrations, How to test, and Tests added.
4. Show me the draft. Run `gh pr create` only after I confirm.
