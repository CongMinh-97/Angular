---
paths:
  - "resources/views/**"
  - "resources/js/**"
  - "resources/css/**"
---

# View rules

- Blade: `{{ }}` escapes, so `{!! !!}` is allowed only for trusted, sanitised HTML, with a comment explaining why.
- Use Blade components (`<x-button>`, `<x-form.input>`) from `resources/views/components` for repeated UI. Never copy markup.
- Forms: `@csrf`, `@method('PUT')`, show errors with `@error('field')`, refill with `old('field', $model->field)`.
- No queries in views: pass prepared data from the controller, and eager-load what the view iterates.
- Frontend assets go through Vite (`@vite([...])`). Do not edit `public/build`.
