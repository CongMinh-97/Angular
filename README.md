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

## What's inside

| Area | Where | Notes |
| --- | --- | --- |
| HTTP interceptor | `core/interceptors/http.interceptor.ts` | Adds `Authorization: Bearer …`; leaves `Content-Type` to HttpClient so uploads keep multipart boundaries |
| Error interceptor | `core/interceptors/error.interceptor.ts` | 401 → sign out and redirect with `returnUrl`; other errors → toast |
| Mock backend | `core/mock/` | Interceptor that serves `/api/*` (login, users CRUD, bulk delete, import, image upload). Remove it from `app.config.ts` when the real API is ready |
| Guards | `core/guards/auth.guard.ts` | `authGuard` for the app shell, `guestGuard` for `/login` |
| Auth state | `core/services/auth.service.ts` | Signals; "Keep me signed in" chooses localStorage vs sessionStorage |
| App shell | `shared/components/layout` | Collapsible sidebar (remembered), breadcrumb, Ctrl K search focus, notifications, user menu, mobile drawer |
| Data table | `shared/components/data-table` | Server-side sort / filter / pagination, debounced search, column visibility, density, row selection + bulk bar, custom cells via `<ng-template appCell="key">` |
| Form builder | `shared/components/dynamic-form` | `buildForm(fields)` + `<app-dynamic-form>`; validators and error messages come from the field config |
| Rich text editor | `shared/components/rich-text-editor` | CKEditor 5 (GPL, free plugins only), image upload through HttpClient, custom "Insert date" button with its own icon, word count. Its stylesheet is a lazy bundle |
| Charts | `shared/components/chart` | `<app-chart type data options>` wrapper with brand theme and series palette |
| Stat card | `shared/components/stat-card` | KPI tile with delta and sparkline |

### Pages

- **/login**: split-screen sign-in, inline errors, password toggle
- **/dashboard**: KPI tiles and 11 chart types (area, doughnut, stacked bar, mixed bar + line, radar, polar area, pie, bubble, horizontal bar, scatter, multi-line), recent orders, activity
- **/users**: CRUD template (table + create/edit drawer + delete confirm + bulk delete + CSV export)
- **/import**: import flow template (upload CSV → match columns → review with row validation → result)
- **/editor**: article composer with CKEditor, publishing options, cover upload
- **/ui-kit**: palette, type scale, buttons, status, form controls, feedback

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

1. Add a service like `core/services/user.service.ts` that accepts a `ListQuery`.
2. Describe columns (`TableColumn[]`) and form fields (`FieldConfig[]`).
3. Copy `features/users` and swap the service, columns and fields.
4. Register the route as a child of the shell in `app.routes.ts`.
