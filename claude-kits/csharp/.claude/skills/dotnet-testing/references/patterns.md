# Test patterns

## 1. Command handler (unit, substitutes)
```csharp
public sealed class CreateUserHandlerTests
{
    private readonly IUserRepository _users = Substitute.For<IUserRepository>();
    private readonly IUnitOfWork _uow = Substitute.For<IUnitOfWork>();
    private readonly CreateUserHandler _sut;

    public CreateUserHandlerTests() => _sut = new CreateUserHandler(_users, _uow);

    [Fact]
    public async Task Handle_EmailAlreadyExists_ThrowsConflict()
    {
        _users.ExistsByEmailAsync("a@x.vn", Arg.Any<CancellationToken>()).Returns(true);

        var act = () => _sut.Handle(new CreateUserCommand("An", "a@x.vn"), CancellationToken.None);

        await act.Should().ThrowAsync<ConflictException>();
        await _uow.DidNotReceive().SaveChangesAsync(Arg.Any<CancellationToken>());
    }
}
```

## 2. Validator
```csharp
public sealed class CreateUserValidatorTests
{
    private readonly CreateUserValidator _sut = new();

    [Theory]
    [InlineData("", "a@x.vn", nameof(CreateUserCommand.Name))]
    [InlineData("An", "not-an-email", nameof(CreateUserCommand.Email))]
    public void Validate_InvalidInput_HasErrorFor(string name, string email, string property)
    {
        var result = _sut.TestValidate(new CreateUserCommand(name, email));
        result.ShouldHaveValidationErrorFor(property);
    }
}
```

## 3. Domain entity
Construct it through its factory or constructor, call the behaviour method, and assert the state and raised domain events. No mocks.

## 4. Query handler with EF (SQLite in-memory)
```csharp
await using var conn = new SqliteConnection("DataSource=:memory:");
await conn.OpenAsync();
var options = new DbContextOptionsBuilder<AppDbContext>().UseSqlite(conn).Options;
await using var db = new AppDbContext(options);
await db.Database.EnsureCreatedAsync();
db.Users.AddRange(UserBuilder.Many(15));
await db.SaveChangesAsync();

var result = await new ListUsersHandler(db).Handle(new ListUsersQuery(Page: 2, PageSize: 10), default);

result.Items.Should().HaveCount(5);
result.Total.Should().Be(15);
```
Prefer SQLite over the EF InMemory provider: it enforces relational constraints.

## 5. Endpoint (integration)
```csharp
public sealed class UsersApiTests(ApiFactory factory) : IClassFixture<ApiFactory>
{
    [Fact]
    public async Task Post_ValidUser_Returns201WithLocation()
    {
        var client = factory.CreateAuthenticatedClient();

        var response = await client.PostAsJsonAsync("/api/v1/users", new { name = "An", email = "an@x.vn" });

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        response.Headers.Location.Should().NotBeNull();
    }
}
```
`ApiFactory : WebApplicationFactory<Program>` swaps the database (Testcontainers or SQLite) and adds a test auth handler in `ConfigureWebHost`.

## 6. Time and randomness
Inject `TimeProvider`. In tests, use `FakeTimeProvider` (Microsoft.Extensions.TimeProvider.Testing) and call `Advance(...)`.
