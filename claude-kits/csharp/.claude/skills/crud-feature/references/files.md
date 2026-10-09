# Files for entity `<E>` (plural `<Es>`)

| # | Project | Path |
| - | ------- | ---- |
| 1 | Domain | `Entities/<E>.cs` (private setters, factory, behaviour methods) |
| 2 | Application | `<Es>/Dtos/<E>Dto.cs` (record) + mapping |
| 3 | Application | `<Es>/Queries/List<Es>Query.cs` (+ handler, paging/search/sort whitelist) |
| 4 | Application | `<Es>/Queries/Get<E>ByIdQuery.cs` (+ handler, NotFound) |
| 5 | Application | `<Es>/Commands/Create<E>Command.cs` (+ handler + validator) |
| 6 | Application | `<Es>/Commands/Update<E>Command.cs` (+ handler + validator) |
| 7 | Application | `<Es>/Commands/Delete<E>Command.cs` (+ handler) |
| 8 | Infrastructure | `Persistence/Configurations/<E>Configuration.cs`, `DbSet<<E>>` in DbContext |
| 9 | Infrastructure | migration `Add<E>` |
| 10 | Api | `Controllers/<Es>Controller.cs` or `Endpoints/<Es>Endpoints.cs` (`[Authorize]`, ProducesResponseType) |
| 11 | UnitTests | `<Es>/*HandlerTests.cs`, `<Es>/*ValidatorTests.cs` |
| 12 | IntegrationTests | `<Es>/<Es>ApiTests.cs` |
