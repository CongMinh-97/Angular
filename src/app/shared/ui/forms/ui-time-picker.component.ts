import { Component, booleanAttribute, input, numberAttribute } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { UiControlBase } from '../core/ui-control.base';
import { UiFieldComponent } from '../core/ui-field.component';

/**
 * Time picker. Value is a Date (only the time part matters) or null.
 *
 * <ui-time-picker formControlName="opensAt" label="Opens at" [minuteStep]="15" />
 */
@Component({
  selector: 'ui-time-picker',
  standalone: true,
  imports: [FormsModule, NzTimePickerModule, UiFieldComponent],
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
      <nz-time-picker
        class="ui-control"
        [nzId]="inputId()"
        [ngModel]="value()"
        [ngModelOptions]="{ standalone: true }"
        (ngModelChange)="commit($event)"
        (nzOpenChange)="!$event && markTouched()"
        [nzFormat]="format()"
        [nzMinuteStep]="minuteStep()"
        [nzHourStep]="hourStep()"
        [nzPlaceHolder]="placeholder() || 'Select time'"
        [nzDisabled]="isDisabled()"
        [nzInputReadOnly]="readonly()"
        [nzAllowEmpty]="clearable()"
        [nzSize]="nzSize()"
        [nzStatus]="nzStatus()"
        [attr.aria-invalid]="!!errorText()"
      />
    </ui-field>
  `,
  styles: [':host{display:block;min-width:0} nz-time-picker{width:100%}'],
})
export class UiTimePickerComponent extends UiControlBase<Date> {
  format = input('HH:mm');
  minuteStep = input(5, { transform: numberAttribute });
  hourStep = input(1, { transform: numberAttribute });
  clearable = input(true, { transform: booleanAttribute });
}
