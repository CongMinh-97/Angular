---
paths:
  - "src/**/Controllers/**"
  - "src/**/Endpoints/**"
  - "src/**/*.Api/**"
---

# API layer rules

- Routes: `api/v{version}/<plural-resource>` in kebab-case. Verbs: GET list/detail, POST create (201 + Location), PUT replace, PATCH partial, DELETE (204).
- Lists accept `page`, `pageSize` (max 100), `search`, `sortBy`, `sortDir` and return `PagedResult<T> { Items, Total, Page, PageSize }`.
- Every endpoint declares `[ProducesResponseType]` (or `.Produces<T>()`) for success and for 400/404/409. That keeps OpenAPI accurate.
- Every endpoint has `[Authorize]` (with a policy where needed) unless explicitly public, and public endpoints get `[AllowAnonymous]` with a comment.
- No business logic or DbContext in controllers. Send a MediatR request.
- Bind input to request records. Never bind directly to EF entities (over-posting).
- Register new services in the layer's `DependencyInjection.cs` extension, not in `Program.cs`.
