---
description: Implement a feature or change end-to-end - plan, build, test, review
argument-hint: <what to build or change>
---

Task: $ARGUMENTS

Branch: !`git branch --show-current`
Uncommitted: !`git status --short | head -20`

1. **Clarify**: ask only if an ambiguity changes the design. Otherwise state your assumptions in one line.
2. **Plan**: find the affected files (Grep/Glob, or the `Explore` agent). For more than about 3 files, a new entity or a schema change, write a short plan first (files, change per file, migration, tests). For a new resource, follow the `crud-feature` skill.
3. **Implement**: follow CLAUDE.md and the rules that load for each folder.
4. **Test**: add or update tests for every changed piece of logic (`php-testing` skill). Run only those with `php artisan test --compact --filter=...`.
5. **Review**: run the `code-reviewer` agent on the diff and fix its blocking findings.
6. **Finish**: run `php artisan test --compact`, `./vendor/bin/phpstan analyse --no-progress` and `./vendor/bin/pint --test` once. Report the changed files, the tests added, any migration, and how to try it (route + steps). Do not commit unless asked.
