---
description: Scaffold a CRUD feature (entity, CQRS handlers, validators, EF config + migration, endpoints, tests)
argument-hint: <Entity> [Prop:Type ...]  e.g. Product Name:string Price:decimal Status:enum(Active,Draft)
---

Entity and properties: $ARGUMENTS

Follow the `crud-feature` skill and create every file in its table. Finish with `dotnet build -warnaserror -v q` and `dotnet test -v q`, then list the new routes.
