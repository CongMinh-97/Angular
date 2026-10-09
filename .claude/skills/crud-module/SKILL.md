---
name: crud-module
description: Scaffold a new CRUD admin page (list with data-table, add/edit modal, delete, service, model, mock API, route, menu, specs) following the user-admin reference. Use when asked to create a new management page, entity screen or module.
---

# New CRUD module

Input: the entity name (singular, e.g. `product`) and its fields. If fields are missing, propose them from the name and continue.

1. Read the reference once: `modules/layout-admin/user-admin/` (component, constants, modal), `_services/layout-admin/user.service.ts`, `_models/layout-admin/user.model.ts`. Do not re-read it per file.
2. Create the files listed in `references/files.md`, in that order. Copy the structure of user-admin. Rename, don't redesign.
3. Mock API: add `<entity>s` routes (list with search/sort/filter/paging, create, update, delete, bulk-delete) and seed data in `_core/_helpers/mock-backend/`.
4. Register: a route in `_shared/routing/admin-routing.ts` and a menu item in `_shared/constants/menu.const.ts`. Register any new icon in `_shared/constants/icons.ts`.
5. Tests: a service spec (each method's URL, verb and params) and a spec for any util. Use the `test-engineer` agent if there are many.
6. Verify: `npm run typecheck`, the new specs, `npm run build`. Report the route URL to open.
