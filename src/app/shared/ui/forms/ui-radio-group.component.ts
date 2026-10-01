import { Component, input, numberAttribute } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { UiControlBase } from '../core/ui-control.base';
import { UiFieldComponent } from '../core/ui-field.component';
import { UiOption } from '../core/ui-types';

export type UiRadioVariant = 'default' | 'button' | 'card';

/**
 * One choice from a short list.
 *
 * variant="default"  classic radios (vertical or horizontal)
 * variant="button"   segmented buttons, good for 2–4 short options
 * variant="card"     selectable cards with icon + description, good for plans or modes
 *
 * <ui-radio-group formControlName="plan" label="Plan" variant="card" [options]="plans" [columns]="3" />
 */
@Component({
  selector: 'ui-radio-group',
  standalone: true,
  imports: [FormsModule, NzRadioModule, NzIconModule, UiFieldComponent],
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
      @switch (variant()) {
        @case ('card') {
          <div
            class="ui-rc"
            role="radiogroup"
            [attr.aria-label]="label() || null"
            [attr.aria-describedby]="msgId()"
            [style.--ui-rc-cols]="columns() || options().length"
            (keydown)="onKey($event)"
          >
            @for (o of options(); track o.value; let i = $index) {
              <button
                type="button"
                role="radio"
                class="ui-rc-item"
                [class.is-on]="value() === o.value"
                [class.is-invalid]="!!errorText()"
                [attr.aria-checked]="value() === o.value"
                [attr.tabindex]="tabIndexFor(o.value, i)"
                [disabled]="isDisabled() || readonly() || o.disabled"
                (click)="select(o.value)"
              >
                <span class="ui-rc-dot" aria-hidden="true"></span>
                @if (o.icon) {
                  <span class="ui-rc-icon"><span nz-icon [nzType]="o.icon"></span></span>
                }
                <span class="ui-rc-label">{{ o.label }}</span>
                @if (o.description) {
                  <span class="ui-rc-desc">{{ o.description }}</span>
                }
              </button>
            }
          </div>
        }
        @default {
          <nz-radio-group
            class="ui-rg"
            [class.is-vertical]="direction() === 'vertical' && variant() === 'default'"
            [ngModel]="value()"
            [ngModelOptions]="{ standalone: true }"
            (ngModelChange)="commit($event); markTouched()"
            [nzDisabled]="isDisabled() || readonly()"
            [nzButtonStyle]="'solid'"
            [nzSize]="nzSize()"
            [attr.aria-describedby]="msgId()"
          >
            @for (o of options(); track o.value) {
              @if (variant() === 'button') {
                <label nz-radio-button [nzValue]="o.value" [nzDisabled]="!!o.disabled">
                  @if (o.icon) {
                    <span nz-icon [nzType]="o.icon"></span>
                  }
                  {{ o.label }}
                </label>
              } @else {
                <label nz-radio [nzValue]="o.value" [nzDisabled]="!!o.disabled">
                  <span class="ui-r-label">{{ o.label }}</span>
                  @if (o.description) {
                    <span class="ui-r-desc">{{ o.description }}</span>
                  }
                </label>
              }
            }
          </nz-radio-group>
        }
      }
    </ui-field>
  `,
  styles: [
    `
      :host { display: block; min-width: 0; }
      .ui-rg { display: flex; flex-wrap: wrap; gap: 10px 20px; padding-top: 4px; }
      .ui-rg.is-vertical { flex-direction: column; gap: 10px; }
      .ui-rg label[nz-radio] { margin: 0; align-items: flex-start; }
      .ui-rg:has(label[nz-radio-button]) { gap: 0; padding-top: 0; flex-wrap: nowrap; }
      .ui-r-label { font-weight: 500; color: var(--text); }
      .ui-r-desc { display: block; font-size: 12.5px; color: var(--text-3); margin-top: 2px; }

      .ui-rc { display: grid; grid-template-columns: repeat(var(--ui-rc-cols), minmax(0, 1fr)); gap: 10px; }
      .ui-rc-item {
        position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 4px;
        padding: 14px 14px 14px 16px; text-align: left; font: inherit; cursor: pointer;
        border: 1.5px solid var(--border-strong); border-radius: var(--radius); background: var(--surface);
        transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
      }
      .ui-rc-item:hover:not(:disabled) { border-color: var(--jade-500); }
      .ui-rc-item:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ant-primary-color-outline); }
      .ui-rc-item.is-on { border-color: var(--jade-600); background: var(--jade-50); box-shadow: 0 0 0 1px var(--jade-600) inset; }
      .ui-rc-item.is-invalid:not(.is-on) { border-color: var(--danger); }
      .ui-rc-item:disabled { cursor: not-allowed; opacity: 0.55; }
      .ui-rc-dot { position: absolute; top: 14px; right: 14px; width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid var(--border-strong); background: var(--surface); }
      .ui-rc-item.is-on .ui-rc-dot { border: 5px solid var(--jade-600); }
      .ui-rc-icon { width: 32px; height: 32px; border-radius: 9px; display: grid; place-items: center; margin-bottom: 4px; font-size: 16px; color: var(--jade-600); background: var(--jade-50); }
      .ui-rc-item.is-on .ui-rc-icon { background: var(--surface); }
      .ui-rc-label { font-weight: 700; color: var(--text); padding-right: 22px; }
      .ui-rc-desc { font-size: 12.5px; color: var(--text-2); line-height: 1.45; }
      @media (max-width: 639px) { .ui-rc { grid-template-columns: minmax(0, 1fr); } }
    `,
  ],
})
export class UiRadioGroupComponent<T = unknown> extends UiControlBase<T> {
  options = input<UiOption<T>[]>([]);
  variant = input<UiRadioVariant>('default');
  direction = input<'horizontal' | 'vertical'>('horizontal');
  /** Card columns (defaults to one per option). */
  columns = input(0, { transform: numberAttribute });

  select(v: T): void {
    this.commit(v);
    this.markTouched();
  }

  /** Roving tabindex: only the selected (or first) card is in the tab order. */
  tabIndexFor(v: T, i: number): number {
    const hasValue = this.options().some(o => o.value === this.value());
    return (hasValue ? this.value() === v : i === 0) ? 0 : -1;
  }

  onKey(e: KeyboardEvent): void {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const opts = this.options().filter(o => !o.disabled);
    const i = Math.max(0, opts.findIndex(o => o.value === this.value()));
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    const next = opts[(i + step + opts.length) % opts.length];
    this.select(next.value);
    const buttons = (e.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('button[role=radio]');
    buttons[this.options().indexOf(next)]?.focus();
  }
}
