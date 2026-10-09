# Harbor: Angular 18 admin base

Angular 18 standalone app with ng-zorro-antd 18 (Ant Design), Tailwind 3 (preflight off), Chart.js 4 and CKEditor 5 (GPL). An in-browser mock API serves `/api/*` in dev.

## Commands

| Task | Command |
| --- | --- |
| Dev server | `npm start` (http://localhost:4200, login `admin@harbor.vn` / `password123`) |
| Unit tests (headless, one run) | `npm run test:ci` (set `CHROME_BIN` if Chrome isn't installed) |
| One spec file | `npx ng test --watch=false --browsers=ChromeHeadlessCI --include=src/app/path/to/x.spec.ts` |
| Coverage | `npm run test:coverage` (writes `coverage/`) |
| Typecheck (app + specs) | `npm run typecheck` |
| Format | `npm run format` / `npm run format:check` (Prettier, width 140, single quotes) |
| Everything before a PR | `npm run verify` |

Run the narrowest check that proves the change: a single spec, then `typecheck`. Run `npm run verify` once at the end of a task, not after every edit.

## Layout

Folders starting with `_` hold shared code; `modules/` holds features, grouped by layout.

```text
src/app/
  _core/_helpers/      interceptors (token → error → mock), guard/, mock-backend/
  _layouts/            admin-layout/ shell + components/ (aside, header)
  _models/             general/, layout-admin/ (interfaces only)
  _services/           auth.service.ts, layout-admin/<entity>.service.ts
  _shared/             components/ (data-table, dynamic-form, chart, rich-text-editor, ui/ kit), constants/, routing/
  _store/              global.store.ts (signals)
  modules/
    auth/              auth.route.ts, login/
    layout-admin/      <feature>-admin/ = <feature>-admin.route.ts + component + constants/ + modals/ + utils/
    design-system/     /components and /ui-kit demo pages
src/testing/           spec helpers and fixtures
```

Path aliases: `@core/*` `@helpers/*` `@guards/*` `@layouts/*` `@models/*` `@services/*` `@shared/*` `@store/*` `@modules/*` `@ui` `@environments/*`. Use them instead of deep relative imports.

## Ground rules

- Use standalone components, `inject()`, signals, `input()`, `output()` and `model()`, and the `@if`/`@for` control flow. Do not use NgModules or constructor injection in new code.
- Build UI from the `@ui` kit (`ui-input`, `ui-select`, `button[ui-button]`, `ui-modal`, ...) and `app-data-table`. Use raw `nz-*` components only when the kit has no equivalent.
- Add and edit forms open in a modal (`modals/<entity>-form-modal`), never a drawer. In tables, the actions column uses `fixed: 'right'`.
- Use `maxChars`, not `maxlength`, on ui-input and ui-textarea. `maxlength` would also attach Angular's MaxLengthValidator.
- Colours come from CSS tokens in `src/styles/_tokens.scss`, used as `var(--jade-600)` or Tailwind `bg-jade-600`. Never hard-code hex values in components.
- Add a new page in three places: the module folder, one line in `_shared/routing/admin-routing.ts`, and one entry in `_shared/constants/menu.const.ts`.
- Keep the mock backend (`_core/_helpers/mock-backend/`) in sync when you add an endpoint.

Detailed rules load automatically from `.claude/rules/` when you touch matching files.

## Workflows

| Need | Use |
| --- | --- |
| Feature or change request | `/task <description>` |
| Bug | `/fix-bug <symptom or issue>` |
| Review current changes | `/review` (runs the `code-reviewer` agent) |
| Write or expand tests | `/test <file or folder>` |
| New CRUD page | `/new-module <entity>` |
| Commit | `/commit` |

## Working style

- Read only the files the task needs. Search with Grep or Glob first, then read the relevant ranges. Do not open `package-lock.json`, `dist/`, `.angular/` or `coverage/`.
- Hand broad exploration, reviews and long test runs to subagents (`Explore`, `code-reviewer`, `test-engineer`) so their output stays out of the main context.
- When a check fails, report the failing test name and the first relevant error lines, not the whole log.
- Prefer editing existing files over creating new ones. Match the surrounding code's naming and comment density.
