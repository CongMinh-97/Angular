# Harbor — Angular 18 admin base

A production-ready starting point for admin consoles: Angular 18 standalone components, Ant Design (ng-zorro 18) themed with a custom identity, Tailwind utilities, Chart.js, CKEditor 5 and a mock API so every screen works without a backend.

## Run it

```bash
npm install
npm start            # http://localhost:4200
```

Sign in with **admin@harbor.vn / password123** (or press **Fill in** on the login page).

```bash
npm run build        # production build → dist/angular-base
```

> The production build sets `mockApi: false` (`src/environments/environment.prod.ts`). Turn it on there if you want to deploy the demo without a backend.

## Folder structure

Shared code lives in folders starting with `_`; business code lives in `modules/`, grouped by layout.

```text
src/app/
├── app.component.ts · app.config.ts · app.routes.ts   # routes: /login + admin layout (lazy loadComponent)
├── _core/
│   └── _helpers/
│       ├── token.interceptor.ts      # Bearer token
│       ├── error.interceptor.ts      # 401 → login, other errors → toast
│       ├── guard/                    # auth.guard.ts, no-auth.guard.ts
│       └── mock-backend/             # in-browser /api for development (mock-backend.interceptor.ts, mock-db.ts)
├── _layouts/
│   └── admin-layout/                 # admin-layout.component.* (shell)
│       └── components/               # aside/ (sidebar menu), header/ (breadcrumb, search, notifications, user menu)
├── _models/
│   ├── general/                      # api-response.model.ts, auth.model.ts
│   └── layout-admin/                 # user.model.ts
├── _services/
│   ├── auth.service.ts
│   └── layout-admin/                 # user.service.ts
├── _shared/
│   ├── components/                   # chart, data-table, dynamic-form, logo, page-header, rich-text-editor, stat-card
│   │   └── ui/                       # UI kit (@ui): core/ forms/ display/
│   ├── constants/                    # icons.ts, menu.const.ts
│   └── routing/                      # admin-routing.ts (children of the admin layout)
├── _store/
│   └── global.store.ts               # sidebar collapsed, mobile menu (signals)
└── modules/
    ├── auth/                         # auth.route.ts, login/
    ├── layout-admin/
    │   ├── dashboard-admin/          # dashboard-admin.route.ts, dashboard-admin.component.*
    │   ├── user-admin/               # user-admin.route.ts, component, constants/, modals/user-form-modal/
    │   ├── import-user-admin/        # import-user-admin.route.ts, component, constants/, utils/csv.ts
    │   └── article-admin/            # article-admin.route.ts, component
    └── design-system/                # design-system.route.ts, ui-components/ (+ sections/), foundations/
```

Path aliases (`tsconfig.json`): `@core/*`, `@helpers/*`, `@guards/*`, `@layouts/*`, `@models/*`, `@services/*`, `@shared/*`, `@store/*`, `@modules/*`, `@ui`, `@environments/*`.

Adding a page: create `modules/layout-admin/<feature>-admin/` with `<feature>-admin.route.ts` and the component, then add one line to `_shared/routing/admin-routing.ts` and one menu entry to `_shared/constants/menu.const.ts`.

## What's inside

| Area | Where | Notes |
| --- | --- | --- |
| UI kit | `_shared/components/ui` (import from `@ui`) | Every control and display element, see below and on the **/components** page |
| Token interceptor | `_core/_helpers/token.interceptor.ts` | Adds `Authorization: Bearer …`; leaves `Content-Type` to HttpClient so uploads keep multipart boundaries |
| Error interceptor | `_core/_helpers/error.interceptor.ts` | 401 → sign out and redirect with `returnUrl`; other errors → toast |
| Mock backend | `_core/_helpers/mock-backend/` | Serves `/api/*` (login, users CRUD, bulk delete, import, image upload). Remove it from `app.config.ts` when the real API is ready |
| Guards | `_core/_helpers/guard/` | `authGuard` for the admin layout, `noAuthGuard` for `/login` |
| Data table | `_shared/components/data-table` | Always full width; long rows scroll inside the table while the action column stays pinned right. Server-side sort / filter / pagination, debounced search, column visibility, density, selection + bulk bar, custom cells via `<ng-template appCell="key">` |
| Form builder | `_shared/components/dynamic-form` | `buildForm(fields)` + `<app-dynamic-form>` renders ui-* controls from a field config |
| Rich text editor | `_shared/components/rich-text-editor` | CKEditor 5 (GPL, free plugins), image upload through HttpClient, custom "Insert date" button |
| Charts | `_shared/components/chart` | `<app-chart>` wrapper over Chart.js with the brand palette |

