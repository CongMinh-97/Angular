---
paths:
  - "**/*.cs"
---

# C# code rules

- File-scoped namespaces matching the folder path. One public type per file.
- Use `record` for DTOs, commands, queries and value objects, and `sealed class` for handlers and services unless they are designed for inheritance.
- Use primary constructors or constructor injection with `private readonly` fields. Do not use the service locator (`IServiceProvider.GetService`) in business code.
- Async methods end in `Async`, return `Task`/`Task<T>` (`ValueTask` only on hot paths), and take `CancellationToken ct` as the last parameter.
- Nullable is enabled: no `!` null-forgiving operator without a comment explaining why it's safe. Use guard clauses (`ArgumentNullException.ThrowIfNull`).
- Use `ILogger<T>` with structured logging: `logger.LogInformation("Order {OrderId} created", id)`. No string interpolation in log templates, and never log secrets or personal data.
- Exceptions: throw domain-specific exceptions (`NotFoundException`, `ConflictException`). The middleware maps them to ProblemDetails. Do not catch and swallow `Exception`.
- Use LINQ for clarity. Avoid multiple enumeration of `IEnumerable`, and materialise once with `ToListAsync(ct)`.
- Prefer `DateTimeOffset` and inject `TimeProvider` instead of calling `DateTime.Now`.
