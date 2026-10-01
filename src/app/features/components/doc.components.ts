import { Component, booleanAttribute, input, signal } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

/** One documented component: anchor target, title, intro and its examples. */
@Component({
  selector: 'doc-section',
  standalone: true,
  host: { '[attr.id]': 'anchor()', class: 'doc-section' },
  template: `
    <header class="ds-head">
      <div class="ds-title-row">
        <h2>{{ heading() }}</h2>
        @if (selector()) {
          <code class="ds-selector">{{ selector() }}</code>
        }
      </div>
      @if (intro()) {
        <p>{{ intro() }}</p>
      }
    </header>
    <div class="ds-body"><ng-content /></div>
  `,
  styles: [
    `
      :host { display: block; scroll-margin-top: calc(var(--topbar-h) + 16px); padding-bottom: 40px; margin-bottom: 40px; border-bottom: 1px solid var(--border); }
      :host:last-child { border-bottom: 0; }
      .ds-head { margin-bottom: 18px; }
      .ds-title-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
      h2 { font-size: 22px; font-weight: 800; letter-spacing: -0.015em; }
      .ds-selector { font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 3px 8px; border-radius: 6px; color: var(--jade-700); background: var(--jade-50); }
      p { margin: 6px 0 0; max-width: 72ch; color: var(--text-2); }
      .ds-body { display: flex; flex-direction: column; gap: 16px; }
    `,
  ],
})
export class DocSectionComponent {
  anchor = input.required<string>();
  heading = input.required<string>();
  selector = input('');
  intro = input('');
}

/** Live example with a Preview/Code switch and a copy button. */
@Component({
  selector: 'doc-example',
  standalone: true,
  imports: [NzIconModule],
  template: `
    <div class="dx">
      <div class="dx-head">
        <div>
          <h3>{{ heading() }}</h3>
          @if (description()) {
            <p>{{ description() }}</p>
          }
        </div>
        @if (code()) {
          <div class="dx-tabs" role="tablist">
            <button type="button" role="tab" [attr.aria-selected]="!showCode()" [class.on]="!showCode()" (click)="showCode.set(false)">
              <span nz-icon nzType="eye"></span>Preview
            </button>
            <button type="button" role="tab" [attr.aria-selected]="showCode()" [class.on]="showCode()" (click)="showCode.set(true)">
              <span nz-icon nzType="code"></span>Code
            </button>
          </div>
        }
      </div>
      <div class="dx-preview" [class.is-stack]="stack()" [class.is-grid]="grid()" [hidden]="showCode()">
        <ng-content />
      </div>
      @if (showCode()) {
        <div class="dx-code">
          <button type="button" class="dx-copy" (click)="copy()">
            <span nz-icon [nzType]="copied() ? 'check' : 'copy'"></span>{{ copied() ? 'Copied' : 'Copy' }}
          </button>
          <pre><code>{{ code() }}</code></pre>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host { display: block; min-width: 0; }
      .dx { border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--surface); overflow: hidden; }
      .dx-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 14px 16px; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
      h3 { font-size: 14px; font-weight: 700; }
      .dx-head p { margin: 2px 0 0; font-size: 12.5px; color: var(--text-3); max-width: 70ch; }
      .dx-tabs { display: inline-flex; padding: 3px; border-radius: 9px; background: var(--surface-2); box-shadow: inset 0 0 0 1px var(--border); }
      .dx-tabs button { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border: 0; border-radius: 7px; background: none; font: inherit; font-size: 12.5px; font-weight: 600; color: var(--text-2); cursor: pointer; }
      .dx-tabs button.on { background: var(--surface); color: var(--text); box-shadow: var(--shadow-xs); }
      .dx-preview { padding: 20px 16px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
      .dx-preview.is-stack { flex-direction: column; align-items: stretch; gap: 20px; }
      .dx-preview.is-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr)); align-items: start; gap: 16px 20px; }
      .dx-code { position: relative; background: var(--ink-950); }
      pre { margin: 0; padding: 18px 16px; overflow-x: auto; font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12.5px; line-height: 1.65; color: #d5dbeb; }
      .dx-copy { position: absolute; top: 10px; right: 10px; display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border: 0; border-radius: 7px; font: inherit; font-size: 12px; font-weight: 600; color: #c4cbe0; background: rgba(255, 255, 255, 0.08); cursor: pointer; }
      .dx-copy:hover { background: rgba(255, 255, 255, 0.14); color: #fff; }
    `,
  ],
})
export class DocExampleComponent {
  heading = input.required<string>();
  description = input('');
  code = input('');
  /** Stack children vertically, full width (forms). */
  stack = input(false, { transform: booleanAttribute });
  /** Auto-fit grid of equal columns (control galleries). */
  grid = input(false, { transform: booleanAttribute });

