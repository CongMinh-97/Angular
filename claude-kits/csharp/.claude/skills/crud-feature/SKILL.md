---
name: crud-feature
description: Scaffold a full CRUD feature for an entity across Domain, Application (CQRS handlers, validators, DTOs), Infrastructure (EF configuration, migration) and Api (endpoints), with tests. Use when asked to add a new resource, entity, table or CRUD API.
---

# New CRUD feature

Input: the entity name (singular, PascalCase) and its properties. If the properties are missing, propose them and continue.

1. Find the closest existing feature (Grep for `class .*Handler` in Application) and read it once as the reference.
2. Create the files in `references/files.md`, in order, copying the reference's structure.
3. Add a migration: `dotnet ef migrations add Add<Entity> -p <Infrastructure> -s <Api>`. Review the generated `Up()` for unintended changes.
4. Write tests: handler unit tests (create, update, delete, not-found, conflict), validator tests, and one integration test per endpoint. Use the `test-engineer` agent for volume.
5. Verify: `dotnet build -warnaserror`, then `dotnet test`. Report the new routes.
