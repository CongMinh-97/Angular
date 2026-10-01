import { Component, booleanAttribute, computed, input, numberAttribute } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UiControlBase } from '../core/ui-control.base';
import { UiFieldComponent } from '../core/ui-field.component';

/**
 * Multi-line text. Grows with content between minRows and maxRows.
 *
 * <ui-textarea formControlName="bio" label="Bio" [maxChars]="300" showCount />
 */
@Component({
  selector: 'ui-textarea',
  standalone: true,
  imports: [NzInputModule, UiFieldComponent],
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
      <div class="ui-ta" [class.has-count]="showCount() && maxChars()">
        <textarea
          nz-input
          class="ui-control"
          [id]="inputId()"
          [value]="value() ?? ''"
          [placeholder]="placeholder()"
          [disabled]="isDisabled()"
          [readOnly]="readonly()"
          [nzStatus]="nzStatus()"
          [nzAutosize]="{ minRows: minRows(), maxRows: maxRows() }"
          [attr.maxlength]="maxChars() || null"
          [attr.aria-invalid]="!!errorText()"
          [attr.aria-required]="isRequired()"
          [attr.aria-describedby]="msgId()"
          [class.ant-input-sm]="size() === 'sm'"
          [class.ant-input-lg]="size() === 'lg'"
          (input)="commit($any($event.target).value)"
          (blur)="markTouched()"
        ></textarea>
        @if (showCount() && maxChars()) {
          <span class="ui-ta-count num" [class.is-full]="length() >= maxChars()">{{ length() }}/{{ maxChars() }}</span>
        }
      </div>
    </ui-field>
  `,
  styles: [
    `
      :host { display: block; min-width: 0; }
      .ui-ta { position: relative; }
      .ui-ta.has-count textarea { padding-bottom: 24px; }
      .ui-ta-count { position: absolute; right: 10px; bottom: 6px; font-size: 11.5px; color: var(--text-3); pointer-events: none; }
      .ui-ta-count.is-full { color: var(--warning); }
    `,
  ],
})
export class UiTextareaComponent extends UiControlBase<string> {
  minRows = input(3, { transform: numberAttribute });
  maxRows = input(8, { transform: numberAttribute });
  /** Character limit (named maxChars so Angular's [maxlength] validator directive doesn't attach). */
  maxChars = input(0, { transform: numberAttribute });
  showCount = input(false, { transform: booleanAttribute });

  length = computed(() => (this.value() ?? '').length);
}
