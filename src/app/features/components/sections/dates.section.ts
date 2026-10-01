import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { UiDateRange, UiDateRangePickerComponent, UiDatePickerComponent, UiTimePickerComponent } from '@ui';
import { ApiRow, DOC } from '../doc.components';

@Component({
  selector: 'section-dates',
  standalone: true,
  imports: [...DOC, DatePipe, UiDatePickerComponent, UiDateRangePickerComponent, UiTimePickerComponent],
  template: `
    <doc-section anchor="date-picker" heading="Date picker" selector="<ui-date-picker>" intro="Pick a date, optionally with time, or a whole week, month, quarter or year. Displays dd/MM/yyyy by default; the value is a Date.">
      <doc-example heading="Modes" [code]="code.modes" grid>
        <ui-date-picker label="Date" [(value)]="date" />
        <ui-date-picker label="Date and time" showTime [minuteStep]="15" />
        <ui-date-picker label="Week" mode="week" />
        <ui-date-picker label="Month" mode="month" />
        <ui-date-picker label="Quarter" mode="quarter" />
        <ui-date-picker label="Year" mode="year" />
      </doc-example>

      <doc-example heading="Limits and states" description="disablePast for deadlines and bookings, disableFuture for birthdays and history, or exact min/max." [code]="code.limits" grid>
        <ui-date-picker label="Deadline" disablePast hint="Today or later" />
        <ui-date-picker label="Date of birth" disableFuture />
        <ui-date-picker label="This month only" [min]="monthStart" [max]="monthEnd" />
        <ui-date-picker label="Disabled" [value]="today" disabled />
        <ui-date-picker label="Error" error="Choose a start date" />
      </doc-example>
      <div class="out">date = <code>{{ date() | date: 'dd/MM/yyyy' }}</code> ({{ date()?.constructor?.name }})</div>
      <doc-api heading="ui-date-picker properties" [rows]="dateApi" />
    </doc-section>

    <doc-section anchor="date-range" heading="Date range picker" selector="<ui-date-range-picker>" intro="Start and end date in one control, with quick ranges. The value is [Date, Date] or null.">
      <doc-example heading="Presets and limits" description="maxDays greys out dates further than N days from the first click." [code]="code.range" grid>
        <ui-date-range-picker label="Reporting period" [(value)]="range" />
        <ui-date-range-picker label="Up to 30 days" [maxDays]="30" disableFuture />
        <ui-date-range-picker label="With time" showTime [presets]="null" />
        <ui-date-range-picker label="Error" error="Choose a reporting period" />
      </doc-example>
      @if (range(); as r) {
        <div class="out">range = <code>{{ r[0] | date: 'dd/MM/yyyy' }} → {{ r[1] | date: 'dd/MM/yyyy' }}</code></div>
      }
      <doc-api heading="ui-date-range-picker properties" [rows]="rangeApi" />
    </doc-section>

    <doc-section anchor="time-picker" heading="Time picker" selector="<ui-time-picker>" intro="Time of day. Use minuteStep to match how people actually schedule.">
      <doc-example heading="Basic" [code]="code.time" grid>
        <ui-time-picker label="Opens at" [minuteStep]="15" [(value)]="time" />
        <ui-time-picker label="With seconds" format="HH:mm:ss" />
        <ui-time-picker label="Disabled" disabled />
      </doc-example>
    </doc-section>
  `,
  styles: [`.out { font-size: 12.5px; color: var(--text-3); } code { font-family: 'JetBrains Mono', monospace; color: var(--text); }`],
})
export class DatesSectionComponent {
  readonly today = new Date();
  readonly monthStart = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  readonly monthEnd = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);

  date = signal<Date | null>(new Date());
  range = signal<UiDateRange | null>(null);
  time = signal<Date | null>(new Date(2026, 0, 1, 8, 30));

  readonly dateApi: ApiRow[] = [
    { name: 'mode', type: "'date' | 'week' | 'month' | 'quarter' | 'year'", default: "'date'", description: 'What one pick means.' },
    { name: 'showTime / minuteStep', type: 'boolean / number', default: 'false / 5', description: 'Add a time column.' },
    { name: 'format', type: 'string', default: "'dd/MM/yyyy'", description: 'Display format (date-fns tokens).' },
    { name: 'min / max', type: 'Date | null', description: 'Inclusive bounds.' },
    { name: 'disablePast / disableFuture', type: 'boolean', default: 'false', description: 'Relative to today.' },
    { name: 'clearable', type: 'boolean', default: 'true', description: 'Clear button.' },
  ];

  readonly rangeApi: ApiRow[] = [
    { name: 'presets', type: 'Record<string, [Date, Date]> | null', default: 'Today … This year', description: 'Quick ranges; null hides them. defaultRangePresets() is exported.' },
    { name: 'maxDays', type: 'number', default: '0', description: 'Longest allowed span while picking.' },
    { name: 'startPlaceholder / endPlaceholder', type: 'string', description: 'Placeholders for each end.' },
    { name: 'showTime, format, min, max, disablePast, disableFuture', type: '…', description: 'Same as ui-date-picker.' },
    { name: 'validDateRange', type: 'ValidatorFn', description: 'Validator: start must be before end.' },
  ];

  readonly code = {
    modes: `<ui-date-picker formControlName="dueDate" label="Date" />
<ui-date-picker label="Date and time" showTime [minuteStep]="15" />
<ui-date-picker label="Month" mode="month" />
<ui-date-picker label="Year" mode="year" />`,
    limits: `<ui-date-picker label="Deadline" disablePast />
<ui-date-picker label="Date of birth" disableFuture />
<ui-date-picker label="This month only" [min]="monthStart" [max]="monthEnd" />`,
    range: `<ui-date-range-picker formControlName="period" label="Reporting period" />
<ui-date-range-picker label="Up to 30 days" [maxDays]="30" disableFuture />
<ui-date-range-picker label="With time" showTime [presets]="null" />

// value: [Date, Date] | null
period: [null, [Validators.required, validDateRange]]`,
    time: `<ui-time-picker formControlName="opensAt" label="Opens at" [minuteStep]="15" />
<ui-time-picker label="With seconds" format="HH:mm:ss" />`,
  };
}
