# <ProjectName>: Laravel application

<!-- Fill in the placeholders in <angle brackets>, then delete this comment. Keep this file under ~100 lines. -->

PHP <8.2/8.3>, Laravel <11/12>, <MySQL/PostgreSQL>, <Blade + Livewire / Inertia + Vue / API only>. Tests run on Pest (PHPUnit underneath). Static analysis uses Larastan (PHPStan) and formatting uses Laravel Pint.

## Commands

| Task | Command |
| --- | --- |
| Install | `composer install` |
| All tests | `php artisan test --compact` (or `./vendor/bin/pest --compact`) |
| One test file or name | `php artisan test --compact --filter=<TestName>` / `php artisan test tests/Feature/UserTest.php` |
| Parallel | `php artisan test --parallel` |
| Coverage | `php artisan test --coverage --min=80` (needs Xdebug or PCOV) |
| Static analysis | `./vendor/bin/phpstan analyse --no-progress --error-format=raw` |
| Format | `./vendor/bin/pint` / check: `./vendor/bin/pint --test` |
| Migrate (local only) | `php artisan migrate` |
| Routes | `php artisan route:list --path=<prefix>` |

Run the narrowest check that proves the change: a `--filter`ed test, then phpstan on the touched paths. Run the full suite once at the end of a task.

## Layout

```text
app/
  Http/Controllers/     thin controllers (resource style)
  Http/Requests/        FormRequest validation + authorize()
  Http/Resources/       API Resources (response shape)
  Models/               Eloquent models (casts, relations, scopes)
  Services/ or Actions/ business logic, one public method per action
  Policies/             authorisation per model
  Enums/                backed enums
database/migrations/ factories/ seeders/
routes/web.php api.php
resources/views/        Blade (components in views/components)
tests/Feature/          HTTP and integration tests (RefreshDatabase)
tests/Unit/             pure logic
```

## Ground rules

- Use `declare(strict_types=1);`, typed properties, parameters and returns, and constructor property promotion.
- Controllers validate with a FormRequest, authorise with a Policy, call an Action or Service, and return a Resource or view. No queries or business rules in controllers.
- Write queries through Eloquent or the query builder only. Eager-load relations (`with()`) to avoid N+1. Never concatenate raw SQL.
- Mass assignment: declare `$fillable` on every model, and never use `$request->all()` in `create()`/`update()`. Use `$request->validated()`.
- Config goes through `config()`. `env()` is only allowed inside `config/*.php`. Never commit secrets.
- Never edit a migration that has run in any shared environment. Add a new one.

Detailed rules load automatically from `.claude/rules/` when you touch matching files.

## Workflows

| Need | Use |
| --- | --- |
| Feature or change | `/task <description>` |
| Bug | `/fix-bug <symptom>` |
| Review | `/review [base]` |
| Tests | `/test <file or folder>` |
| New CRUD resource | `/new-feature <Model> [field:type ...]` |
| Commit / PR | `/commit`, `/pr` |

## Working style

- Read only the files the task needs. Grep or Glob first, then read ranges. Never read `vendor/`, `composer.lock`, `bootstrap/cache/`, `public/build/` or whole log files. Grep logs for the error instead.
- Hand broad exploration, reviews and long test runs to subagents so their output stays out of the main context.
- When a test fails, report the test name and the first assertion or exception, not the whole output.
