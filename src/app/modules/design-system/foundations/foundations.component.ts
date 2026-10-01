import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { UiAlertComponent, UiButtonComponent, UiCardComponent, UiDialogService } from '@ui';

@Component({
  selector: 'app-foundations',
  standalone: true,
  imports: [RouterLink, NzIconModule, PageHeaderComponent, UiCardComponent, UiAlertComponent, UiButtonComponent],
  templateUrl: './foundations.component.html',
  styleUrls: ['./foundations.component.scss'],
})
export class FoundationsComponent {
  private dialog = inject(UiDialogService);

  readonly palette = [
    {
      group: 'Brand',
      items: [
        { name: 'Ink 950', token: '--ink-950', hex: '#0F1324', dark: true, use: 'Sidebar, dark surfaces' },
        { name: 'Ink 700', token: '--ink-700', hex: '#2D3E63', dark: true, use: 'Secondary series' },
        { name: 'Jade 600', token: '--jade-600', hex: '#0D8A74', dark: true, use: 'Primary actions, focus' },
        { name: 'Jade 300', token: '--jade-300', hex: '#2FD3B0', use: 'Accents on dark' },
        { name: 'Coral 500', token: '--coral-500', hex: '#F2643A', dark: true, use: 'Highlights' },
      ],
    },
    {
      group: 'Chart series',
      items: [
        { name: 'Violet 500', token: '--violet-500', hex: '#7B61FF', dark: true, use: 'Series 3' },
        { name: 'Amber 500', token: '--amber-500', hex: '#F5A524', use: 'Series 4' },
        { name: 'Sky 500', token: '--sky-500', hex: '#3A8EF6', dark: true, use: 'Series 6' },
      ],
    },
    {
      group: 'Semantic',
      items: [
        { name: 'Success', token: '--success', hex: '#1E9E62', dark: true, use: 'Done, active' },
        { name: 'Warning', token: '--warning', hex: '#C27C00', dark: true, use: 'Needs attention' },
        { name: 'Danger', token: '--danger', hex: '#E5484D', dark: true, use: 'Errors, destructive' },
        { name: 'Info', token: '--info', hex: '#3A7BF7', dark: true, use: 'Neutral notices' },
      ],
    },
    {
      group: 'Neutrals',
      items: [
        { name: 'Text', token: '--text', hex: '#121729', dark: true, use: 'Body text' },
        { name: 'Text 2', token: '--text-2', hex: '#586178', dark: true, use: 'Secondary text' },
        { name: 'Text 3', token: '--text-3', hex: '#8A92A6', dark: true, use: 'Hints, captions' },
        { name: 'Border', token: '--border', hex: '#E3E7EF', use: 'Dividers, cards' },
        { name: 'Canvas', token: '--bg', hex: '#F3F5F9', use: 'Page background' },
      ],
    },
  ];

  readonly typeScale = [
    { label: 'Display', size: 30, weight: 800, sample: 'Every team, one calm place' },
    { label: 'Page title', size: 26, weight: 800, sample: 'Users' },
    { label: 'Section', size: 22, weight: 800, sample: 'Date range picker' },
    { label: 'Card title', size: 15, weight: 700, sample: 'Revenue by channel' },
    { label: 'Body', size: 14, weight: 500, sample: 'Invite people, change their role, or remove access.' },
    { label: 'Caption', size: 12.5, weight: 500, sample: 'Figures update every 15 minutes' },
    { label: 'Eyebrow', size: 11, weight: 700, sample: 'MANAGEMENT' },
  ];

  readonly radii = [
    { token: '--radius-sm', px: 6, use: 'Small buttons, tags' },
    { token: '--radius', px: 10, use: 'Inputs, buttons' },
    { token: '--radius-lg', px: 14, use: 'Cards, tables' },
    { token: '--radius-xl', px: 20, use: 'Modals' },
  ];

  readonly shadows = [
    { token: '--shadow-xs', use: 'Resting cards' },
    { token: '--shadow-md', use: 'Hover, dropdowns' },
    { token: '--shadow-lg', use: 'Modals' },
  ];

  readonly heights = [
    { size: 'sm', px: 30, use: 'Dense toolbars, table actions' },
    { size: 'md', px: 38, use: 'Default for every control' },
    { size: 'lg', px: 46, use: 'Sign-in, hero forms' },
  ];

  copied = signal<string | null>(null);

  copy(hex: string): void {
    navigator.clipboard?.writeText(hex).then(
      () => {
        this.copied.set(hex);
        setTimeout(() => this.copied.set(null), 1200);
      },
      () => this.dialog.info(hex),
    );
  }
}
