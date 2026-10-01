import { Component, booleanAttribute, computed, input, output, signal } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

export type UiAlertTone = 'info' | 'success' | 'warning' | 'danger';

const ICONS: Record<UiAlertTone, string> = {
  info: 'info-circle',
  success: 'check-circle',
  warning: 'exclamation-circle',
  danger: 'close-circle',
};

/**
 * Inline message about the state of a page or section.
 *
 * <ui-alert tone="warning" heading="Two rows were skipped">Their emails already exist.</ui-alert>
 * <ui-alert tone="danger" closable>Payment failed. <a href="/billing">Update card</a></ui-alert>
 */
@Component({
  selector: 'ui-alert',
  standalone: true,
  imports: [NzIconModule],
  host: { '[class]': '"t-" + tone() + " v-" + variant()', '[attr.role]': "tone() === 'danger' ? 'alert' : 'status'", '[hidden]': 'dismissed()' },
  template: `
    <span nz-icon [nzType]="iconName()" nzTheme="fill" class="ui-al-icon"></span>
    <div class="ui-al-body">
      @if (heading()) {
        <strong>{{ heading() }}</strong>
      }
      <div class="ui-al-text"><ng-content /></div>
      <div class="ui-al-actions"><ng-content select="[uiAlertActions]" /></div>
    </div>
    @if (closable()) {
      <button type="button" class="ui-al-x" (click)="dismiss()" aria-label="Dismiss">
        <span nz-icon nzType="close"></span>
      </button>
    }
  `,
  styles: [
    `
      :host { --c: var(--info); --bg: var(--info-bg); display: flex; gap: 10px; align-items: flex-start; padding: 12px 14px; border-radius: var(--radius); background: var(--bg); color: var(--text); font-size: 13.5px; line-height: 1.5; }
      :host(.v-outline) { background: var(--surface); box-shadow: inset 0 0 0 1px var(--c); }
      :host(.v-accent) { background: var(--surface); box-shadow: inset 3px 0 0 var(--c), inset 0 0 0 1px var(--border); }
      :host(.t-success) { --c: var(--success); --bg: var(--success-bg); }
      :host(.t-warning) { --c: var(--warning); --bg: var(--warning-bg); }
      :host(.t-danger) { --c: var(--danger); --bg: var(--danger-bg); }
      .ui-al-icon { flex: none; margin-top: 3px; color: var(--c); font-size: 15px; }
      .ui-al-body { flex: 1; min-width: 0; }
      strong { display: block; font-weight: 700; }
      .ui-al-text { color: var(--text-2); }
      .ui-al-text:empty { display: none; }
      .ui-al-actions { display: flex; gap: 8px; margin-top: 8px; }
      .ui-al-actions:empty { display: none; }
      .ui-al-x { flex: none; width: 24px; height: 24px; margin: -2px -4px 0 0; border: 0; border-radius: 6px; background: none; color: var(--text-3); cursor: pointer; }
      .ui-al-x:hover { color: var(--text); background: rgba(0, 0, 0, 0.05); }
    `,
  ],
})
export class UiAlertComponent {
  tone = input<UiAlertTone>('info');
  variant = input<'soft' | 'outline' | 'accent'>('soft');
  heading = input('');
  icon = input('');
  closable = input(false, { transform: booleanAttribute });
  closed = output<void>();

  dismissed = signal(false);
  iconName = computed(() => this.icon() || ICONS[this.tone()]);

  dismiss(): void {
    this.dismissed.set(true);
    this.closed.emit();
  }
}
