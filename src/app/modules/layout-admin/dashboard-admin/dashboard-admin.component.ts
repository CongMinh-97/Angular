import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AuthService } from '@services/auth.service';
import { ChartComponent, SERIES, SERIES_LIST, alpha, areaGradient } from '@shared/components/chart/chart.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { StatCardComponent, Tone } from '@shared/components/stat-card/stat-card.component';
import { UiAvatarComponent, UiButtonComponent, UiCardComponent, UiDialogService, UiOption, UiRadioGroupComponent, UiTagComponent, UiTone } from '@ui';

type Range = '7D' | '30D' | '12M';

const RANGE_DATA: Record<Range, { labels: string[]; current: number[]; previous: number[] }> = {
  '7D': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    current: [62, 71, 68, 84, 92, 76, 88],
    previous: [55, 60, 66, 70, 74, 69, 72],
  },
  '30D': {
    labels: ['1 Sep', '5 Sep', '9 Sep', '13 Sep', '17 Sep', '21 Sep', '25 Sep', '29 Sep'],
    current: [210, 248, 236, 290, 312, 298, 340, 362],
    previous: [190, 205, 220, 228, 251, 262, 270, 288],
  },
  '12M': {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    current: [1.42, 1.51, 1.88, 1.36, 1.44, 1.62, 1.71, 1.83, 1.96, 2.08, 2.21, 2.48],
    previous: [1.18, 1.24, 1.52, 1.1, 1.16, 1.31, 1.38, 1.46, 1.55, 1.62, 1.79, 2.1],
  },
};

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    NzTableModule,
    UiButtonComponent,
    UiCardComponent,
    UiTagComponent,
    UiAvatarComponent,
    UiRadioGroupComponent,
    ChartComponent,
    StatCardComponent,
    PageHeaderComponent,
  ],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss'],
})
export class DashboardAdminComponent {
  private auth = inject(AuthService);
  private dialog = inject(UiDialogService);

  readonly today = new Date();
  readonly greeting = computed(() => {
    const h = this.today.getHours();
    const name = this.auth.user()?.fullName.split(' ').pop() ?? '';
    return `${h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'}, ${name}`;
  });

  readonly rangeOptions: UiOption<Range>[] = [
    { label: '7D', value: '7D' },
    { label: '30D', value: '30D' },
    { label: '12M', value: '12M' },
  ];
  range = signal<Range>('12M');

  readonly kpis: { label: string; value: string; delta: number; icon: string; tone: Tone; series: number[]; hint?: string }[] = [
    { label: 'Revenue', value: '₫2.48 tỷ', delta: 18.2, icon: 'wallet', tone: 'jade', series: [12, 14, 13, 17, 16, 19, 21, 24] },
    { label: 'Orders', value: '3,842', delta: 6.4, icon: 'shopping-cart', tone: 'coral', series: [30, 28, 34, 33, 36, 35, 39, 41] },
    { label: 'Active users', value: '12,480', delta: 3.1, icon: 'team', tone: 'violet', series: [80, 82, 81, 85, 84, 86, 88, 89] },
    { label: 'Avg. resolution time', value: '3h 12m', delta: -8.5, icon: 'clock-circle', tone: 'amber', series: [5, 4.6, 4.8, 4.1, 3.9, 3.6, 3.4, 3.2], hint: 'faster than August' },
  ];

