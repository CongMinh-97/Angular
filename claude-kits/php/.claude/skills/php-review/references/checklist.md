# Review checklist (PHP 8 / Laravel)

## Correctness
- [ ] `strict_types`, full type hints; nullable handled
- [ ] FormRequest rules match the database (lengths, unique with ignore on update, exists)
- [ ] Casts for enums, dates, booleans, JSON; comparisons use the cast type
- [ ] Transactions around multi-model writes; jobs idempotent and safe to retry
- [ ] Pagination capped; sort and filter columns whitelisted

## Authorization and security
- [ ] Route middleware + Policy/Gate per action; ownership checked
- [ ] `$request->validated()` only; privileged fields not mass-assignable
- [ ] No raw SQL with input; no `{!! !!}` on user data; CSRF intact
- [ ] Uploads validated (mimes, max) and stored privately; no secrets; `env()` only in config

## Performance
- [ ] No N+1 (`with`, `withCount`); indexes for new where/order columns
- [ ] Large sets chunked or lazy; heavy work queued
- [ ] Cache invalidated where data changes

## Conventions
- [ ] Thin controllers; logic in Actions/Services; Resources for API output
- [ ] Migrations new, reversible; factories updated for new columns
- [ ] No `dd`/`dump`/`ray`; structured log context

## Tests
- [ ] Feature test per endpoint: success, validation, guest, forbidden
- [ ] Bug fix has a regression test; external services faked; time frozen where relevant
