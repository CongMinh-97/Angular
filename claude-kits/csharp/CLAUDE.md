# <ProjectName>: ASP.NET Core API

<!-- Fill in the placeholders in <angle brackets>, then delete this comment. Keep this file under ~100 lines. -->

.NET <8/9> Web API, Clean Architecture, EF Core (<SQL Server/PostgreSQL>), MediatR (CQRS), FluentValidation, xUnit + FluentAssertions + NSubstitute.

## Commands

| Task | Command |
| --- | --- |
| Build | `dotnet build --no-restore -v q` |
| All tests | `dotnet test --no-build -v q` |
| One test class or method | `dotnet test --no-build --filter "FullyQualifiedName~<ClassName>"` |
| Unit tests only | `dotnet test tests/<ProjectName>.UnitTests --no-build` |
| Coverage | `dotnet test --collect:"XPlat Code Coverage"` |
| Format check | `dotnet format --verify-no-changes --no-restore` |
| Run API | `dotnet run --project src/<ProjectName>.Api` |
| Add migration | `dotnet ef migrations add <Name> -p src/<ProjectName>.Infrastructure -s src/<ProjectName>.Api` |
| Everything before a PR | `dotnet build -warnaserror && dotnet test && dotnet format --verify-no-changes` |

Run the narrowest check that proves the change: a `--filter`ed test, then build. Run the full suite once at the end of a task.

## Layout

```text
src/
  <ProjectName>.Domain/          entities, value objects, domain events, enums. No dependencies.
  <ProjectName>.Application/     features/<Feature>/{Commands,Queries}/ handlers, DTOs, validators, interfaces
  <ProjectName>.Infrastructure/  EF Core DbContext, configurations, migrations, repositories, external services
  <ProjectName>.Api/             controllers or minimal-API endpoints, middleware, DI setup, appsettings
tests/
  <ProjectName>.UnitTests/       mirrors Application/Domain folders
  <ProjectName>.IntegrationTests/  WebApplicationFactory + Testcontainers or SQLite
```

Dependencies point inward: Api → Application → Domain. Infrastructure implements Application interfaces.

## Ground rules

- Nullable reference types on. Use `async`/`await` all the way down and pass `CancellationToken` through. Never call `.Result` or `.Wait()`.
- Controllers stay thin. Each one sends a command or query through MediatR and returns `ActionResult<T>`. Business rules live in Domain or handlers.
- Validation goes in FluentValidation validators. Errors return RFC 7807 `ProblemDetails` from the global exception middleware.
- Never return EF entities from the API. Map them to DTOs (records).
- Read queries use `AsNoTracking()` and project with `Select`. Do not load whole graphs.
- Secrets come from user-secrets or environment variables, never from `appsettings*.json` in git.

Detailed rules load automatically from `.claude/rules/` when you touch matching files.

## Workflows

| Need | Use |
| --- | --- |
| Feature or change | `/task <description>` |
| Bug | `/fix-bug <symptom>` |
| Review | `/review [base]` |
| Tests | `/test <file or folder>` |
| New CRUD feature | `/new-feature <Entity> [Prop:Type ...]` |
| Commit / PR | `/commit`, `/pr` |

## Working style

- Read only the files the task needs. Grep or Glob first, then read ranges. Never read `bin/`, `obj/`, `*.Designer.cs` or migration snapshots.
- Hand broad exploration, reviews and long test runs to subagents so their output stays out of the main context.
- When a build or test fails, report the first error (file, line, code) and the failing test name, not the whole log.
