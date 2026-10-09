---
paths:
  - "tests/**"
  - "database/factories/**"
---

# Test rules (Pest / PHPUnit)

- Feature tests for HTTP behaviour (`tests/Feature/<Area>/<Resource>Test.php`) use `RefreshDatabase` (or `LazilyRefreshDatabase`). Unit tests (`tests/Unit`) cover pure logic, with no framework boot where possible.
- Name each test as a sentence: `it('rejects duplicate emails')` / `test_store_rejects_duplicate_email`. Cover one behaviour per test.
- Build data with factories and states. Never depend on seeders or on data left by another test.
- Act as a user: `actingAs($user)`. Assert status plus body: `->assertCreated()->assertJsonPath('data.email', 'a@x.vn')`, `assertDatabaseHas`, `assertInvalid(['email'])`.
- Fake the outside world: `Http::fake()`, `Mail::fake()`, `Queue::fake()`, `Event::fake()`, `Storage::fake()`, `Notification::fake()`. Never touch the real network.
- Freeze time with `$this->travelTo(...)`. Use datasets (`->with([...])`) for input variations.
- Authorisation: every protected endpoint gets a "guest → 401/redirect" test and a "wrong user → 403" test.
- Patterns: `.claude/skills/php-testing/references/patterns.md`.
