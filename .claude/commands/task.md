---
description: Implement a feature or change end-to-end - plan, build, test, review
argument-hint: <what to build or change>
---

Task: $ARGUMENTS

Current branch: !`git branch --show-current`
Uncommitted changes: !`git status --short | head -20`

Work in this order:

1. **Clarify**: if the request has a real ambiguity that changes the design, ask one round of questions. Otherwise state your assumptions in one line and go.
2. **Plan**: find the affected files (Grep/Glob, or the `Explore` agent for broad searches). For more than about 3 files or any new module, write a short plan (files + change per file + tests) before editing. For a new CRUD page, follow the `crud-module` skill.
3. **Implement**: follow CLAUDE.md and the rules that load for each folder. Reuse `@ui`, `app-data-table`, existing services and models.
4. **Test**: add or update specs next to every changed piece of logic (`angular-testing` skill). Run only those specs, then `npm run typecheck`.
5. **Review**: run the `code-reviewer` agent on the diff and fix its blocking findings.
6. **Finish**: run `npm run verify` once. Report the changed files (one line each), the tests added, and how to check the change in the browser (route + steps). Do not commit unless asked.
