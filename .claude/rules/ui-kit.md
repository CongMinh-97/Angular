---
paths:
  - "src/app/_shared/components/ui/**"
  - "src/app/modules/design-system/**"
---

# UI kit rules (`@ui`)

- Every form control extends `UiControlBase<T>` (`core/ui-control.base.ts`). It must work three ways: `formControlName`/`[formControl]`, `[(ngModel)]`, and standalone `[(value)]`. Do not add an `NG_VALUE_ACCESSOR` provider. The base sets `ngControl.valueAccessor = this`.
- Change the value only through `this.commit(v)`, and call `this.markTouched()` on blur. Override `normalize()` for value coercion.
- Wrap the control in `<ui-field>` and pass `label`, `hint`, `tooltip`, `error=errorText()`, `required=isRequired()`, `layout` and `labelWidth`. Bind `[nzStatus]="nzStatus()"` on the inner nz control so the error border shows.
- Input names must not collide with Angular validator directive selectors: `maxlength`, `minlength`, `required` (handled by the base), `pattern`, `min`, `max`, `email`. Use `maxChars`, `minValue`, and similar names instead.
- CSS classes inside the kit use the `ui-` prefix. Tailwind utilities like `table`, `hidden` or `block` used as plain class names will break layout.
- Sizes are `sm` | `md` | `lg` through `NZ_SIZE`. Ids come from `nextUiId()`.
- Export new pieces from `ui/index.ts` (`UI_FORM_CONTROLS` or `UI_DISPLAY`), document them on the `/components` page (`modules/design-system/ui-components/sections/`), and add a spec next to the component.
- Keep public inputs documented with a one-line JSDoc. The /components API tables mirror them.
