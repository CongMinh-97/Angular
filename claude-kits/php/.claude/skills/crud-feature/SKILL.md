---
name: crud-feature
description: Scaffold a full CRUD resource in Laravel - migration, model, enum, factory, FormRequests, Policy, Action/Service, controller, API Resource or Blade views, routes, and feature tests. Use when asked to add a new resource, model, table, admin screen or CRUD API.
---

# New CRUD resource

Input: the model name (singular, PascalCase) and its fields. If the fields are missing, propose them and continue.

1. Find the closest existing resource (a controller + request + resource) and read it once as the reference.
2. Prefer the generators for boilerplate. They are cheaper than writing by hand:
   `php artisan make:model <M> -mfs --policy --requests --controller --api` (drop `--api` for Blade), then `php artisan make:resource <M>Resource`.
3. Fill in the files in `references/files.md`, in order, following the reference's style.
4. Register the routes and run `php artisan migrate` (local database only) and `php artisan route:list --path=<plural>`.
5. Write feature tests: index (paging, filter), store (success, validation, guest, forbidden), show, update, destroy. Use `test-engineer` for volume.
6. Verify: `php artisan test --compact`, phpstan on `app/`, `pint --test`. Report the new routes.
