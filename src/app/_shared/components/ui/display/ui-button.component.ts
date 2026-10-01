import { Component, ElementRef, booleanAttribute, computed, inject, input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UiSize } from '../core/ui-types';

export type UiButtonVariant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'dark' | 'danger' | 'danger-soft' | 'link';

/**
 * Native <button>/<a> with the kit's look. Keeps native semantics (type, form submit, routerLink, href).
 *
 * <button ui-button variant="primary" icon="plus">Add user</button>
 * <button ui-button variant="secondary" [loading]="saving">Save draft</button>
 * <button ui-button variant="ghost" icon="edit" iconOnly aria-label="Edit"></button>
 * <a ui-button variant="link" routerLink="/users" iconRight="arrow-right">View all</a>
 */
@Component({
  selector: 'button[ui-button], a[ui-button]',
  standalone: true,
  imports: [NzIconModule],
  host: {
    class: 'ui-btn',
    '[class]': 'hostClasses()',
    '[attr.disabled]': 'isButton && (disabled() || loading()) ? "" : null',
    '[attr.aria-disabled]': '!isButton && (disabled() || loading()) ? "true" : null',
    '[attr.tabindex]': '!isButton && (disabled() || loading()) ? -1 : null',
    '[attr.aria-busy]': 'loading() || null',
    '[attr.type]': 'isButton ? type() : null',
    '(click)': 'guard($event)',
  },
  template: `
    @if (loading()) {
      <svg class="ui-btn-spin" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="42 100" /></svg>
    } @else if (icon()) {
      <span nz-icon [nzType]="icon()" class="ui-btn-icon"></span>
    }
    @if (!iconOnly()) {
      <span class="ui-btn-label"><ng-content /></span>
    }
    @if (iconRight() && !iconOnly()) {
      <span nz-icon [nzType]="iconRight()" class="ui-btn-icon ui-btn-icon-r"></span>
    }
  `,
  styles: [
    `
      :host {
        --h: 38px; --px: 16px; --fs: 14px; --r: var(--radius);
        position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        height: var(--h); padding: 0 var(--px); border: 1px solid transparent; border-radius: var(--r);
        font: inherit; font-size: var(--fs); font-weight: 600; line-height: 1; white-space: nowrap;
        text-decoration: none; cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent;
        transition: background 0.15s, border-color 0.15s, color 0.15s, box-shadow 0.15s, transform 0.05s;
      }
      :host:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ant-primary-color-outline); }
      :host:active:not([disabled]):not([aria-disabled='true']) { transform: translateY(1px); }
      :host([disabled]), :host([aria-disabled='true']) { cursor: not-allowed; opacity: 0.5; box-shadow: none; }
      :host([aria-busy='true']) { cursor: progress; opacity: 0.85; }

      :host(.s-sm) { --h: 30px; --px: 10px; --fs: 12.5px; --r: var(--radius-sm); gap: 6px; }
      :host(.s-lg) { --h: 46px; --px: 22px; --fs: 15px; }
      :host(.is-icon) { width: var(--h); padding: 0; }
      :host(.is-block) { display: flex; width: 100%; }
      :host(.is-pill) { --r: 999px; }

      :host(.v-primary) { background: var(--jade-600); color: #fff; box-shadow: 0 1px 0 rgba(255,255,255,.15) inset, 0 4px 12px -4px rgba(13,138,116,.55); }
      :host(.v-primary:hover:not([disabled])) { background: var(--jade-500); color: #fff; }
      :host(.v-secondary) { background: var(--surface); color: var(--text); border-color: var(--border-strong); }
      :host(.v-secondary:hover:not([disabled])) { border-color: var(--jade-500); color: var(--jade-700); background: var(--jade-50); }
      :host(.v-soft) { background: var(--jade-50); color: var(--jade-700); }
      :host(.v-soft:hover:not([disabled])) { background: var(--jade-100); }
      :host(.v-ghost) { background: transparent; color: var(--text-2); }
      :host(.v-ghost:hover:not([disabled])) { background: var(--surface-2); color: var(--text); }
      :host(.v-dark) { background: var(--ink-900); color: #fff; }
      :host(.v-dark:hover:not([disabled])) { background: var(--ink-700); }
      :host(.v-danger) { background: var(--danger); color: #fff; }
      :host(.v-danger:hover:not([disabled])) { background: #d43a3f; }
      :host(.v-danger-soft) { background: var(--danger-bg); color: var(--danger); }
      :host(.v-danger-soft:hover:not([disabled])) { background: #fbd9da; }
      :host(.v-link) { height: auto; padding: 0; background: none; color: var(--jade-600); border: 0; }
      :host(.v-link:hover:not([disabled])) { color: var(--jade-700); text-decoration: underline; }

      .ui-btn-icon { font-size: 1.1em; display: inline-flex; }
      .ui-btn-label:empty { display: none; }
      .ui-btn-spin { width: 1.05em; height: 1.05em; animation: ui-spin 0.8s linear infinite; }
      @keyframes ui-spin { to { transform: rotate(360deg); } }
    `,
  ],
})
export class UiButtonComponent {
  variant = input<UiButtonVariant>('secondary');
  size = input<UiSize>('md');
  icon = input('');
  iconRight = input('');
  /** Square button with only the icon. Always set aria-label. */
  iconOnly = input(false, { transform: booleanAttribute });
  loading = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  block = input(false, { transform: booleanAttribute });
  pill = input(false, { transform: booleanAttribute });
  type = input<'button' | 'submit' | 'reset'>('button');

  /** <a ui-button> can't take the disabled attribute, so it gets aria-disabled + tabindex instead. */
  readonly isButton = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName === 'BUTTON';

  /** Stops routerLink/href on a disabled or loading <a ui-button>. */
  guard(e: Event): void {
    if (this.disabled() || this.loading()) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }

  hostClasses = computed(
    () =>
      `ui-btn v-${this.variant()} s-${this.size()}` +
      (this.iconOnly() ? ' is-icon' : '') +
      (this.block() ? ' is-block' : '') +
      (this.pill() ? ' is-pill' : ''),
  );
}
