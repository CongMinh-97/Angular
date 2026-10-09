# Files for model `<M>` (table `<ms>`)

| # | Path | Notes |
| - | ---- | ----- |
| 1 | `database/migrations/xxxx_create_<ms>_table.php` | types, indexes, FKs, reversible |
| 2 | `app/Enums/<M>Status.php` | if the model has a status-like field |
| 3 | `app/Models/<M>.php` | `$fillable`, `casts()`, relations, scopes |
| 4 | `database/factories/<M>Factory.php` | realistic data + states |
| 5 | `app/Http/Requests/Store<M>Request.php`, `Update<M>Request.php` | rules + `authorize()` via policy |
| 6 | `app/Policies/<M>Policy.php` | viewAny/view/create/update/delete |
| 7 | `app/Actions/<M>/Create<M>.php` etc. (or `app/Services/<M>Service.php`) | business logic, transactions |
| 8 | `app/Http/Controllers/<M>Controller.php` | thin: request → authorize → action → resource |
| 9 | `app/Http/Resources/<M>Resource.php` | API shape (or Blade views in `resources/views/<ms>/`) |
| 10 | `routes/api.php` or `routes/web.php` | `Route::apiResource('<ms>', ...)` inside the auth group |
| 11 | `tests/Feature/<M>/<M>ControllerTest.php` | CRUD + validation + authz |
