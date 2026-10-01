import { Component, booleanAttribute, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { UiControlBase } from '../core/ui-control.base';
import { UiFieldComponent } from '../core/ui-field.component';

export type UiDateMode = 'date' | 'week' | 'month' | 'quarter' | 'year';

const DEFAULT_FORMAT: Record<UiDateMode, string> = {
  date: 'dd/MM/yyyy',
  week: 'yyyy-ww',
  month: 'MM/yyyy',
  quarter: 'yyyy-[Q]Q',
  year: 'yyyy',
};

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Shared min/max/past/future rule for date pickers. */
export function dateDisabler(opts: { min?: Date | null; max?: Date | null; disablePast?: boolean; disableFuture?: boolean }) {
  const today = startOfDay(new Date()).getTime();
  return (d: Date): boolean => {
    const t = startOfDay(d).getTime();
    if (opts.disablePast && t < today) return true;
    if (opts.disableFuture && t > today) return true;
    if (opts.min && t < startOfDay(opts.min).getTime()) return true;
    if (opts.max && t > startOfDay(opts.max).getTime()) return true;
    return false;
  };
}

/**
 * Date (or week / month / quarter / year) picker. Value is a Date or null.
 *
 * <ui-date-picker formControlName="dob" label="Date of birth" disableFuture />
 * <ui-date-picker [(value)]="publishAt" showTime disablePast />
 * <ui-date-picker [(value)]="period" mode="month" />
 */
@Component({
  selector: 'ui-date-picker',
  standalone: true,
  imports: [FormsModule, NzDatePickerModule, UiFieldComponent],
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
      <nz-date-picker
        class="ui-control"
        [nzId]="inputId()"
        [nzMode]="mode()"
        [ngModel]="value()"
        [ngModelOptions]="{ standalone: true }"
        (ngModelChange)="commit($event)"
        (nzOnOpenChange)="!$event && markTouched()"
        [nzFormat]="displayFormat()"
        [nzShowTime]="showTime() ? { nzFormat: 'HH:mm', nzMinuteStep: minuteStep() } : false"
        [nzPlaceHolder]="placeholder() || defaultPlaceholder()"
        [nzDisabledDate]="disabledDate()"
        [nzDisabled]="isDisabled()"
        [nzInputReadOnly]="readonly()"
        [nzAllowClear]="clearable() && !readonly()"
        [nzSize]="nzSize()"
        [nzStatus]="nzStatus()"
        [nzShowToday]="true"
        [attr.aria-invalid]="!!errorText()"
      />
    </ui-field>
  `,
  styles: [':host{display:block;min-width:0} nz-date-picker{width:100%}'],
})
export class UiDatePickerComponent extends UiControlBase<Date> {
  mode = input<UiDateMode>('date');
  format = input('');
  showTime = input(false, { transform: booleanAttribute });
  minuteStep = input(5);
  min = input<Date | null>(null);
  max = input<Date | null>(null);
  disablePast = input(false, { transform: booleanAttribute });
  disableFuture = input(false, { transform: booleanAttribute });
  clearable = input(true, { transform: booleanAttribute });

  displayFormat = computed(() => this.format() || (this.showTime() ? 'dd/MM/yyyy HH:mm' : DEFAULT_FORMAT[this.mode()]));
  defaultPlaceholder = computed(() => ({ date: 'Select date', week: 'Select week', month: 'Select month', quarter: 'Select quarter', year: 'Select year' })[this.mode()]);
  disabledDate = computed(() => dateDisabler({ min: this.min(), max: this.max(), disablePast: this.disablePast(), disableFuture: this.disableFuture() }));

  protected override normalize(v: unknown): Date | null {
    if (v === null || v === undefined || v === '') return null;
    const d = v instanceof Date ? v : new Date(v as string);
    return isNaN(d.getTime()) ? null : d;
  }
}
