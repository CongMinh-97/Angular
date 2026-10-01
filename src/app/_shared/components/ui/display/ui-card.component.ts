import { Component, input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

/**
 * Surface for a group of related content.
 *
 * <ui-card heading="Revenue" subtitle="Last 12 months">
 *   <ui-tag uiCardActions tone="success">Live</ui-tag>
 *   …body…
 *   <div uiCardFooter>…</div>
 * </ui-card>
 */
@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [NzIconModule],
  host: { '[class]': '"v-" + variant() + " p-" + padding()' },
  template: `
    @if (heading() || subtitle()) {
      <header class="ui-card-head">
        @if (icon()) {
          <span class="ui-card-icon"><span nz-icon [nzType]="icon()"></span></span>
        }
        <div class="ui-card-titles">
          @if (heading()) {
            <h3>{{ heading() }}</h3>
          }
          @if (subtitle()) {
            <p>{{ subtitle() }}</p>
          }
        </div>
        <div class="ui-card-actions"><ng-content select="[uiCardActions]" /></div>
      </header>
    }
    <div class="ui-card-body"><ng-content /></div>
    <footer class="ui-card-foot"><ng-content select="[uiCardFooter]" /></footer>
  `,
  styles: [
    `
      :host { --pad: 20px; display: flex; flex-direction: column; min-width: 0; background: var(--surface); border-radius: var(--radius-lg); }
      :host(.v-default) { border: 1px solid var(--border); box-shadow: var(--shadow-xs); }
      :host(.v-elevated) { box-shadow: var(--shadow-md); }
      :host(.v-flat) { background: var(--surface-2); }
      :host(.p-none) { --pad: 0px; }
      :host(.p-sm) { --pad: 14px; }
      :host(.p-lg) { --pad: 28px; }
      .ui-card-head { display: flex; align-items: center; gap: 12px; padding: 18px 20px 0; }
      :host(.p-none) .ui-card-head { padding: 16px 16px 12px; }
      .ui-card-icon { flex: none; width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; color: var(--jade-600); background: var(--jade-50); }
      .ui-card-titles { flex: 1; min-width: 0; }
      h3 { margin: 0; font-size: 15px; font-weight: 700; }
      p { margin: 2px 0 0; font-size: 12.5px; color: var(--text-3); }
      .ui-card-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
      .ui-card-actions:empty { display: none; }
      .ui-card-body { flex: 1; min-width: 0; padding: var(--pad); }
      .ui-card-foot { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 12px 20px; border-top: 1px solid var(--border); }
      .ui-card-foot:empty { display: none; }
    `,
  ],
})
export class UiCardComponent {
  heading = input('');
  subtitle = input('');
  icon = input('');
  variant = input<'default' | 'elevated' | 'flat'>('default');
  padding = input<'none' | 'sm' | 'md' | 'lg'>('md');
}
