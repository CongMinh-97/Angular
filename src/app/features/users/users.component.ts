import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { Subscription, finalize } from 'rxjs';
import { DEPARTMENTS, ListQuery, USER_ROLES, UserPayload, UserRecord } from '@models/user.model';
import { UserService } from '@services/user.service';
import { CellDefDirective, DataTableComponent, TableColumn } from '@shared/components/data-table/data-table.component';
import { DynamicFormComponent, FieldConfig, buildForm, touchAll } from '@shared/components/dynamic-form/dynamic-form.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

const STATUS_LABEL: Record<string, string> = { active: 'Active', invited: 'Invited', suspended: 'Suspended' };
const STATUS_CLASS: Record<string, string> = { active: 'is-success', invited: 'is-info', suspended: 'is-danger' };
const AVATAR_TONES = ['#0d8a74', '#f2643a', '#7b61ff', '#2d3e63', '#e0950f', '#3a8ef6'];

export const USER_FIELDS: FieldConfig[] = [
  { key: 'name', label: 'Full name', type: 'text', placeholder: 'Nguyễn Văn An', icon: 'user', required: true, minLength: 2, maxLength: 60 },
  { key: 'email', label: 'Work email', type: 'email', placeholder: 'an.nguyen@company.vn', icon: 'mail', required: true, span: 12 },
  {
    key: 'phone',
    label: 'Phone',
    type: 'tel',
    placeholder: '0912345678',
    icon: 'phone',
    span: 12,
    pattern: { regex: /^0\d{9}$/, message: 'Use 10 digits starting with 0, e.g. 0912345678' },
  },
  { key: 'role', label: 'Role', type: 'select', required: true, span: 12, options: USER_ROLES.map(r => ({ label: r, value: r })), hint: 'Admins can manage billing and other admins.' },
  { key: 'department', label: 'Department', type: 'select', required: true, span: 12, options: DEPARTMENTS.map(d => ({ label: d, value: d })) },
  {
    key: 'status',
    label: 'Account status',
    type: 'radio',
    required: true,
    initial: 'invited',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Invited', value: 'invited' },
      { label: 'Suspended', value: 'suspended' },
    ],
  },
];

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
    CurrencyPipe,
    NzButtonModule,
    NzModalModule,
    NzIconModule,
    NzDrawerModule,
    NzPopconfirmModule,
    NzSelectModule,
    NzDropDownModule,
    NzToolTipModule,
    PageHeaderComponent,
    DataTableComponent,
    CellDefDirective,
    DynamicFormComponent,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  private users = inject(UserService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);
  private destroyRef = inject(DestroyRef);

  readonly statusLabel = STATUS_LABEL;
  readonly statusClass = STATUS_CLASS;
  readonly departments = DEPARTMENTS;
  readonly fields = USER_FIELDS;

  readonly columns: TableColumn[] = [
    { key: 'name', title: 'Name', width: '260px', sortable: true, fixed: 'left', locked: true },
    { key: 'role', title: 'Role', width: '130px', sortable: true, filters: USER_ROLES.map(r => ({ text: r, value: r })) },
    { key: 'department', title: 'Department', width: '150px', sortable: true },
    { key: 'status', title: 'Status', width: '130px', filters: Object.entries(STATUS_LABEL).map(([value, text]) => ({ text, value })) },
    { key: 'phone', title: 'Phone', width: '140px', hidden: true },
    { key: 'spend', title: 'Lifetime spend', width: '160px', sortable: true, align: 'right' },
    { key: 'createdAt', title: 'Joined', width: '130px', sortable: true },
    { key: 'lastActive', title: 'Last active', width: '150px', sortable: true, hidden: true },
    { key: 'actions', title: '', width: '96px', align: 'right', fixed: 'right', locked: true },
  ];

  query = signal<ListQuery>({ page: 1, pageSize: 10 });
  rows = signal<UserRecord[]>([]);
  total = signal(0);
  loading = signal(false);
  selected = signal<Set<number>>(new Set());
  departmentFilter: string[] = [];

  drawerOpen = signal(false);
  editing = signal<UserRecord | null>(null);
  saving = signal(false);
  form: FormGroup = buildForm(USER_FIELDS);

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

  onDepartmentChange(values: string[]): void {
    this.query.update(q => {
      const filters = { ...(q.filters ?? {}) };
      if (values.length) filters['department'] = values;
      else delete filters['department'];
      return { ...q, page: 1, filters };
    });
  }

  initials(name: string): string {
    const parts = name.split(' ');
    return (parts[parts.length - 1][0] + parts[0][0]).toUpperCase();
  }

  tone(id: number): string {
    return AVATAR_TONES[id % AVATAR_TONES.length];
  }

  openCreate(): void {
    this.editing.set(null);
    this.form = buildForm(USER_FIELDS);
    this.drawerOpen.set(true);
  }

  openEdit(user: UserRecord): void {
    this.editing.set(user);
    this.form = buildForm(USER_FIELDS);
    this.form.patchValue(user);
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  save(): void {
    if (this.form.invalid) {
      touchAll(this.form);
      return;
    }
    const payload = this.form.getRawValue() as UserPayload;
    const current = this.editing();
    this.saving.set(true);
    const req = current ? this.users.update(current.id, payload) : this.users.create(payload);
    req.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: u => {
        this.message.success(current ? `Saved changes to ${u.name}` : `${u.name} was added and invited`);
        this.drawerOpen.set(false);
        this.load();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) this.form.controls['email'].setErrors({ server: err.error?.message });
      },
    });
  }

  remove(user: UserRecord): void {
    this.users.remove(user.id).subscribe(() => {
      this.message.success(`${user.name} was deleted`);
      this.selected.update(s => {
        const next = new Set(s);
        next.delete(user.id);
        return next;
      });
      this.load();
    });
  }

  removeSelected(): void {
    const ids = [...this.selected()];
    this.modal.confirm({
      nzTitle: `Delete ${ids.length} ${ids.length === 1 ? 'user' : 'users'}?`,
      nzContent: 'They will lose access immediately. This cannot be undone.',
      nzOkText: 'Delete',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () =>
        new Promise<void>(resolve =>
          this.users.removeMany(ids).subscribe({
            next: res => {
              this.message.success(`${res.deleted} users deleted`);
              this.selected.set(new Set());
              this.load();
              resolve();
            },
            error: () => resolve(),
          }),
        ),
    });
  }

  exportCsv(): void {
    const header = ['Name', 'Email', 'Phone', 'Role', 'Department', 'Status', 'Joined'];
    const lines = this.rows().map(u => [u.name, u.email, u.phone, u.role, u.department, u.status, u.createdAt.slice(0, 10)]);
    const csv = [header, ...lines].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'users.csv' });
    a.click();
    URL.revokeObjectURL(url);
    this.message.success(`Exported ${lines.length} rows from this page`);
  }
}
