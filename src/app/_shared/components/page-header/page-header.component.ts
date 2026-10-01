import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="ph">
      <div class="ph-text">
        @if (eyebrow()) {
          <span class="eyebrow">{{ eyebrow() }}</span>
        }
        <h1>{{ title() }}</h1>
        @if (subtitle()) {
          <p>{{ subtitle() }}</p>
        }
      </div>
      <div class="ph-actions"><ng-content /></div>
    </div>
  `,
  styles: [
    `
      .ph {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 16px 24px;
        flex-wrap: wrap;
        margin-bottom: 24px;
      }
      .ph-text {
        min-width: 0;
      }
      h1 {
        font-size: 26px;
        line-height: 1.2;
        font-weight: 800;
        letter-spacing: -0.02em;
        margin-top: 4px;
      }
      p {
        margin: 6px 0 0;
        color: var(--text-2);
        max-width: 62ch;
      }
      .ph-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .ph-actions:empty {
        display: none;
      }
      @media (max-width: 639px) {
        h1 {
          font-size: 22px;
        }
      }
    `,
  ],
})
export class PageHeaderComponent {
  title = input.required<string>();
  subtitle = input<string>();
  eyebrow = input<string>();
}
