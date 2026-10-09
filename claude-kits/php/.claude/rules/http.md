---
paths:
  - "app/Http/**"
  - "routes/**"
  - "app/Policies/**"
---

# HTTP layer rules

- Routes: resource routes (`Route::apiResource('users', UserController::class)`), named and grouped by middleware (`auth:sanctum`, `verified`). Every non-public route sits behind auth.
- Each write action has its own FormRequest (`StoreUserRequest`, `UpdateUserRequest`) with `rules()` and `authorize()` (delegating to the Policy).
- Authorise every action: `$this->authorize('update', $user)`, `Gate`, or `can:` middleware. Check ownership (IDOR).
- Return `UserResource`/`UserResource::collection($paginator)` for APIs. Never return models directly (hidden fields leak).
- Lists use `->paginate(min($request->integer('per_page', 15), 100))`, and sorting goes through a whitelist of columns.
- Status codes: 201 on create (`->response()->setStatusCode(201)`), 204 on delete, 422 from validation automatically.
- Web forms: CSRF is on (do not exclude routes without a reason) and inputs come back after errors with `old()`.
