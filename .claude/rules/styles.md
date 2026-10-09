---
paths:
  - "**/*.scss"
  - "src/styles/**"
  - "tailwind.config.js"
---

# Style rules

- Colours, radius and shadows come from tokens in `src/styles/_tokens.scss` (`--ink-*`, `--jade-*`, `--coral-*`, `--violet-*`, `--amber-*`, `--sky-*`). Tailwind's palette points at the same variables.
- Ant Design theming uses the `--ant-primary-*` overrides in `_tokens.scss`. Don't override nz classes per component unless the design needs it, and scope them under the component's host.
- Tailwind preflight is off. Do not rely on its resets. Global component styles live in `src/styles.scss`.
- Avoid class names that are also Tailwind utilities (`table`, `hidden`, `block`, `flex`, `container`) on Angular or nz elements. Prefix them (`dt-`, `ui-`, `<feature>-`).
- Mobile first. Layout must work at 390 px wide with no horizontal page scroll. Wide tables scroll inside the table.
- Desktop-only layout rules (collapsed sidebar, etc.) go under `@media (min-width: 1024px)`.