  // 1. Area line, two series, switchable range
  revenueData = computed<ChartData<'line'>>(() => {
    const d = RANGE_DATA[this.range()];
    return {
      labels: d.labels,
      datasets: [
        {
          label: 'This period',
          data: d.current,
          borderColor: SERIES.jade,
          backgroundColor: areaGradient(SERIES.jade, 0.3),
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointBackgroundColor: SERIES.jade,
        },
        {
          label: 'Previous period',
          data: d.previous,
          borderColor: SERIES.ink,
          borderDash: [5, 5],
          borderWidth: 1.8,
          tension: 0.4,
          pointRadius: 0,
          fill: false,
        },
      ],
    };
  });
  revenueOptions = computed<ChartOptions<'line'>>(() => {
    const unit = this.range() === '12M' ? ' tỷ' : ' tr';
    return {
      plugins: { legend: { position: 'top', align: 'end' }, tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ₫${c.parsed.y}${unit}` } } },
      scales: { y: { ticks: { callback: v => `₫${v}${unit}` } } },
    };
  });

  // 2. Doughnut
  channelData: ChartData<'doughnut'> = {
    labels: ['Online store', 'Retail', 'Marketplace', 'Wholesale'],
    datasets: [{ data: [46, 24, 19, 11], backgroundColor: [SERIES.jade, SERIES.coral, SERIES.violet, SERIES.amber], borderWidth: 0, hoverOffset: 6 }],
  };
  channelOptions: ChartOptions<'doughnut'> = { cutout: '72%', plugins: { legend: { position: 'bottom' } } };

  // 3. Stacked bar
  regionData: ChartData<'bar'> = {
    labels: ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Huế'],
    datasets: [
      { label: 'New', data: [420, 610, 180, 120, 160, 90], backgroundColor: SERIES.jade, borderRadius: 4, maxBarThickness: 28 },
      { label: 'Returning', data: [310, 480, 140, 90, 110, 70], backgroundColor: SERIES.violet, borderRadius: 4, maxBarThickness: 28 },
      { label: 'Wholesale', data: [90, 160, 40, 30, 50, 20], backgroundColor: SERIES.amber, borderRadius: 4, maxBarThickness: 28 },
    ],
  };
  stackedOptions: ChartOptions<'bar'> = { scales: { x: { stacked: true }, y: { stacked: true } } };

  // 4. Mixed bar + line with dual axis
  mixedData: ChartData = {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      { type: 'bar', label: 'Sign-ups', data: [820, 940, 1010, 1180, 1250, 1420], backgroundColor: alpha(SERIES.ink, 0.85), borderRadius: 6, maxBarThickness: 32, yAxisID: 'y', order: 2 },
      { type: 'line', label: 'Conversion %', data: [2.4, 2.7, 2.6, 3.1, 3.3, 3.6], borderColor: SERIES.coral, backgroundColor: SERIES.coral, tension: 0.35, borderWidth: 2.5, pointRadius: 3, yAxisID: 'y1', order: 1 },
    ],
  };
  mixedOptions: ChartOptions = {
    scales: {
      y1: { position: 'right', grid: { display: false }, border: { display: false }, ticks: { callback: v => `${v}%` }, beginAtZero: true },
    },
  };

  // 5. Radar
  radarData: ChartData<'radar'> = {
    labels: ['Speed', 'Quality', 'Response', 'Satisfaction', 'Accuracy', 'Upsell'],
    datasets: [
      { label: 'Support A', data: [86, 78, 92, 88, 74, 60], borderColor: SERIES.jade, backgroundColor: alpha(SERIES.jade, 0.18), pointBackgroundColor: SERIES.jade, borderWidth: 2 },
      { label: 'Support B', data: [70, 88, 74, 80, 90, 72], borderColor: SERIES.coral, backgroundColor: alpha(SERIES.coral, 0.14), pointBackgroundColor: SERIES.coral, borderWidth: 2 },
    ],
  };

  // 6. Polar area
  polarData: ChartData<'polarArea'> = {
    labels: ['Billing', 'Shipping', 'Account', 'Product', 'Returns'],
    datasets: [{ data: [42, 68, 30, 54, 24], backgroundColor: SERIES_LIST.slice(0, 5).map(c => alpha(c, 0.75)), borderWidth: 0 }],
  };
  polarOptions: ChartOptions<'polarArea'> = { plugins: { legend: { position: 'bottom' } } };

  // 7. Pie
  pieData: ChartData<'pie'> = {
    labels: ['Organic search', 'Direct', 'Social', 'Email', 'Referral'],
    datasets: [{ data: [38, 24, 18, 12, 8], backgroundColor: [SERIES.jade, SERIES.ink, SERIES.coral, SERIES.violet, SERIES.amber], borderColor: '#fff', borderWidth: 2 }],
  };
  pieOptions: ChartOptions<'pie'> = { plugins: { legend: { position: 'bottom' } } };

  // 8. Bubble
  bubbleData: ChartData<'bubble'> = {
    datasets: [
      { label: 'Enterprise', data: [{ x: 62, y: 420, r: 16 }, { x: 74, y: 510, r: 20 }, { x: 88, y: 640, r: 24 }, { x: 55, y: 360, r: 12 }], backgroundColor: alpha(SERIES.violet, 0.55), borderColor: SERIES.violet },
      { label: 'Mid-market', data: [{ x: 32, y: 180, r: 10 }, { x: 40, y: 240, r: 13 }, { x: 46, y: 210, r: 9 }, { x: 28, y: 150, r: 8 }, { x: 52, y: 280, r: 14 }], backgroundColor: alpha(SERIES.jade, 0.55), borderColor: SERIES.jade },
      { label: 'SMB', data: [{ x: 12, y: 40, r: 6 }, { x: 18, y: 65, r: 8 }, { x: 9, y: 30, r: 5 }, { x: 22, y: 90, r: 7 }, { x: 15, y: 55, r: 6 }], backgroundColor: alpha(SERIES.coral, 0.55), borderColor: SERIES.coral },
    ],
  };
  bubbleOptions: ChartOptions<'bubble'> = {
    interaction: { mode: 'nearest', intersect: true },
    scales: {
      x: { title: { display: true, text: 'Sales cycle (days)', color: '#8a92a6' }, grid: { display: true, color: '#edf0f5' } },
      y: { title: { display: true, text: 'Deal size (₫ tr)', color: '#8a92a6' } },
    },
  };

  // 9. Horizontal bar
  productData: ChartData<'bar'> = {
    labels: ['Harbor Pro plan', 'Team seats', 'Onboarding pack', 'API add-on', 'Priority support'],
    datasets: [{ label: 'Revenue (₫ tr)', data: [842, 615, 388, 296, 174], backgroundColor: [SERIES.jade, alpha(SERIES.jade, 0.8), alpha(SERIES.jade, 0.6), alpha(SERIES.jade, 0.45), alpha(SERIES.jade, 0.3)], borderRadius: 6, barThickness: 18 }],
  };
  productOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: true, color: '#edf0f5' } }, y: { grid: { display: false } } },
  };

  // 10. Scatter
  scatterData: ChartData<'scatter'> = {
    datasets: [
      {
        label: 'Accounts',
        data: [[8, 92], [14, 88], [20, 85], [26, 81], [31, 76], [36, 74], [42, 69], [48, 63], [55, 60], [60, 52], [12, 80], [24, 90], [38, 66], [50, 70], [58, 48], [18, 72], [44, 58], [33, 84]].map(([x, y]) => ({ x, y })),
        backgroundColor: alpha(SERIES.sky, 0.7),
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };
  scatterOptions: ChartOptions<'scatter'> = {
    interaction: { mode: 'nearest', intersect: true },
    plugins: { legend: { display: false } },
    scales: {
      x: { title: { display: true, text: 'Support tickets / month', color: '#8a92a6' }, grid: { display: true, color: '#edf0f5' } },
      y: { title: { display: true, text: 'Health score', color: '#8a92a6' }, min: 40, max: 100, beginAtZero: false },
    },
  };

  // 11. Multi-line
  latencyData: ChartData<'line'> = {
    labels: ['00h', '03h', '06h', '09h', '12h', '15h', '18h', '21h'],
    datasets: [
      { label: 'p50', data: [120, 110, 118, 160, 185, 172, 150, 130], borderColor: SERIES.jade, backgroundColor: SERIES.jade, tension: 0.3, pointRadius: 0, borderWidth: 2 },
      { label: 'p95', data: [260, 240, 255, 340, 410, 380, 320, 280], borderColor: SERIES.amber, backgroundColor: SERIES.amber, tension: 0.3, pointRadius: 0, borderWidth: 2 },
      { label: 'p99', data: [410, 380, 400, 560, 690, 640, 520, 450], borderColor: SERIES.coral, backgroundColor: SERIES.coral, tension: 0.3, pointRadius: 0, borderWidth: 2 },
    ],
  };
  latencyOptions: ChartOptions<'line'> = { scales: { y: { ticks: { callback: v => `${v} ms` } } } };

  readonly orders = [
    { id: 'HB-10482', customer: 'Công ty TNHH Sao Mai', amount: 48500000, status: 'Paid', date: '2026-09-30T09:12:00' },
    { id: 'HB-10481', customer: 'Lê Thảo Vy', amount: 3250000, status: 'Processing', date: '2026-09-30T08:40:00' },
    { id: 'HB-10480', customer: 'Bếp Nhà Mây', amount: 12800000, status: 'Paid', date: '2026-09-29T17:05:00' },
    { id: 'HB-10479', customer: 'Phạm Quốc Huy', amount: 980000, status: 'Refunded', date: '2026-09-29T14:22:00' },
    { id: 'HB-10478', customer: 'Studio Ánh Dương', amount: 22400000, status: 'Overdue', date: '2026-09-28T10:51:00' },
  ];

  readonly statusTone: Record<string, UiTone> = { Paid: 'success', Processing: 'info', Refunded: 'neutral', Overdue: 'danger' };

  readonly activity = [
    { who: 'Trần Linh', what: 'invited 4 people to Marketing', when: '8 min ago', tone: 'jade' },
    { who: 'Import job', what: 'added 42 users from users-sep.csv', when: '1 h ago', tone: 'violet' },
    { who: 'Võ Nam', what: 'published “Q3 product update”', when: '3 h ago', tone: 'ink' },
    { who: 'Billing', what: 'flagged invoice #INV-2091 as overdue', when: 'Yesterday', tone: 'coral' },
    { who: 'Đỗ Mai', what: 'changed role of Bùi Tâm to Manager', when: 'Yesterday', tone: 'amber' },
  ];

  export(): void {
    this.dialog.success('Report queued. You will get an email when it is ready.');
  }
}
