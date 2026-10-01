import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { finalize } from 'rxjs';
import { DEPARTMENTS, USER_ROLES, USER_STATUSES, UserPayload, UserRole, UserStatus } from '@models/user.model';
import { UserService } from '@services/user.service';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { SAMPLE_CSV, parseCsv } from './csv';

interface TargetField {
  key: keyof UserPayload;
  label: string;
  required: boolean;
  aliases: string[];
}

interface ReviewRow {
  line: number;
  values: Record<string, string>;
  errors: string[];
}

const TARGETS: TargetField[] = [
  { key: 'name', label: 'Full name', required: true, aliases: ['name', 'full name', 'fullname', 'họ tên', 'ho ten'] },
  { key: 'email', label: 'Email', required: true, aliases: ['email', 'email address', 'e-mail', 'mail'] },
  { key: 'phone', label: 'Phone', required: false, aliases: ['phone', 'mobile', 'phone number', 'sđt', 'số điện thoại'] },
  { key: 'role', label: 'Role', required: true, aliases: ['role', 'vai trò', 'permission'] },
  { key: 'department', label: 'Department', required: true, aliases: ['department', 'team', 'phòng ban', 'dept'] },
  { key: 'status', label: 'Status', required: false, aliases: ['status', 'trạng thái', 'state'] },
];

const MAX_BYTES = 2 * 1024 * 1024;

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NzStepsModule,
    NzUploadModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    NzTableModule,
    NzSwitchModule,
    NzAlertModule,
    NzToolTipModule,
    PageHeaderComponent,
  ],
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent {
  private message = inject(NzMessageService);
  private users = inject(UserService);

  readonly targets = TARGETS;
  step = signal(0);

  fileName = signal('');
  fileSize = signal(0);
  headers = signal<string[]>([]);
  dataRows = signal<string[][]>([]);
  mapping = signal<Record<string, number | null>>({});

  onlyErrors = signal(false);
  importing = signal(false);
  result = signal<{ inserted: number; skipped: number; invalid: number } | null>(null);

  unmappedRequired = computed(() => TARGETS.filter(t => t.required && this.mapping()[t.key] == null));

  review = computed<ReviewRow[]>(() => {
    const map = this.mapping();
    return this.dataRows().map((cells, i) => {
      const values: Record<string, string> = {};
      for (const t of TARGETS) {
        const idx = map[t.key];
        values[t.key] = idx == null ? '' : (cells[idx] ?? '').trim();
      }
      return { line: i + 2, values, errors: validate(values) };
    });
  });

  validCount = computed(() => this.review().filter(r => !r.errors.length).length);
  errorCount = computed(() => this.review().length - this.validCount());
  visibleRows = computed(() => (this.onlyErrors() ? this.review().filter(r => r.errors.length) : this.review()));

  beforeUpload = (file: NzUploadFile): boolean => {
    const raw = file as unknown as File;
    if (!/\.csv$/i.test(raw.name)) {
      this.message.error('Choose a .csv file. Export from Excel with “Save as → CSV UTF-8”.');
      return false;
    }
    if (raw.size > MAX_BYTES) {
      this.message.error('The file is larger than 2 MB. Split it into smaller files.');
      return false;
    }
    raw.text().then(text => this.load(raw.name, raw.size, text));
    return false;
  };

  useSample(): void {
    this.load('sample-users.csv', new Blob([SAMPLE_CSV]).size, SAMPLE_CSV);
  }

  downloadTemplate(): void {
    const csv = TARGETS.map(t => t.label).join(',') + '\nNguyễn Văn An,an.nguyen@company.vn,0912345678,Editor,Marketing,invited\n';
    const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }));
    Object.assign(document.createElement('a'), { href: url, download: 'users-template.csv' }).click();
    URL.revokeObjectURL(url);
  }

  private load(name: string, size: number, text: string): void {
    const rows = parseCsv(text);
    if (rows.length < 2) {
      this.message.error('The file needs a header row and at least one data row.');
      return;
    }
    const [head, ...body] = rows;
    this.fileName.set(name);
    this.fileSize.set(size);
    this.headers.set(head.map(h => h.trim()));
    this.dataRows.set(body);
    this.mapping.set(autoMap(this.headers()));
    this.result.set(null);
    this.step.set(1);
  }

  setMapping(key: string, idx: number | null): void {
    this.mapping.update(m => ({ ...m, [key]: idx }));
  }

  sampleFor(idx: number | null): string {
    if (idx == null) return '—';
    return this.dataRows().slice(0, 3).map(r => r[idx] || '∅').join(' · ');
  }

  runImport(): void {
    const rows: UserPayload[] = this.review()
      .filter(r => !r.errors.length)
      .map(r => ({
        name: r.values['name'],
        email: r.values['email'].toLowerCase(),
        phone: r.values['phone'],
        role: matchRole(r.values['role'])!,
        department: r.values['department'],
        status: (r.values['status'].toLowerCase() as UserStatus) || 'invited',
      }));
    this.importing.set(true);
    this.users
      .importMany(rows)
      .pipe(finalize(() => this.importing.set(false)))
      .subscribe(res => {
        this.result.set({ ...res, invalid: this.errorCount() });
        this.step.set(3);
      });
  }

  reset(): void {
    this.step.set(0);
    this.headers.set([]);
    this.dataRows.set([]);
    this.mapping.set({});
    this.onlyErrors.set(false);
    this.result.set(null);
  }

  formatSize(bytes: number): string {
    return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
  }
}

function norm(s: string): string {
  return s.toLowerCase().trim().replace(/[_-]+/g, ' ');
}

function autoMap(headers: string[]): Record<string, number | null> {
  const out: Record<string, number | null> = {};
  for (const t of TARGETS) {
    const i = headers.findIndex(h => t.aliases.includes(norm(h)));
    out[t.key] = i >= 0 ? i : null;
  }
  return out;
}

function matchRole(v: string): UserRole | undefined {
  return USER_ROLES.find(r => r.toLowerCase() === v.toLowerCase());
}

function validate(v: Record<string, string>): string[] {
  const e: string[] = [];
  if (!v['name']) e.push('Name is empty');
  if (!v['email']) e.push('Email is empty');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v['email'])) e.push(`“${v['email']}” is not a valid email`);
  if (v['phone'] && !/^0\d{9}$/.test(v['phone'])) e.push('Phone must be 10 digits starting with 0');
  if (!matchRole(v['role'])) e.push(`Role “${v['role'] || '∅'}” must be one of ${USER_ROLES.join(', ')}`);
  if (!DEPARTMENTS.includes(v['department'])) e.push(`Unknown department “${v['department'] || '∅'}”`);
  if (v['status'] && !USER_STATUSES.includes(v['status'].toLowerCase() as UserStatus)) e.push(`Status “${v['status']}” is not recognised`);
  return e;
}
