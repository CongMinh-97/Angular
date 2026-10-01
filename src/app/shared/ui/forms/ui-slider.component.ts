import { Component, booleanAttribute, computed, input, numberAttribute } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { UiControlBase } from '../core/ui-control.base';
import { UiFieldComponent } from '../core/ui-field.component';

export type UiSliderValue = number | [number, number];

/**
 * Slider for a number, or a [min, max] pair with `range`.
 *
 * <ui-slider formControlName="seats" label="Seats" [min]="1" [max]="200" />
 * <ui-slider [(value)]="price" range [min]="0" [max]="1000" unit="k" />
 */
@Component({
  selector: 'ui-slider',
  standalone: true,
  imports: [FormsModule, NzSliderModule, UiFieldComponent],
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
      @if (showValue()) {
        <span uiLabelExtra class="ui-sl-value num">{{ display() }}</span>
      }
      <nz-slider
        [ngModel]="value()"
        [ngModelOptions]="{ standalone: true }"
        (ngModelChange)="commit($event)"
        (nzOnAfterChange)="markTouched()"
        [nzRange]="range()"
        [nzMin]="min()"
        [nzMax]="max()"
        [nzStep]="step()"
        [nzMarks]="marks()"
        [nzDisabled]="isDisabled() || readonly()"
        [nzTipFormatter]="tip"
      />
    </ui-field>
  `,
  styles: [':host{display:block;min-width:0} .ui-sl-value{font-weight:700;color:var(--jade-700)}'],
})
export class UiSliderComponent extends UiControlBase<UiSliderValue> {
  range = input(false, { transform: booleanAttribute });
  min = input(0, { transform: numberAttribute });
  max = input(100, { transform: numberAttribute });
  step = input(1, { transform: numberAttribute });
  marks = input<Record<number, string> | null>(null);
  unit = input('');
  showValue = input(true, { transform: booleanAttribute });

  tip = (v: number): string => `${v}${this.unit()}`;

  display = computed(() => {
    const v = this.value();
    if (v === null || v === undefined) return '—';
    return Array.isArray(v) ? `${v[0]}${this.unit()} – ${v[1]}${this.unit()}` : `${v}${this.unit()}`;
  });

  protected override normalize(v: unknown): UiSliderValue | null {
    if (v === null || v === undefined) return this.range() ? [this.min(), this.max()] : this.min();
    return v as UiSliderValue;
  }
}
