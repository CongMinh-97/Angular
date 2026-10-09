---
name: angular-testing
description: Write, expand or fix Karma/Jasmine unit tests in this Angular project - services with HttpTestingController, functional interceptors and guards, signal stores, pure utils, ui-* form controls (reactive, ngModel, standalone) and page components. Use when adding tests, raising coverage, or a spec fails.
---

# Angular unit testing

## Steps
1. Find the matching pattern in `references/patterns.md` (load only the section you need). Real, passing examples are listed there; open the closest one instead of writing from memory.
2. List the behaviours to cover before writing: happy path, every branch, error and edge input. One `it` per behaviour.
3. Write `<file>.spec.ts` next to the source. Use the fixtures in `src/testing/test-helpers.ts` and add new shared factories there.
4. Run only that spec:
   `npx ng test --watch=false --browsers=ChromeHeadlessCI --include=<path/to/file.spec.ts>`
5. On failure, read the first failing expectation, not the whole log. Decide whether the test or the code is wrong. Never weaken an assertion just to get green.
6. Finish with `npx tsc -p tsconfig.spec.json --noEmit`.

## Coverage
`npm run test:coverage` prints a text summary. `coverage/index.html` has per-line detail. Aim for every branch of business logic, not a percentage.

## Environment
Karma needs Chrome or Chromium. Set `CHROME_BIN=/path/to/chromium` if `ChromeHeadlessCI` cannot start.
