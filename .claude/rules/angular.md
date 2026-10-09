---
paths:
  - "src/app/**/*.ts"
  - "src/app/**/*.html"
---

# Angular code rules

## Components
- `standalone: true`, list only the imports the template uses. Use the `@if`, `@for (x of xs; track x.id)` and `@switch` control flow, never `*ngIf` or `*ngFor`.
- State: `signal()`, `computed()`, `effect()` only for side effects (storage, DOM). Inputs are `input()` or `input.required()`, outputs are `output()`, two-way bindings are `model()`.
- Use `booleanAttribute` or `numberAttribute` transforms for flag and number inputs so `<x disabled>` works.
- DI with `inject()` in field initialisers. No constructor parameters.
- Subscriptions in components: use `takeUntilDestroyed(this.destroyRef)`, or use `toSignal()`. A plain `.subscribe()` is only fine for one-shot HTTP calls triggered by a user action.
- Templates call no methods that do heavy work; derive values with `computed()`.
- Selectors: `app-*` for app components and `ui-*` for the kit (see the ui-kit rule).

## Routing
- Each module exports `default` Routes from `<feature>-admin.route.ts` and lazy-loads its component with `loadComponent`.
- Set `title: '<Page> · Harbor'` and `data: { breadcrumb: '<Page>' }` on page routes.
- Guards and resolvers are functions (`CanActivateFn`), placed in `_core/_helpers/guard/`.

## HTTP and services
- One service per entity in `_services/<layout>/`, `providedIn: 'root'`, base URL from `environment.apiUrl`.
- Services return typed Observables (`PaginatedResponse<T>` for lists) and never subscribe themselves.
- Do not show error toasts in services or components for generic failures. `errorInterceptor` already does that. Handle only the specific cases the UI needs (e.g. 409 shown on the field).
- Models are interfaces in `_models/<layout>/`. No classes, no logic.

## Imports
- Use path aliases (`@services/...`, `@ui`, `@shared/...`). Relative imports only within the same feature folder.
- Do not import from one feature module into another. Move shared code to `_shared/`, `_services/` or `_models/`.