### UI kit (`@ui`)

Form controls, all usable three ways:

```html
<ui-input formControlName="email" label="Email" type="email" />   <!-- reactive form -->
<ui-input name="email" [(ngModel)]="email" label="Email" required />  <!-- template form -->
<ui-input [(value)]="query" type="search" [debounce]="300" (debounced)="load($event)" />  <!-- standalone -->
```

Inside a form the control reads its validators: the required mark appears automatically and the first error is shown once the field is touched or the form is submitted. Override messages per field with `[errorMessages]`, or app-wide with the `UI_ERROR_MESSAGES` token (e.g. for Vietnamese). Outside a form pass `[error]` yourself.

| Control | Value |
| --- | --- |
| `ui-input` (text, email, password, tel, url, search; icons, addons, clear, counter, debounce) | `string` |
| `ui-textarea` (autosize, counter) | `string` |
| `ui-number` (plain, thousands, currency, percent, unit) | `number` |
| `ui-select` (search, groups, icons, descriptions, remote search) | `T` |
| `ui-multi-select` (select all, create tags, max selected) | `T[]` |
| `ui-date-picker` (date, week, month, quarter, year, time, min/max, past/future) | `Date` |
| `ui-date-range-picker` (presets, max days) | `[Date, Date]` |
| `ui-time-picker` | `Date` |
| `ui-checkbox`, `ui-checkbox-group` (columns, select all) | `boolean`, `T[]` |
| `ui-radio-group` (default, button, card) | `T` |
| `ui-switch` | `boolean` |
| `ui-slider` (single or range) | `number \| [number, number]` |
| `ui-upload` (dropzone, button, image grid; type / size / count checks) | `UiUploadFile[]` |
| `ui-field` | Label + hint + error shell for your own controls |

Common inputs: `label`, `hint`, `tooltip`, `placeholder`, `size` (sm 30 / md 38 / lg 46 px), `layout` (vertical / horizontal), `required`, `disabled`, `readonly`, `error`, `errorMessages`, `inputId`. Validators for arrays and ranges: `minSelected`, `maxSelected`, `validDateRange`.

Display: `button[ui-button]` (8 variants, 3 sizes, icon, icon-only, loading, block), `ui-tag`, `ui-avatar` / `ui-avatar-group`, `ui-card`, `ui-alert`, `ui-empty`, `ui-modal` (form dialogs; Cancel/OK footer or custom), and `UiDialogService` (`confirm()` returning a Promise, toasts).

### Pages

- **/login**: split-screen sign-in
- **/dashboard**: KPI tiles and 11 chart types, recent orders, activity
- **/users**: CRUD template (table + add/edit **modal** + delete confirm + bulk delete + CSV export)
- **/import**: import flow (upload CSV → match columns → review with row validation → result)
- **/editor**: article composer with CKEditor, publishing options, cover image
- **/components**: every ui-* component with variants, states, API tables and copy-ready code, plus a live demo of the same controls in a reactive form, a template form and standalone
- **/ui-kit** (Foundations): colours, type, radius, elevation, control heights

## Theming

All colours are CSS variables in `src/styles/_tokens.scss`, which also overrides Ant Design's variable theme (`--ant-primary-*`). Tailwind's palette (`tailwind.config.js`) points at the same variables, so `bg-jade-600` and `var(--jade-600)` stay in sync. Change the tokens to rebrand.

| Token | Value | Use |
| --- | --- | --- |
| `--ink-950` | `#0F1324` | Sidebar, dark surfaces |
| `--jade-600` | `#0D8A74` | Primary actions, focus |
| `--coral-500` | `#F2643A` | Highlights, second chart series |
| `--violet-500` / `--amber-500` / `--sky-500` | | Further chart series |

Fonts: Plus Jakarta Sans (UI) and JetBrains Mono (IDs, codes), loaded in `src/index.html`.

## Adding a CRUD page

1. Add a service like `_services/layout-admin/user.service.ts` that accepts a `ListQuery`, and its model in `_models/layout-admin/`.
2. Describe columns (`TableColumn[]`, give the actions column `fixed: 'right'`) and form fields (`FieldConfig[]`) in the module's `constants/`.
3. Copy `modules/layout-admin/user-admin` (list page + `modals/user-form-modal`) and swap the service, columns and fields.
4. Add the route to `_shared/routing/admin-routing.ts` and the menu item to `_shared/constants/menu.const.ts`.

> Naming note: ui-input / ui-textarea use `maxChars`, not `maxlength`. An input named `maxlength` would also match Angular's built-in `MaxLengthValidator` directive and add a validator to the form control.
