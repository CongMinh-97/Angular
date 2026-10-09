---
paths:
  - "database/**"
  - "app/Models/**"
---

# Database and Eloquent rules

- Migrations: one concern each, with a reversible `down()`. Add indexes for foreign keys and filtered or sorted columns. Use `foreignId()->constrained()->cascadeOnDelete()` (or restrict) explicitly.
- Never modify a migration that has run elsewhere. Write a new one. Destructive changes (dropColumn, change type) must be called out to the user.
- Models declare `$fillable` (or `$guarded = []` only with FormRequest discipline agreed by the team), `casts()` for dates, enums, JSON and booleans, `$hidden` for secrets, and typed relations (`: BelongsTo`).
- Use query scopes for reused filters (`scopeActive`). Avoid logic in accessors that triggers queries.
- Prevent N+1: `with()` or `load()`. Turn on `Model::preventLazyLoading(! app()->isProduction())` in AppServiceProvider.
- Use `DB::transaction()` for multi-model writes, and `chunkById()` or `lazy()` for large datasets.
- Every model has a Factory with realistic states (`->admin()`, `->inactive()`).
