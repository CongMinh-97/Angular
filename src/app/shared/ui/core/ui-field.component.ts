import { Component, booleanAttribute, input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UiLayout } from './ui-types';

/**
 * Label + control + hint/error shell shared by every form control.
 * Can also wrap any custom control: <ui-field label="Owner" [error]="…"><my-picker /></ui-field>
 */
@Component({
  selector: 'ui-field',
  standalone: true,
  imports: [NzIconModule, NzToolTipModule],
  template: `
    <div class="uf" [class.uf-h]="layout() === 'horizontal'" [style.--uf-label-w]="labelWidth()">
      @if (label()) {
        <div class="uf-label-row">
          <label class="uf-label" [attr.for]="forId() || null">
            {{ label() }}@if (required()) {<span class="uf-req" aria-hidden="true">*</span>}
            @if (tooltip()) {
              <span nz-icon nzType="question-circle" class="uf-tip" nz-tooltip [nzTooltipTitle]="tooltip()"></span>
            }
          </label>
          <span class="uf-extra"><ng-content select="[uiLabelExtra]" /></span>
        </div>
      }
      <div class="uf-body">
        <ng-content />
        @if (error()) {
          <div class="uf-msg uf-error" [id]="msgId()" role="alert">
            <span nz-icon nzType="close-circle" nzTheme="fill"></span>{{ error() }}
          </div>
        } @else if (hint()) {
          <div class="uf-msg" [id]="msgId()">{{ hint() }}</div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; min-width: 0; }
      .uf { display: flex; flex-direction: column; gap: 6px; }
      .uf-label-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; min-height: 20px; }
      .uf-label { font-size: 13px; font-weight: 600; color: var(--text); line-height: 1.35; }
      .uf-req { margin-left: 3px; color: var(--danger); }
      .uf-tip { margin-left: 6px; font-size: 12px; color: var(--text-3); cursor: help; }
      .uf-extra:empty { display: none; }
      .uf-extra { font-size: 13px; white-space: nowrap; }
      .uf-body { min-width: 0; }
      .uf-msg { margin-top: 6px; font-size: 12.5px; line-height: 1.4; color: var(--text-3); }
      .uf-error { display: flex; gap: 6px; align-items: baseline; color: var(--danger); animation: uf-in 0.16s ease-out; }
      .uf-error [nz-icon] { font-size: 12px; transform: translateY(1px); }
      .uf-h { display: grid; grid-template-columns: var(--uf-label-w, 160px) minmax(0, 1fr); align-items: start; column-gap: 16px; }
      .uf-h .uf-label-row { padding-top: 9px; }
      @keyframes uf-in { from { opacity: 0; transform: translateY(-3px); } }
      @media (max-width: 639px) { .uf-h { display: flex; } .uf-h .uf-label-row { padding-top: 0; } }
    `,
  ],
})
export class UiFieldComponent {
  label = input('');
  forId = input('');
  msgId = input('');
  hint = input('');
  tooltip = input('');
  error = input<string | null>(null);
  required = input(false, { transform: booleanAttribute });
  layout = input<UiLayout>('vertical');
  labelWidth = input('160px');
}
