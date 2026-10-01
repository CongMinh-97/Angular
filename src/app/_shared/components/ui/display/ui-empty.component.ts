import { Component, input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

/**
 * Empty or zero-result state. Say what is missing and offer the next step.
 *
 * <ui-empty icon="team" heading="No users yet" description="Invite your first teammate to get started.">
 *   <button ui-button variant="primary" icon="plus">Invite</button>
 * </ui-empty>
 */
@Component({
  selector: 'ui-empty',
  standalone: true,
  imports: [NzIconModule],
  host: { '[class]': '"s-" + size()' },
  template: `
    <span class="ui-em-icon"><span nz-icon [nzType]="icon()"></span></span>
    <strong>{{ heading() }}</strong>
    @if (description()) {
      <p>{{ description() }}</p>
    }
    <div class="ui-em-actions"><ng-content /></div>
  `,
  styles: [
    `
      :host { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 40px 16px; }
      :host(.s-sm) { padding: 20px 12px; }
      .ui-em-icon { width: 52px; height: 52px; margin-bottom: 14px; border-radius: 16px; display: grid; place-items: center; font-size: 22px; color: var(--text-3); background: var(--surface-2); box-shadow: inset 0 0 0 1px var(--border); }
      :host(.s-sm) .ui-em-icon { width: 40px; height: 40px; font-size: 18px; margin-bottom: 10px; }
      strong { font-size: 15px; color: var(--text); }
      p { margin: 4px 0 0; max-width: 40ch; font-size: 13px; color: var(--text-2); }
      .ui-em-actions { display: flex; gap: 8px; margin-top: 16px; }
      .ui-em-actions:empty { display: none; }
    `,
  ],
})
export class UiEmptyComponent {
  icon = input('inbox');
  heading = input('Nothing here yet');
  description = input('');
  size = input<'sm' | 'md'>('md');
}
