import { Component, booleanAttribute, computed, input, numberAttribute, signal } from '@angular/core';
import { AbstractControl, FormsModule, ValidationErrors } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { UiControlBase } from '../core/ui-control.base';
import { UiFieldComponent } from '../core/ui-field.component';
import { dateDisabler, startOfDay } from './ui-date-picker.component';

export type UiDateRange = [Date, Date];

function addDays(d: Date, n: number): Date {
  const x = startOfDay(d);
  x.setDate(x.getDate() + n);
  return x;
}

function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

/** Common quick ranges. Pass your own with [presets]. */
export function defaultRangePresets(): Record<string, UiDateRange> {
  const today = startOfDay(new Date());
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
  return {
    Today: [today, endOfDay(today)],
    Yesterday: [addDays(today, -1), endOfDay(addDays(today, -1))],
    'Last 7 days': [addDays(today, -6), endOfDay(today)],
    'Last 30 days': [addDays(today, -29), endOfDay(today)],
    'This month': [firstOfMonth, endOfDay(today)],
    'Last month': [lastMonthStart, endOfDay(lastMonthEnd)],
    'This year': [new Date(today.getFullYear(), 0, 1), endOfDay(today)],
  };
}

/** Validator: both ends present and start <= end. */
export function validDateRange(c: AbstractControl): ValidationErrors | null {
  const v = c.value as UiDateRange | null;
  if (!v || !v[0] || !v[1]) return null;
  return v[0].getTime() > v[1].getTime() ? { dateRange: true } : null;
}

/**
 * Start–end date picker. Value is [Date, Date] or null.
 *
 * <ui-date-range-picker formControlName="period" label="Reporting period" [maxDays]="90" />
 * <ui-date-range-picker [(value)]="range" [presets]="null" showTime />
 */
@Component({
  selector: 'ui-date-range-picker',
  standalone: true,
  imports: [FormsModule, NzDatePickerModule, UiFieldComponent],
  template: `
    <ui-field
      [label]="label()"
      [forId]="inputId()"
      [msgId]="msgId()"
      [hint]="hintText()"
      [tooltip]="tooltip()"
      [error]="errorText()"
      [required]="isRequired()"
      [layout]="layout()"
      [labelWidth]="labelWidth()"
    >
      <ng-content select="[uiLabelExtra]" ngProjectAs="[uiLabelExtra]" />
      <nz-range-picker
        class="ui-control"
        [nzId]="inputId()"
        [ngModel]="value()"
        [ngModelOptions]="{ standalone: true }"
        (ngModelChange)="onRangeChange($event)"
        (nzOnCalendarChange)="onCalendarChange($event)"
        (nzOnOpenChange)="onOpen($event)"
        [nzFormat]="showTime() ? 'dd/MM/yyyy HH:mm' : format()"
        [nzShowTime]="showTime() ? { nzFormat: 'HH:mm' } : false"
        [nzPlaceHolder]="[startPlaceholder(), endPlaceholder()]"
        [nzRanges]="presets() ?? undefined"
        [nzDisabledDate]="disabledDate()"
        [nzDisabled]="isDisabled()"
        [nzInputReadOnly]="readonly()"
        [nzAllowClear]="clearable()"
        [nzSize]="nzSize()"
        [nzStatus]="nzStatus()"
        [nzSeparator]="'→'"
        [attr.aria-invalid]="!!errorText()"
      />
    </ui-field>
  `,
  styles: [':host{display:block;min-width:0} nz-range-picker{width:100%}'],
})
export class UiDateRangePickerComponent extends UiControlBase<UiDateRange> {
  format = input('dd/MM/yyyy');
  showTime = input(false, { transform: booleanAttribute });
  startPlaceholder = input('Start date');
  endPlaceholder = input('End date');
  /** Quick ranges in the panel footer. Pass null to hide. */
  presets = input<Record<string, UiDateRange> | null>(defaultRangePresets());
  min = input<Date | null>(null);
  max = input<Date | null>(null);
  disablePast = input(false, { transform: booleanAttribute });
  disableFuture = input(false, { transform: booleanAttribute });
  /** Longest allowed span in days, enforced while picking. 0 = no limit. */
  maxDays = input(0, { transform: numberAttribute });
  clearable = input(true, { transform: booleanAttribute });

  /** First date clicked while the panel is open; used to enforce maxDays. */
  private anchor = signal<Date | null>(null);

  hintText = computed(() => this.hint() || (this.maxDays() ? `Up to ${this.maxDays()} days` : ''));

  disabledDate = computed(() => {
    const base = dateDisabler({ min: this.min(), max: this.max(), disablePast: this.disablePast(), disableFuture: this.disableFuture() });
    const anchor = this.anchor();
    const span = this.maxDays();
    return (d: Date): boolean => {
      if (base(d)) return true;
      if (!anchor || !span) return false;
      const diff = Math.abs(startOfDay(d).getTime() - startOfDay(anchor).getTime()) / 86400000;
      return diff >= span;
    };
  });

  onRangeChange(v: Date[] | null): void {
    this.commit(v && v.length === 2 ? (v as UiDateRange) : null);
  }

  onCalendarChange(v: Array<Date | null>): void {
    this.anchor.set(v.length === 1 || (v[0] && !v[1]) ? v[0] : null);
  }

  onOpen(open: boolean): void {
    if (!open) {
      this.anchor.set(null);
      this.markTouched();
    }
  }

  protected override normalize(v: unknown): UiDateRange | null {
    return Array.isArray(v) && v.length === 2 && v[0] && v[1] ? [new Date(v[0]), new Date(v[1])] : null;
  }
}
