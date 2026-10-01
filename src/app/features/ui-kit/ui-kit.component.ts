import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { StatCardComponent } from '@shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-ui-kit',
  standalone: true,
  imports: [
    FormsModule,
    NzButtonModule,
    NzModalModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzSwitchModule,
    NzCheckboxModule,
    NzRadioModule,
    NzSliderModule,
    NzSegmentedModule,
    NzAlertModule,
    NzProgressModule,
    NzTabsModule,
    NzToolTipModule,
    PageHeaderComponent,
    StatCardComponent,
  ],
  templateUrl: './ui-kit.component.html',
  styleUrls: ['./ui-kit.component.scss'],
})
export class UiKitComponent {
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);
  private notification = inject(NzNotificationService);

  readonly palette = [
    { group: 'Brand', items: [
      { name: 'Ink 950', token: '--ink-950', hex: '#0F1324', dark: true },
      { name: 'Ink 700', token: '--ink-700', hex: '#2D3E63', dark: true },
      { name: 'Jade 600', token: '--jade-600', hex: '#0D8A74', dark: true },
      { name: 'Jade 300', token: '--jade-300', hex: '#2FD3B0' },
      { name: 'Coral 500', token: '--coral-500', hex: '#F2643A', dark: true },
    ] },
    { group: 'Chart series', items: [
      { name: 'Violet 500', token: '--violet-500', hex: '#7B61FF', dark: true },
      { name: 'Amber 500', token: '--amber-500', hex: '#F5A524' },
      { name: 'Sky 500', token: '--sky-500', hex: '#3A8EF6', dark: true },
    ] },
    { group: 'Neutrals', items: [
      { name: 'Text', token: '--text', hex: '#121729', dark: true },
      { name: 'Text 2', token: '--text-2', hex: '#586178', dark: true },
      { name: 'Border', token: '--border', hex: '#E3E7EF' },
      { name: 'Canvas', token: '--bg', hex: '#F3F5F9' },
    ] },
  ];

  readonly typeScale = [
    { label: 'Display', size: 30, weight: 800, sample: 'Every team, one calm place' },
    { label: 'Page title', size: 26, weight: 800, sample: 'Users' },
    { label: 'Section', size: 16, weight: 700, sample: 'Revenue by channel' },
    { label: 'Body', size: 14, weight: 500, sample: 'Invite people, change their role, or remove access.' },
    { label: 'Caption', size: 12.5, weight: 500, sample: 'Figures update every 15 minutes' },
  ];

  text = 'Nguyễn Minh Anh';
  role = 'Editor';
  date: Date | null = new Date();
  notify = true;
  agree = true;
  plan = 'team';
  seats = 24;
  view = 1; // nz-segmented binds the option index
  copied = signal<string | null>(null);

  copy(hex: string): void {
    navigator.clipboard?.writeText(hex).then(
      () => {
        this.copied.set(hex);
        setTimeout(() => this.copied.set(null), 1200);
      },
      () => this.message.info(hex),
    );
  }

  toast(type: 'success' | 'info' | 'warning' | 'error'): void {
    const text = { success: 'Changes saved', info: 'Sync starts in 5 minutes', warning: 'Your trial ends in 3 days', error: 'Could not reach the server' }[type];
    this.message[type](text);
  }

  confirm(): void {
    this.modal.confirm({
      nzTitle: 'Remove Lê Thảo Vy from the workspace?',
      nzContent: 'She will lose access to all projects immediately. You can invite her again later.',
      nzOkText: 'Remove',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => this.message.success('Lê Thảo Vy was removed'),
    });
  }

  notifyMe(): void {
    this.notification.success('Import finished', '42 users were added and invited. 2 rows were skipped because the email already exists.');
  }
}
