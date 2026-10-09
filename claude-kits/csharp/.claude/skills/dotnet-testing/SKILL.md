---
name: dotnet-testing
description: Write, expand or fix xUnit tests in this .NET project - MediatR handlers, FluentValidation validators, domain entities, services with substitutes, and API endpoints with WebApplicationFactory. Use when adding tests, raising coverage, or a test fails.
---

# .NET testing

1. Pick the pattern in `references/patterns.md`. Load only that section.
2. List behaviours first: happy path, each branch, validation, not-found or conflict, edge values.
3. Write the tests in the mirrored path under `tests/`. Name them `Method_State_Expected`, with an Arrange / Act / Assert layout.
4. Run only them: `dotnet test --no-build --filter "FullyQualifiedName~<TestClass>"` (build first if needed).
5. On failure, read the first assertion message. Decide whether the test or the code is wrong, and never weaken an assertion just to pass.
6. Coverage: `dotnet test --collect:"XPlat Code Coverage"`. Use ReportGenerator for HTML if it is installed.
