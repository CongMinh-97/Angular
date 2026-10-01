import { Component, computed, input, numberAttribute } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { UiControlBase } from '../core/ui-control.base';
import { UiFieldComponent } from '../core/ui-field.component';

export type UiNumberFormat = 'plain' | 'thousands' | 'currency' | 'percent';

/**
 * Numeric input with stepper, bounds and display formatting. The value is always a number (or null).
 *
 * <ui-number formControlName="price" label="Price" format="currency" currency="₫" [min]="0" />
 */
@Component({
  selector: 'ui-number',
  standalone: true,
  imports: [FormsModule, NzInputNumberModule, UiFieldComponent],
  template: `
    <ui-field
      [label]="label()"
      [forId]="inputId()"
      [msgId]="msgId()"
      [hint]="hint()"
      [tooltip]="tooltip()"
      [error]="errorText()"
      [required]="isRequired()"
      [layout]="layout()"
      [labelWidth]="labelWidth()"
    >
      <ng-content select="[uiLabelExtra]" ngProjectAs="[uiLabelExtra]" />
      <nz-input-number-group
        class="ui-control"
        [nzSize]="nzSize()"
        [nzStatus]="nzStatus()"
        [nzPrefix]="prefixText() || undefined"
        [nzSuffix]="suffixText() || undefined"
        [nzAddOnBefore]="addonBefore() || undefined"
        [nzAddOnAfter]="addonAfter() || undefined"
      >
        <nz-input-number
          [nzId]="inputId()"
          [ngModel]="value()"
          [ngModelOptions]="{ standalone: true }"
          (ngModelChange)="commit($event)"
          (nzBlur)="markTouched()"
          [nzMin]="min()"
          [nzMax]="max()"
          [nzStep]="step()"
          [nzPrecision]="precisionValue()"
          [nzPlaceHolder]="placeholder()"
          [nzDisabled]="isDisabled()"
          [nzReadOnly]="readonly()"
          [nzSize]="nzSize()"
          [nzStatus]="nzStatus()"
          [nzFormatter]="formatter"
          [nzParser]="parser"
          [attr.aria-invalid]="!!errorText()"
        />
      </nz-input-number-group>
    </ui-field>
  `,
  styles: [':host{display:block;min-width:0} :host ::ng-deep .ant-input-number-group-wrapper, :host ::ng-deep .ant-input-number{width:100%}'],
})
export class UiNumberComponent extends UiControlBase<number> {
  min = input(Number.MIN_SAFE_INTEGER, { transform: numberAttribute });
  max = input(Number.MAX_SAFE_INTEGER, { transform: numberAttribute });
  step = input(1, { transform: numberAttribute });
  /** Decimal places. Defaults to 0 for currency, 2 otherwise when a format is set. */
  precision = input<number | undefined>(undefined);
  format = input<UiNumberFormat>('plain');
  /** Currency symbol shown as suffix when format="currency". */
  currency = input('₫');
  /** Unit text inside the box, e.g. "kg", "%". */
  unit = input('');
  prefix = input('');
  addonBefore = input('');
  addonAfter = input('');
  locale = input('en-US');

  precisionValue = computed(() => this.precision() ?? (this.format() === 'currency' || this.format() === 'thousands' ? 0 : undefined));
  prefixText = computed(() => this.prefix());
  suffixText = computed(() => (this.format() === 'currency' ? this.currency() : this.format() === 'percent' ? '%' : this.unit()));

  formatter = (v: number | null): string => {
    if (v === null || v === undefined || (v as unknown) === '') return '';
    if (this.format() === 'plain' || this.format() === 'percent') return String(v);
    return new Intl.NumberFormat(this.locale(), { maximumFractionDigits: this.precisionValue() ?? 2 }).format(Number(v));
  };

  // ng-zorro converts the returned string to a number.
  parser = (s: string): string => {
    const group = new Intl.NumberFormat(this.locale()).format(1111).replace(/\d/g, '');
    return s.split(group).join('').replace(/[^\d.,-]/g, '').replace(',', '.');
  };

  protected override normalize(v: unknown): number | null {
    return v === '' || v === null || v === undefined ? null : Number(v);
  }
}
