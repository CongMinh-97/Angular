import { Component, booleanAttribute, computed, input, numberAttribute } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { UiControlBase } from '../core/ui-control.base';
import { UiFieldComponent } from '../core/ui-field.component';
import { UiOption } from '../core/ui-types';

/**
 * Single checkbox bound to a boolean.
 *
 * <ui-checkbox formControlName="terms" text="I accept the terms" />   (use Validators.requiredTrue)
 * <ui-checkbox [(value)]="remember">Keep me signed in</ui-checkbox>
 */
@Component({
  selector: 'ui-checkbox',
  standalone: true,
  imports: [FormsModule, NzCheckboxModule, UiFieldComponent],
  template: `
    <ui-field
      [label]="label()"
      [forId]="inputId()"
      [msgId]="msgId()"
      [hint]="hint()"
      [tooltip]="tooltip()"
      [error]="errorText()"
      [required]="label() ? isRequired() : false"
      [layout]="layout()"
      [labelWidth]="labelWidth()"
    >
      <label
        nz-checkbox
        class="ui-check"
        [class.is-invalid]="!!errorText()"
        [nzId]="inputId()"
        [ngModel]="!!value()"
        [ngModelOptions]="{ standalone: true }"
        (ngModelChange)="commit($event); markTouched()"
        [nzDisabled]="isDisabled() || readonly()"
        [nzIndeterminate]="indeterminate()"
        [attr.aria-invalid]="!!errorText()"
      >
        <span class="ui-check-text">{{ text() }}<ng-content /></span>
        @if (description()) {
          <span class="ui-check-desc">{{ description() }}</span>
        }
      </label>
    </ui-field>
  `,
  styles: [
    `
      :host { display: block; min-width: 0; }
      .ui-check { align-items: flex-start; }
      .ui-check.is-invalid ::ng-deep .ant-checkbox-inner { border-color: var(--danger); }
      .ui-check-text { color: var(--text); font-weight: 500; }
      .ui-check-desc { display: block; margin-top: 2px; font-size: 12.5px; color: var(--text-3); }
    `,
  ],
})
export class UiCheckboxComponent extends UiControlBase<boolean> {
  text = input('');
  description = input('');
  indeterminate = input(false, { transform: booleanAttribute });

  protected override normalize(v: unknown): boolean {
    return !!v;
  }
}

/**
 * A set of checkboxes bound to an array of selected values.
 *
 * <ui-checkbox-group formControlName="channels" label="Notify me by" [options]="channels" />
 */
@Component({
  selector: 'ui-checkbox-group',
  standalone: true,
  imports: [FormsModule, NzCheckboxModule, UiFieldComponent],
  template: `
    <ui-field
      [label]="label()"
      [msgId]="msgId()"
      [hint]="hint()"
      [tooltip]="tooltip()"
      [error]="errorText()"
      [required]="isRequired()"
      [layout]="layout()"
      [labelWidth]="labelWidth()"
    >
      <div
        class="ui-cg"
        role="group"
        [attr.aria-label]="label() || null"
        [attr.aria-describedby]="msgId()"
        [class.is-vertical]="direction() === 'vertical'"
        [style.--ui-cg-cols]="columns() || null"
        [class.is-grid]="columns() > 0"
      >
        @if (showSelectAll()) {
          <label
            nz-checkbox
            class="ui-cg-all"
            [ngModel]="allChecked()"
            [ngModelOptions]="{ standalone: true }"
            [nzIndeterminate]="someChecked()"
            (ngModelChange)="toggleAll($event)"
            [nzDisabled]="isDisabled() || readonly()"
          >
            Select all
          </label>
        }
        @for (o of options(); track o.value) {
          <label
            nz-checkbox
            [ngModel]="isChecked(o.value)"
            [ngModelOptions]="{ standalone: true }"
            (ngModelChange)="toggle(o.value, $event)"
            [nzDisabled]="isDisabled() || readonly() || !!o.disabled"
          >
            <span class="ui-check-text">{{ o.label }}</span>
            @if (o.description) {
              <span class="ui-check-desc">{{ o.description }}</span>
            }
          </label>
        }
      </div>
    </ui-field>
  `,
  styles: [
    `
      :host { display: block; min-width: 0; }
      .ui-cg { display: flex; flex-wrap: wrap; gap: 10px 20px; padding-top: 4px; }
      .ui-cg.is-vertical { flex-direction: column; gap: 10px; }
      .ui-cg.is-grid { display: grid; grid-template-columns: repeat(var(--ui-cg-cols), minmax(0, 1fr)); }
      .ui-cg label { margin: 0 !important; align-items: flex-start; }
      .ui-cg-all { grid-column: 1 / -1; padding-bottom: 8px; border-bottom: 1px dashed var(--border); font-weight: 600; }
      .ui-check-text { color: var(--text); font-weight: 500; }
      .ui-check-desc { display: block; margin-top: 2px; font-size: 12.5px; color: var(--text-3); }
      @media (max-width: 639px) { .ui-cg.is-grid { grid-template-columns: minmax(0, 1fr); } }
    `,
  ],
})
export class UiCheckboxGroupComponent<T = unknown> extends UiControlBase<T[]> {
  options = input<UiOption<T>[]>([]);
  direction = input<'horizontal' | 'vertical'>('horizontal');
  /** Lay options out in N equal columns (stacks on phones). */
  columns = input(0, { transform: numberAttribute });
  showSelectAll = input(false, { transform: booleanAttribute });

  private enabled = computed(() => this.options().filter(o => !o.disabled).map(o => o.value));
  allChecked = computed(() => this.enabled().length > 0 && this.enabled().every(v => (this.value() ?? []).includes(v)));
  someChecked = computed(() => !this.allChecked() && (this.value() ?? []).length > 0);

  isChecked(v: T): boolean {
    return (this.value() ?? []).includes(v);
  }

  toggle(v: T, checked: boolean): void {
    const current = this.value() ?? [];
    // Keep the order of options, not the order of clicks.
    const next = this.options()
      .map(o => o.value)
      .filter(x => (x === v ? checked : current.includes(x)));
    this.commit(next);
    this.markTouched();
  }

  toggleAll(checked: boolean): void {
    this.commit(checked ? this.enabled() : []);
    this.markTouched();
  }

  protected override normalize(v: unknown): T[] {
    return Array.isArray(v) ? (v as T[]) : [];
  }
}
