import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { Subscription, finalize, firstValueFrom } from 'rxjs';
import { DEPARTMENTS, ListQuery, USER_ROLES, UserRecord } from '@models/layout-admin/user.model';
import { UserService } from '@services/layout-admin/user.service';
import { CellDefDirective, DataTableComponent, TableColumn } from '@shared/components/data-table/data-table.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import {
  UiAvatarComponent,
  UiButtonComponent,
  UiDialogService,
  UiMultiSelectComponent,
  UiTagComponent,
} from '@ui';
import { ROLE_TONE, STATUS_LABEL, STATUS_TONE } from './constants/user-admin.const';
import { UserFormModalComponent } from './modals/user-form-modal/user-form-modal.component';

@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    CurrencyPipe,
    NzPopconfirmModule,
    NzToolTipModule,
    PageHeaderComponent,
    DataTableComponent,
    CellDefDirective,
    UiButtonComponent,
    UserFormModalComponent,
    UiMultiSelectComponent,
    UiTagComponent,
    UiAvatarComponent,
  ],
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.scss'],
})
export class UserAdminComponent {
  private users = inject(UserService);
  private dialog = inject(UiDialogService);
  private destroyRef = inject(DestroyRef);

  readonly statusLabel = STATUS_LABEL;
  readonly statusTone = STATUS_TONE;
  readonly roleTone = ROLE_TONE;
  readonly departmentOptions = DEPARTMENTS.map(d => ({ label: d, value: d }));

  readonly columns: TableColumn[] = [
    { key: 'name', title: 'Name', width: '260px', sortable: true, fixed: 'left', locked: true },
    { key: 'role', title: 'Role', width: '130px', sortable: true, filters: USER_ROLES.map(r => ({ text: r, value: r })) },
    { key: 'department', title: 'Department', width: '150px', sortable: true },
    { key: 'status', title: 'Status', width: '130px', filters: Object.entries(STATUS_LABEL).map(([value, text]) => ({ text, value })) },
    { key: 'phone', title: 'Phone', width: '140px' },
    { key: 'spend', title: 'Lifetime spend', width: '160px', sortable: true, align: 'right' },
    { key: 'createdAt', title: 'Joined', width: '130px', sortable: true },
    { key: 'lastActive', title: 'Last active', width: '150px', sortable: true },
    { key: 'actions', title: '', width: '104px', align: 'right', fixed: 'right', locked: true },
  ];

  query = signal<ListQuery>({ page: 1, pageSize: 10 });
  rows = signal<UserRecord[]>([]);
  total = signal(0);
  loading = signal(false);
  selected = signal<Set<number>>(new Set());
  departmentFilter = signal<string[] | null>([]);

  modalOpen = signal(false);
  editing = signal<UserRecord | null>(null);

  private loadSub?: Subscription;

  constructor() {
    effect(() => {
      const q = this.query();
      untracked(() => this.load(q));
    });
  }

  load(q = this.query()): void {
    this.loadSub?.unsubscribe();
    this.loading.set(true);
    this.loadSub = this.users
      .list(q)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(res => {
        // Deleting the last row of a page would leave the page empty; step back one page.
        if (!res.items.length && q.page > 1) {
          this.query.set({ ...q, page: q.page - 1 });
          return;
        }
        this.rows.set(res.items);
        this.total.set(res.total);
      });
  }

  onDepartmentChange(values: string[] | null): void {
    this.departmentFilter.set(values);
    this.query.update(q => {
      const filters = { ...(q.filters ?? {}) };
      if (values?.length) filters['department'] = values;
      else delete filters['department'];
      return { ...q, page: 1, filters };
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.modalOpen.set(true);
  }

  openEdit(user: UserRecord): void {
    this.editing.set(user);
    this.modalOpen.set(true);
  }

  onSaved(): void {
    this.load();
  }

  remove(user: UserRecord): void {
    this.users.remove(user.id).subscribe(() => {
      this.dialog.success(`${user.name} was deleted`);
      this.selected.update(s => {
        const next = new Set(s);
        next.delete(user.id);
        return next;
      });
      this.load();
    });
  }

  async removeSelected(): Promise<void> {
    const ids = [...this.selected()];
    let deleted = 0;
    const ok = await this.dialog.confirm({
      heading: `Delete ${ids.length} ${ids.length === 1 ? 'user' : 'users'}?`,
      content: 'They will lose access immediately. This cannot be undone.',
      okText: 'Delete',
      danger: true,
      onOk: async () => (deleted = (await firstValueFrom(this.users.removeMany(ids))).deleted),
    });
    if (!ok) return;
    this.dialog.success(`${deleted} users deleted`);
    this.selected.set(new Set());
    this.load();
  }

  exportCsv(): void {
    const header = ['Name', 'Email', 'Phone', 'Role', 'Department', 'Status', 'Joined'];
    const lines = this.rows().map(u => [u.name, u.email, u.phone, u.role, u.department, u.status, u.createdAt.slice(0, 10)]);
    const csv = [header, ...lines].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    Object.assign(document.createElement('a'), { href: url, download: 'users.csv' }).click();
    URL.revokeObjectURL(url);
    this.dialog.success(`Exported ${lines.length} rows from this page`);
  }
}
