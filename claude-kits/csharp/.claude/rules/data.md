---
paths:
  - "src/**/*.Infrastructure/**"
  - "src/**/Persistence/**"
  - "src/**/Migrations/**"
  - "src/**/*.Domain/**"
---

# Data and EF Core rules

- Configure entities with `IEntityTypeConfiguration<T>` classes (no data annotations on Domain entities). Set max lengths, required fields, indexes and the delete behaviour explicitly.
- Never edit an applied migration. Add a new one. Never hand-edit `*ModelSnapshot.cs`.
- Each migration does one thing and gets a descriptive name (`AddOrderStatusIndex`). Check the generated SQL with `dotnet ef migrations script` for destructive operations (DropColumn, AlterColumn type) and call them out.
- Reads: `AsNoTracking()`, project with `Select` to DTOs, paginate in the database (`Skip`/`Take` after `OrderBy`). Watch for N+1: use `Include` or projection instead of lazy loading.
- Writes: one `SaveChangesAsync(ct)` per command handler. Wrap multi-aggregate changes in a transaction.
- No raw SQL string concatenation. Use `FromSql($"...")` interpolation (parameterised) or LINQ.
- Domain entities protect invariants: private setters, factory or constructor validation, and behaviour methods (`order.Cancel()`) instead of public property setters.
