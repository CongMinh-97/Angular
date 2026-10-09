# Files for entity `<e>` (feature folder `<e>-admin`)

| # | Path | From |
| - | ---- | ---- |
| 1 | `src/app/_models/layout-admin/<e>.model.ts` | `user.model.ts`: `<E>Record`, `<E>Payload`, reuse `ListQuery` |
| 2 | `src/app/_services/layout-admin/<e>.service.ts` | `user.service.ts`: list/create/update/remove/removeMany |
| 3 | `src/app/_services/layout-admin/<e>.service.spec.ts` | pattern 1 in angular-testing |
| 4 | `src/app/modules/layout-admin/<e>-admin/constants/<e>-admin.const.ts` | `TableColumn[]` (actions `fixed: 'right'`), `FieldConfig[]`, option lists |
| 5 | `src/app/modules/layout-admin/<e>-admin/modals/<e>-form-modal/<e>-form-modal.component.ts` | `user-form-modal`: `input<record \| null>`, `saved` output, 409 → `setErrors({ server })` |
| 6 | `src/app/modules/layout-admin/<e>-admin/<e>-admin.component.{ts,html,scss}` | `user-admin`: data-table, toolbar, bulk delete, confirm |
| 7 | `src/app/modules/layout-admin/<e>-admin/<e>-admin.route.ts` | `user-admin.route.ts` (title, breadcrumb, default export) |
| 8 | `src/app/_core/_helpers/mock-backend/*` | add routes + seed in `mock-db.ts` |
| 9 | `src/app/_shared/routing/admin-routing.ts` | `{ path: '<e>s', loadChildren: () => import('@modules/layout-admin/<e>-admin/<e>-admin.route') }` |
| 10 | `src/app/_shared/constants/menu.const.ts` | menu entry + icon |
