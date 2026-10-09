---
paths:
  - "**/*.spec.ts"
  - "src/testing/**"
  - "karma.conf.js"
---

# Unit test rules (Karma + Jasmine)

- Put the spec next to the file: `x.service.ts` → `x.service.spec.ts`. Shared fixtures (`makeUser`, `clearStorage`) live in `src/testing/test-helpers.ts`.
- Test behaviour through public APIs: inputs, outputs, DOM, HTTP calls. Do not test private members or framework internals.
- HTTP: `provideHttpClient(withInterceptors([...]))` + `provideHttpClientTesting()`, assert with `HttpTestingController.expectOne`, call `verify()` in `afterEach`.
- Functional guards and interceptors run inside `TestBed.runInInjectionContext(...)` or through `HttpClient`.
- Components are tested through a small standalone host component. For ui-* controls, cover each usage mode: reactive form, ngModel, standalone `[(value)]`.
- Mock collaborators with `jasmine.createSpyObj` or `{ provide: X, useValue: {...} }`. Do not hit the mock backend from unit tests.
- Use `provideNoopAnimations()` for ng-zorro components. Use `fakeAsync` + `tick` for debounce and timers.
- Clean `localStorage`/`sessionStorage` in `beforeEach`/`afterEach`. Jasmine runs in random order.
- One behaviour per `it`, named as a sentence: `it('redirects guests to /login and keeps the target url')`.
- Patterns with full examples: `.claude/skills/angular-testing/references/patterns.md`.
