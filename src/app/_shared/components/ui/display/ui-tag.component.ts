import { Component, booleanAttribute, input, output } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UiTone } from '../core/ui-types';

/**
 * Small label for status, category or count. Pair colour with text; never rely on colour alone.
 *
 * <ui-tag tone="success" dot>Active</ui-tag>
 * <ui-tag tone="violet" variant="solid">Manager</ui-tag>
 * <ui-tag closable (close)="removeFilter('vip')">VIP</ui-tag>
 */
@Component({
  selector: 'ui-tag',
  standalone: true,
  imports: [NzIconModule],
  host: { '[class]': '"t-" + tone() + " v-" + variant() + " s-" + size()' },
  template: `
    @if (dot()) {
      <span class="ui-tag-dot" aria-hidden="true"></span>
    }
    @if (icon()) {
      <span nz-icon [nzType]="icon()"></span>
    }
    <span class="ui-tag-label"><ng-content /></span>
    @if (closable()) {
      <button type="button" class="ui-tag-x" (click)="close.emit()" aria-label="Remove">
        <span nz-icon nzType="close"></span>
      </button>
    }
  `,
  styles: [
    `
      :host {
        --c: var(--text-2); --bg: var(--surface-2); --bd: var(--border);
        display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 9px;
        border-radius: 999px; font-size: 12px; font-weight: 600; line-height: 1; white-space: nowrap; vertical-align: middle;
        color: var(--c); background: var(--bg); box-shadow: inset 0 0 0 1px transparent;
      }
      :host(.s-sm) { height: 20px; padding: 0 7px; font-size: 11px; gap: 4px; }
      :host(.s-lg) { height: 28px; padding: 0 12px; font-size: 13px; }
      :host(.v-outline) { background: var(--surface); box-shadow: inset 0 0 0 1px var(--bd); }
      :host(.v-solid) { color: #fff; background: var(--c); }
      :host(.v-solid.t-neutral) { background: var(--ink-900); }
      :host(.t-neutral) { box-shadow: inset 0 0 0 1px var(--border); }
      :host(.t-jade) { --c: var(--jade-700); --bg: var(--jade-50); --bd: var(--jade-100); }
      :host(.t-success) { --c: var(--success); --bg: var(--success-bg); --bd: #bfe8d2; }
      :host(.t-warning) { --c: var(--warning); --bg: var(--warning-bg); --bd: #f3dca6; }
      :host(.t-danger) { --c: var(--danger); --bg: var(--danger-bg); --bd: #f6c3c4; }
      :host(.t-info) { --c: var(--info); --bg: var(--info-bg); --bd: #c5d8fd; }
      :host(.t-violet) { --c: #5a42d6; --bg: var(--violet-100); --bd: #d5cbff; }
      :host(.t-coral) { --c: var(--coral-600); --bg: var(--coral-100); --bd: #f9c7b4; }
      .ui-tag-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
      :host(.v-solid) .ui-tag-dot { background: #fff; }
      .ui-tag-x { display: inline-grid; place-items: center; width: 16px; height: 16px; margin-right: -4px; padding: 0; border: 0; border-radius: 50%; background: transparent; color: inherit; font-size: 9px; cursor: pointer; opacity: 0.7; }
      .ui-tag-x:hover { opacity: 1; background: rgba(0, 0, 0, 0.08); }
    `,
  ],
})
export class UiTagComponent {
  tone = input<UiTone>('neutral');
  variant = input<'soft' | 'outline' | 'solid'>('soft');
  size = input<'sm' | 'md' | 'lg'>('md');
  dot = input(false, { transform: booleanAttribute });
  icon = input('');
  closable = input(false, { transform: booleanAttribute });
  close = output<void>();
}
