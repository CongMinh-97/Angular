---
paths:
  - "**/*.php"
---

# PHP code rules (PSR-12, Laravel style)

- `declare(strict_types=1);` at the top of every file. Type every property, parameter and return. Use `?Type` or union types instead of docblock-only types.
- Use `final class` by default for services, actions and controllers. Use `readonly` properties and promoted constructor properties for injected dependencies.
- Inject dependencies through the constructor. Facades are fine in controllers and jobs; in services and actions, prefer injected contracts so they can be tested.
- Use backed enums (`enum Status: string`) instead of class constants for fixed sets, and cast them on the model.
- Throw specific exceptions (`ModelNotFoundException`, a domain exception with a render method) instead of returning `false` or `null` for errors. Never silence errors with `@`.
- Use the `Carbon`/`now()` helpers, and freeze time in tests with `$this->travelTo()`.
- No `dd()`, `dump()`, `var_dump()` or `ray()` left in code.
- Logging: `Log::info('Order created', ['order_id' => $id])`, with context arrays. Never log passwords, tokens or full request bodies.
