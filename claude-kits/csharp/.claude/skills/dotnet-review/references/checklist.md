# Review checklist (.NET / ASP.NET Core / EF Core)

## Correctness
- [ ] Null handling matches nullable annotations; no unjustified `!`
- [ ] async all the way: no `.Result`/`.Wait()`, no `async void` (except event handlers), `CancellationToken` passed to I/O
- [ ] Validators cover every request field; error responses are ProblemDetails with the correct status
- [ ] Pagination bounded (pageSize max); sorting whitelist (no arbitrary property names)
- [ ] DI lifetimes correct (no scoped service captured in a singleton)

## Data
- [ ] Reads `AsNoTracking` + projection; no N+1; paging in the database
- [ ] One `SaveChangesAsync` per command; transaction for multi-aggregate writes
- [ ] Migrations: new rather than edited; destructive ops called out; indexes for new filters
- [ ] Concurrency (rowversion) where lost updates matter

## Security
- [ ] `[Authorize]` + ownership checks; no IDOR
- [ ] No raw SQL concatenation; no secrets in config or code; no personal data or secrets in logs
- [ ] Entities not exposed; over-posting prevented by request records

## API contract
- [ ] REST verbs and status codes (201 + Location, 204, 404, 409)
- [ ] `ProducesResponseType` declared; breaking changes versioned

## Conventions
- [ ] Thin controllers; logic in handlers or domain; DTOs are records
- [ ] File-scoped namespaces; `Async` suffix; structured logging templates

## Tests
- [ ] New logic has tests; bug fix has a regression test
- [ ] Test names `Method_State_Expected`; no real database or network in unit tests; `TimeProvider` faked
