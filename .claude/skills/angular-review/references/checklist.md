# Review checklist (Angular 18 / ng-zorro / Tailwind)

## Correctness
- [ ] Template bindings match the component API (input names, `model` vs `input`, output payloads)
- [ ] `@for` has a stable `track` (id, not `$index` for mutable lists)
- [ ] Signals: no writes inside `computed`; `effect` writes wrapped in `untracked` when needed
- [ ] Forms: validators match the UI (required mark), server errors mapped onto controls, submit disabled while saving
- [ ] Data table: server-side query params correct, page reset on filter or search change, actions column `fixed: 'right'`
- [ ] Null and empty states handled (empty list, failed load, missing optional fields)

## Security
- [ ] No `[innerHTML]` or `bypassSecurityTrust*` on user content without sanitising
- [ ] No secrets or tokens in source or environment files; `mockApi` false in prod
- [ ] Guards on new protected routes; `returnUrl` stays internal

## Performance
- [ ] Subscriptions cleaned up (`takeUntilDestroyed`, `toSignal`, or one-shot HTTP)
- [ ] No heavy work or method calls in templates; derived values use `computed`
- [ ] Heavy libraries (chart.js, ckeditor) only imported in lazy routes
- [ ] Search inputs debounced; no N+1 requests in loops

## Conventions (CLAUDE.md, .claude/rules)
- [ ] Standalone, `inject()`, `input()`/`output()`/`model()`, new control flow
- [ ] `@ui` kit used over raw nz-*; forms in modal, not drawer
- [ ] `maxChars` not `maxlength` on ui-*; no validator-named inputs
- [ ] Colours via tokens; no Tailwind-utility class names on components
- [ ] Path aliases; no cross-feature imports
- [ ] New page registered in admin-routing + menu; new icon in `icons.ts`; new endpoint in mock backend

## Tests
- [ ] New logic has a spec next to it; bug fixes have a regression spec
- [ ] Specs assert behaviour, not implementation; no real timers; storage cleaned
