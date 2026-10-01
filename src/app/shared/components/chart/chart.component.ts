import { AfterViewInit, Component, ElementRef, OnDestroy, effect, input, untracked, viewChild } from '@angular/core';
import { Chart, ChartData, ChartOptions, ChartType, registerables } from 'chart.js';
import { merge } from 'chart.js/helpers';

Chart.register(...registerables);
Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = '#8a92a6';

/** Series colours, ordered for maximum adjacent contrast. */
export const SERIES = {
  jade: '#0d8a74',
  coral: '#f2643a',
  violet: '#7b61ff',
  amber: '#f5a524',
  ink: '#2d3e63',
  sky: '#3a8ef6',
};
export const SERIES_LIST = Object.values(SERIES);

export function alpha(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/** Vertical gradient for area fills; resolves lazily once the chart has a size. */
export function areaGradient(hex: string, top = 0.28) {
  return (ctx: { chart: Chart }) => {
    const { ctx: c, chartArea } = ctx.chart;
    if (!chartArea) return alpha(hex, top / 2);
    const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    g.addColorStop(0, alpha(hex, top));
    g.addColorStop(1, alpha(hex, 0));
    return g;
  };
}

const GRID = '#edf0f5';

function themeFor(type: ChartType): ChartOptions {
  const common: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600 },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8, boxHeight: 8, padding: 16, color: '#586178', font: { weight: 600 } },
      },
      tooltip: {
        backgroundColor: '#161b31',
        titleColor: '#fff',
        bodyColor: '#c4cbe0',
        padding: 12,
        cornerRadius: 10,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: { weight: 700 },
      },
    },
  };

  if (type === 'pie' || type === 'doughnut') {
    return merge(common, { plugins: { legend: { position: 'right' } } } as ChartOptions);
  }
  if (type === 'radar' || type === 'polarArea') {
    return merge(common, {
      scales: {
        r: {
          grid: { color: GRID },
          angleLines: { color: GRID },
          pointLabels: { color: '#586178', font: { size: 12, weight: 600 } },
          ticks: { display: false, backdropColor: 'transparent' },
          beginAtZero: true,
        },
      },
    } as ChartOptions);
  }
  return merge(common, {
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: { grid: { display: false }, border: { display: false }, ticks: { color: '#8a92a6' } },
      y: { grid: { color: GRID }, border: { display: false }, ticks: { color: '#8a92a6', padding: 8 }, beginAtZero: true },
    },
  } as ChartOptions);
}

@Component({
  selector: 'app-chart',
  standalone: true,
  template: `<div class="wrap" [style.height.px]="height()"><canvas #canvas [attr.aria-label]="label()" role="img"></canvas></div>`,
  styles: [':host{display:block;min-width:0}.wrap{position:relative;width:100%}'],
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  type = input.required<ChartType>();
  data = input.required<ChartData>();
  options = input<ChartOptions>({});
  height = input(280);
  label = input('Chart');

  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart?: Chart;
  private renderedType?: ChartType;
  private ready = false;

  constructor() {
    effect(() => {
      const type = this.type();
      const data = this.data();
      const options = this.options();
      if (!this.ready) return;
      untracked(() => {
        if (this.chart && this.renderedType === type) {
          this.chart.data = data;
          this.chart.options = merge(themeFor(type), options);
          this.chart.update();
        } else {
          this.render();
        }
      });
    });
  }

  ngAfterViewInit(): void {
    this.ready = true;
    this.render();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private render(): void {
    this.chart?.destroy();
    const type = this.type();
    this.renderedType = type;
    this.chart = new Chart(this.canvas().nativeElement, {
      type,
      data: this.data(),
      options: merge(themeFor(type), this.options()),
    });
  }
}
