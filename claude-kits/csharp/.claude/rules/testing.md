---
paths:
  - "tests/**"
  - "**/*Tests.cs"
  - "**/*Test.cs"
---

# Test rules (xUnit + FluentAssertions + NSubstitute)

- Mirror the source path: `src/X.Application/Orders/CreateOrderHandler.cs` → `tests/X.UnitTests/Orders/CreateOrderHandlerTests.cs`.
- Name tests `Method_State_ExpectedResult` (e.g. `Handle_EmailAlreadyExists_ThrowsConflict`), and lay out each body as Arrange / Act / Assert separated by blank lines.
- One behaviour per test. Use `[Theory]` + `[InlineData]` or `[MemberData]` for input variations.
- Unit tests: substitute interfaces (`Substitute.For<IOrderRepository>()`). For EF-heavy handlers, use the EF InMemory provider or SQLite in-memory. Never use a real database or the network.
- Integration tests: `WebApplicationFactory<Program>` + Testcontainers (or SQLite). Each test owns its data, with no order dependence.
- Assert with FluentAssertions (`result.Should().BeEquivalentTo(expected)`, `await act.Should().ThrowAsync<ConflictException>()`).
- Use builders or `AutoFixture` for test data, and shared fixtures in `tests/*/Common/`. Inject a `FakeTimeProvider` for time.
- Patterns: `.claude/skills/dotnet-testing/references/patterns.md`.