  showCode = signal(false);
  copied = signal(false);

  copy(): void {
    navigator.clipboard?.writeText(this.code()).then(
      () => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 1400);
      },
      () => undefined,
    );
  }
}

export interface ApiRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

/** Inputs / outputs reference table. */
@Component({
  selector: 'doc-api',
  standalone: true,
  template: `
    <div class="da">
      <div class="da-title">{{ heading() }}</div>
      <div class="da-scroll">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            @for (r of rows(); track r.name) {
              <tr>
                <td><code>{{ r.name }}</code></td>
                <td><code class="t">{{ r.type }}</code></td>
                <td><code class="d">{{ r.default ?? '—' }}</code></td>
                <td>{{ r.description }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; min-width: 0; }
      .da { border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; background: var(--surface); }
      .da-title { padding: 10px 14px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-3); background: var(--surface-2); border-bottom: 1px solid var(--border); }
      .da-scroll { overflow-x: auto; }
      table { width: 100%; min-width: 640px; border-collapse: collapse; font-size: 13px; }
      th { text-align: left; padding: 8px 14px; font-size: 11.5px; font-weight: 700; color: var(--text-3); border-bottom: 1px solid var(--border); }
      td { padding: 9px 14px; border-bottom: 1px solid var(--border); vertical-align: top; color: var(--text-2); }
      tr:last-child td { border-bottom: 0; }
      td:first-child { white-space: nowrap; }
      code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text); }
      code.t { color: #5a42d6; }
      code.d { color: var(--text-3); }
    `,
  ],
})
export class DocApiComponent {
  heading = input('Properties');
  rows = input.required<ApiRow[]>();
}

export const DOC = [DocSectionComponent, DocExampleComponent, DocApiComponent] as const;

export const COMMON_CONTROL_API: ApiRow[] = [
  { name: 'formControlName / formControl / ngModel', type: 'directive', description: 'Bind to a form. Validators drive the required mark and the error message automatically.' },
  { name: '[(value)]', type: 'T | null', default: 'null', description: 'Two-way binding for use without a form.' },
  { name: 'label', type: 'string', default: "''", description: 'Field label. Clicking it focuses the control.' },
  { name: 'hint', type: 'string', default: "''", description: 'Helper text under the control; replaced by the error when invalid.' },
  { name: 'tooltip', type: 'string', default: "''", description: 'Adds a ? icon after the label with this tooltip.' },
  { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height 30 / 38 / 46 px.' },
  { name: 'layout', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Label above, or in a left column (stacks again on phones).' },
  { name: 'labelWidth', type: 'string', default: "'160px'", description: 'Label column width for the horizontal layout.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Force the required mark (auto-detected from Validators.required).' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the control. In forms prefer control.disable().' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Value visible and selectable but not editable.' },
  { name: 'error', type: 'string | null', default: 'null', description: 'Show an error without a form (async checks, standalone use).' },
  { name: 'errorMessages', type: 'Record<string, string | fn>', default: '{}', description: 'Override messages per validator key for this field.' },
  { name: 'inputId', type: 'string', default: 'auto', description: 'id of the inner input (for the label and tests).' },
  { name: '(blurred)', type: 'void', description: 'Emits when the control loses focus.' },
  { name: 'uiLabelExtra', type: 'content slot', description: 'Element with this attribute is shown on the right of the label row.' },
];
