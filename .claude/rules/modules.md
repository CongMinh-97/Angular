---
paths:
  - "src/app/modules/**"
  - "src/app/_services/**"
  - "src/app/_models/**"
  - "src/app/_shared/routing/**"
  - "src/app/_shared/constants/menu.const.ts"
---

# Feature module rules

Reference implementation: `modules/layout-admin/user-admin/`.

```text
modules/layout-admin/<feature>-admin/
  <feature>-admin.route.ts        default export Routes (lazy loadComponent)
  <feature>-admin.component.{ts,html,scss}
  constants/<feature>-admin.const.ts   TableColumn[], FieldConfig[], option lists
  modals/<entity>-form-modal/          add/edit form in <ui-modal>
  utils/                               pure functions (+ .spec.ts)
```

- List pages use `<app-data-table>` with server-side `ListQuery` (page, pageSize, search, sortField, sortOrder, filters). Custom cells go in `<ng-template appCell="key">`. The actions column uses `fixed: 'right'`.
- Add and edit live in one modal component that takes the record (or `null` for create) and emits `saved`. Confirm deletes with `UiDialogService.confirm()`.
- Map server validation errors (e.g. 409 duplicate) onto the form control with `setErrors({ server: msg })` and do not toast them.
- A new endpoint needs the service method, the model type, a mock route in `_core/_helpers/mock-backend/` (and `mock-db.ts` seed data if needed), and a service spec.
- Register the page in `_shared/routing/admin-routing.ts` and `_shared/constants/menu.const.ts` (icon must exist in `_shared/constants/icons.ts`).
