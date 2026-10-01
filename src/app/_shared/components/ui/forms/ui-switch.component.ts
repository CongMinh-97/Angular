import { Component, booleanAttribute, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { UiControlBase } from '../core/ui-control.base';
import { UiFieldComponent } from '../core/ui-field.component';

/**
 * On/off toggle for settings that apply immediately or on save.
 *
 * <ui-switch formControlName="emailAlerts" text="Email alerts" description="Daily summary at 8:00" />
 */
@Component({
  selector: 'ui-switch',
  standalone: true,
  imports: [FormsModule, NzSwitchModule, UiFieldComponent],
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
      <div class="ui-sw" [class.is-reverse]="placement() === 'end'">
        <nz-switch
          [nzId]="inputId()"
          [ngModel]="!!value()"
          [ngModelOptions]="{ standalone: true }"
          (ngModelChange)="commit($event); markTouched()"
          [nzDisabled]="isDisabled() || readonly()"
          [nzLoading]="loading()"
          [nzSize]="size() === 'sm' ? 'small' : 'default'"
          [nzCheckedChildren]="onText() || null"
          [nzUnCheckedChildren]="offText() || null"
        />
        @if (text() || description()) {
          <label class="ui-sw-text" [attr.for]="inputId()">
            <span>{{ text() }}<ng-content /></span>
            @if (description()) {
              <small>{{ description() }}</small>
            }
          </label>
        }
      </div>
    </ui-field>
  `,
  styles: [
    `
      :host { display: block; min-width: 0; }
      .ui-sw { display: flex; align-items: flex-start; gap: 12px; }
      .ui-sw.is-reverse { flex-direction: row-reverse; justify-content: space-between; }
      .ui-sw nz-switch { flex: none; margin-top: 1px; }
      .ui-sw-text { display: flex; flex-direction: column; cursor: pointer; min-width: 0; }
      .ui-sw-text span { font-weight: 500; color: var(--text); }
      .ui-sw-text small { font-size: 12.5px; color: var(--text-3); }
    `,
  ],
})
export class UiSwitchComponent extends UiControlBase<boolean> {
  text = input('');
  description = input('');
  onText = input('');
  offText = input('');
  loading = input(false, { transform: booleanAttribute });
  /** Put the switch at the start (default) or the end of the row, settings-list style. */
  placement = input<'start' | 'end'>('start');

  protected override normalize(v: unknown): boolean {
    return !!v;
  }
}
