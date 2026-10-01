import { Component, computed, input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

export type Tone = 'jade' | 'coral' | 'violet' | 'amber' | 'ink' | 'sky';

const TONE_HEX: Record<Tone, string> = {
  jade: '#0d8a74',
  coral: '#f2643a',
  violet: '#7b61ff',
  amber: '#e0950f',
  ink: '#2d3e63',
  sky: '#3a8ef6',
};

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [NzIconModule],
  template: `
    <div class="card" [attr.data-tone]="tone()">
      <div class="top">
        <span class="icon"><span nz-icon [nzType]="icon()"></span></span>
        <span class="label">{{ label() }}</span>
      </div>
      <div class="mid">
        <div class="value num">{{ value() }}</div>
        @if (series().length > 1) {
          <svg class="spark" viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden="true">
            <path [attr.d]="area()" [attr.fill]="color()" fill-opacity="0.12" />
            <path [attr.d]="line()" fill="none" [attr.stroke]="color()" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke" />
          </svg>
        }
      </div>
      <div class="foot">
        <span class="delta" [class.down]="delta() < 0">
          <span nz-icon [nzType]="delta() < 0 ? 'arrow-down' : 'arrow-up'"></span>{{ abs() }}%
        </span>
        <span class="hint">{{ hint() }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; min-width: 0; }
      .card {
        height: 100%;
        padding: 18px 18px 16px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xs);
        transition: box-shadow 0.2s, transform 0.2s;
      }
      .card:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
      .top { display: flex; align-items: center; gap: 10px; }
      .icon {
        width: 34px; height: 34px; border-radius: 10px;
        display: grid; place-items: center; font-size: 16px;
        color: var(--tone); background: var(--tone-bg);
      }
      .label { font-size: 13px; font-weight: 600; color: var(--text-2); }
      .mid { margin-top: 14px; display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; }
      .value { font-size: 28px; line-height: 1.1; font-weight: 800; letter-spacing: -0.02em; color: var(--text); }
      .foot { margin-top: 10px; display: flex; align-items: center; flex-wrap: wrap; gap: 6px 8px; font-size: 12px; }
      .delta {
        display: inline-flex; align-items: center; gap: 3px;
        padding: 1px 7px; border-radius: 999px; font-weight: 700;
        color: var(--success); background: var(--success-bg);
      }
      .delta.down { color: var(--danger); background: var(--danger-bg); }
      .hint { color: var(--text-3); }
      .spark { flex: none; width: 96px; height: 36px; overflow: visible; }
      [data-tone='jade'] { --tone: var(--jade-600); --tone-bg: var(--jade-50); }
      [data-tone='coral'] { --tone: var(--coral-600); --tone-bg: var(--coral-100); }
      [data-tone='violet'] { --tone: var(--violet-500); --tone-bg: var(--violet-100); }
      [data-tone='amber'] { --tone: #b8770a; --tone-bg: var(--amber-100); }
      [data-tone='ink'] { --tone: var(--ink-700); --tone-bg: #e8ebf3; }
      [data-tone='sky'] { --tone: var(--sky-500); --tone-bg: var(--sky-100); }
    `,
  ],
})
export class StatCardComponent {
  label = input.required<string>();
  value = input.required<string>();
  delta = input(0);
  hint = input('vs last month');
  icon = input('bar-chart');
  tone = input<Tone>('jade');
  series = input<number[]>([]);

  abs = computed(() => Math.abs(this.delta()).toFixed(1));
  color = computed(() => TONE_HEX[this.tone()]);

  private points = computed(() => {
    const s = this.series();
    const min = Math.min(...s);
    const max = Math.max(...s);
    const span = max - min || 1;
    return s.map((v, i) => [(i / (s.length - 1)) * 120, 36 - ((v - min) / span) * 30] as const);
  });

  line = computed(() => this.points().map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' '));
  area = computed(() => `${this.line()} L120 40 L0 40 Z`);
}
