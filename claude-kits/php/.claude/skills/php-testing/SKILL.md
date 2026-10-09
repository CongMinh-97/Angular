---
name: php-testing
description: Write, expand or fix Pest/PHPUnit tests in this Laravel project - feature tests for routes and controllers, FormRequest validation, policies, actions and services, models and scopes, jobs, mail and events with fakes. Use when adding tests, raising coverage, or a test fails.
---

# PHP testing

1. Pick the pattern in `references/patterns.md`. Load only that section.
2. List behaviours first: success, each important validation rule, guest and forbidden, not-found, side effects, edge values.
3. Write the tests (Feature or Unit), using factories and states.
4. Run only them: `php artisan test --compact --filter=<Name>`.
5. On failure, read the first assertion or exception. Decide whether the test or the code is wrong, and never weaken an assertion just to pass.
6. Coverage: `php artisan test --coverage` (needs PCOV or Xdebug).

If the project uses PHPUnit classes instead of Pest, the same patterns apply: `public function test_...(): void` and `$this->` assertions.
