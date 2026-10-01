import { JsonPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs';
import {
  UI_FORM_CONTROLS,
  UiAlertComponent,
  UiButtonComponent,
  UiDialogService,
  UiOption,
  maxSelected,
  minSelected,
  validDateRange,
} from '@ui';
import { DOC } from '../doc.components';

@Component({
  selector: 'section-form-usage',
  standalone: true,
  imports: [...DOC, ...UI_FORM_CONTROLS, ReactiveFormsModule, FormsModule, JsonPipe, UiButtonComponent, UiAlertComponent],
  template: `
    <doc-section
      anchor="forms"
      heading="In a form and on their own"
      intro="Every control works with Reactive Forms, with ngModel, and with plain [(value)]. Inside a form the control reads its validators: the required mark appears by itself and the first error shows once the field is touched or the form is submitted."
    >
      <!-- Reactive -->
      <doc-example heading="1. Reactive form" description="Press Create with the form empty to see every error at once. Try “taken@harbor.vn” as the organiser email to see a server-side error." [code]="code.reactive" stack>
        <div class="rf">
          <form [formGroup]="form" (ngSubmit)="submit()" class="rf-form" novalidate>
            <div class="grid-2">
              <ui-input formControlName="name" label="Event name" placeholder="Harbor Q4 kickoff" [maxChars]="60" showCount />
              <ui-input formControlName="organiser" label="Organiser email" type="email" prefixIcon="mail" placeholder="you@harbor.vn" (blurred)="checkEmail()" />
              <ui-select formControlName="category" label="Category" [options]="categories" placeholder="Choose a category" />
              <ui-multi-select formControlName="teams" label="Teams invited" [options]="teams" showSelectAll [errorMessages]="{ minSelected: 'Invite at least one team' }" hint="Up to 4 teams" />
              <ui-date-range-picker formControlName="period" label="Dates" disablePast [maxDays]="14" />
              <ui-time-picker formControlName="startsAt" label="Starts at" [minuteStep]="15" />
              <ui-number formControlName="capacity" label="Capacity" unit="people" [min]="1" [max]="500" />
              <ui-number formControlName="budget" label="Budget" format="currency" [step]="500000" tooltip="Leave empty if there is no budget" />
            </div>
            <ui-radio-group formControlName="format" label="Format" variant="card" [options]="formats" />
            <ui-textarea formControlName="agenda" label="Agenda" [maxChars]="400" showCount placeholder="What will happen, in order" />
            <ui-checkbox-group formControlName="reminders" label="Send reminders" [options]="reminders" />
            <ui-upload formControlName="files" label="Attachments" variant="button" accept=".pdf,.pptx,image/*" [maxFiles]="3" />
            <ui-switch formControlName="publicPage" text="Create a public sign-up page" description="Anyone with the link can register" />
            <ui-checkbox formControlName="terms" text="I confirm the venue is booked" />

            <div class="rf-actions">
              <button ui-button variant="ghost" (click)="fillExample()">Fill example</button>
              <button ui-button variant="ghost" (click)="toggleDisabled()">{{ form.disabled ? 'Enable form' : 'Disable form' }}</button>
              <span class="spacer"></span>
              <button ui-button variant="secondary" (click)="reset()">Reset</button>
              <button ui-button variant="primary" type="submit" icon="check" [loading]="saving()">Create event</button>
            </div>
          </form>

          <aside class="rf-state">
            <div class="st-row">
              <span>Status</span>
              <strong [class.ok]="status() === 'VALID'" [class.bad]="status() === 'INVALID'">{{ status() }}</strong>
            </div>
            <div class="st-row"><span>Touched</span><strong>{{ form.touched }}</strong></div>
            <div class="st-row"><span>Dirty</span><strong>{{ form.dirty }}</strong></div>
            <div class="st-label">form.getRawValue()</div>
            <pre>{{ preview() | json }}</pre>
          </aside>
        </div>
      </doc-example>

      <!-- Template-driven -->
      <doc-example heading="2. Template-driven form (ngModel)" description="Angular's own validator directives (required, email, minlength) work as-is." [code]="code.template" stack>
        <form #tf="ngForm" (ngSubmit)="tfSubmitted.set(tf.valid ?? false)" class="tf" novalidate>
          <div class="grid-3">
            <ui-input name="fullName" [(ngModel)]="person.name" label="Full name" required minlength="2" />
            <ui-input name="email" [(ngModel)]="person.email" label="Email" type="email" email required />
            <ui-select name="role" [(ngModel)]="person.role" label="Role" [options]="roles" required />
          </div>
          <div class="rf-actions">
            <span class="out">model: <code>{{ person | json }}</code></span>
            <span class="spacer"></span>
            <button ui-button variant="primary" type="submit">Save</button>
          </div>
          @if (tfSubmitted()) {
            <ui-alert tone="success">Saved {{ person.name }}.</ui-alert>
          }
        </form>
      </doc-example>

      <!-- Standalone -->
      <doc-example heading="3. Standalone, without a form" description="Bind [(value)] to a signal or field. Pass error yourself when you validate, here an availability check that runs 500 ms after typing stops." [code]="code.standalone" stack>
        <div class="grid-3">
          <ui-input
            label="Workspace URL"
            addonAfter=".harbor.vn"
            [(value)]="slug"
            [debounce]="500"
            (debounced)="checkSlug($event)"
            [error]="slugError()"
            [hint]="slugHint()"
          />
          <ui-select label="Timezone" [options]="zones" [(value)]="zone" searchable />
          <ui-date-picker label="Go-live date" [(value)]="goLive" disablePast />
        </div>
        <div class="out">slug = <code>{{ slug() }}</code> · zone = <code>{{ zone() }}</code> · goLive = <code>{{ goLive()?.toLocaleDateString('vi-VN') }}</code></div>
      </doc-example>
    </doc-section>
  `,
  styles: [
    `
      .rf { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 20px; align-items: start; width: 100%; }
      .rf-form, .tf { display: flex; flex-direction: column; gap: 18px; min-width: 0; }
      .grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 16px; }
      .grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px 16px; }
      .rf-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding-top: 16px; border-top: 1px solid var(--border); }
      .spacer { flex: 1; }
      .rf-state { position: sticky; top: calc(var(--topbar-h) + 16px); padding: 14px; border-radius: var(--radius); background: var(--ink-950); color: #c4cbe0; font-size: 12.5px; }
      .st-row { display: flex; justify-content: space-between; padding: 4px 0; }
      .st-row strong { color: #fff; font-family: 'JetBrains Mono', monospace; font-weight: 500; }
      .st-row strong.ok { color: var(--jade-300); }
      .st-row strong.bad { color: #ff8a8d; }
      .st-label { margin: 10px 0 6px; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: #7f89a6; }
      pre { margin: 0; max-height: 420px; overflow: auto; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.55; color: #d5dbeb; white-space: pre-wrap; word-break: break-word; }
      .out { font-size: 12.5px; color: var(--text-3); }
      code { font-family: 'JetBrains Mono', monospace; color: var(--text); }
      @media (max-width: 1279px) { .rf { grid-template-columns: minmax(0, 1fr); } .rf-state { position: static; } }
      @media (max-width: 767px) { .grid-2, .grid-3 { grid-template-columns: minmax(0, 1fr); } }
    `,
  ],
})
export class FormUsageSectionComponent {
  private fb = inject(FormBuilder);
  private dialog = inject(UiDialogService);

  readonly categories: UiOption<string>[] = [
    { label: 'All-hands', value: 'allhands', icon: 'team' },
    { label: 'Workshop', value: 'workshop', icon: 'experiment' },
    { label: 'Customer event', value: 'customer', icon: 'shop' },
    { label: 'Offsite', value: 'offsite', icon: 'environment' },
  ];
  readonly teams: UiOption<string>[] = ['Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'Support'].map(t => ({ label: t, value: t }));
  readonly formats: UiOption<string>[] = [
    { label: 'In person', value: 'onsite', icon: 'home', description: 'Everyone in the same room' },
    { label: 'Online', value: 'online', icon: 'global', description: 'Video call link sent with the invite' },
    { label: 'Hybrid', value: 'hybrid', icon: 'swap', description: 'Room plus a live stream' },
  ];
  readonly reminders: UiOption<string>[] = [
    { label: '1 week before', value: '7d' },
    { label: '1 day before', value: '1d' },
    { label: '1 hour before', value: '1h' },
  ];
  readonly roles: UiOption<string>[] = ['Admin', 'Manager', 'Editor', 'Viewer'].map(r => ({ label: r, value: r }));
  readonly zones: UiOption<string>[] = [
    { label: '(GMT+7) Hà Nội, Bangkok', value: 'Asia/Ho_Chi_Minh' },
    { label: '(GMT+8) Singapore', value: 'Asia/Singapore' },
    { label: '(GMT+9) Tokyo, Seoul', value: 'Asia/Tokyo' },
    { label: '(GMT+0) London', value: 'Europe/London' },
  ];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]],
    organiser: ['', [Validators.required, Validators.email]],
    category: [null as string | null, Validators.required],
    teams: [[] as string[], [minSelected(1), maxSelected(4)]],
    period: [null as [Date, Date] | null, [Validators.required, validDateRange]],
    startsAt: [null as Date | null, Validators.required],
    capacity: [null as number | null, [Validators.required, Validators.min(1), Validators.max(500)]],
    budget: [null as number | null, Validators.min(0)],
    format: ['onsite', Validators.required],
    agenda: ['', Validators.maxLength(400)],
    reminders: [['1d'] as string[]],
    files: [[] as unknown[]],
    publicPage: [false],
    terms: [false, Validators.requiredTrue],
  });

  saving = signal(false);
  status = toSignal(this.form.statusChanges.pipe(startWith(this.form.status)), { initialValue: this.form.status });
  private raw = toSignal(this.form.valueChanges.pipe(startWith(null), map(() => this.form.getRawValue())), { initialValue: this.form.getRawValue() });
  preview = computed(() => {
    const v = this.raw();
    return { ...v, files: (v.files as { name: string }[]).map(f => f.name) };
  });

  person = { name: '', email: '', role: null as string | null };
  tfSubmitted = signal(false);

  slug = signal<string | null>('harbor');
  slugError = signal<string | null>(null);
  slugHint = signal('3–30 lowercase letters, numbers or dashes');
  zone = signal<string | null>('Asia/Ho_Chi_Minh');
  goLive = signal<Date | null>(null);

  checkEmail(): void {
    const c = this.form.controls.organiser;
    if (c.value?.toLowerCase() === 'taken@harbor.vn') c.setErrors({ server: 'This person is already organising an event that week' });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.dialog.warning('Fix the highlighted fields to create the event.');
      return;
    }
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.dialog.success(`“${this.form.value.name}” was created`);
    }, 700);
  }

  reset(): void {
    this.form.reset({ format: 'onsite', reminders: ['1d'], teams: [], files: [], publicPage: false, terms: false });
  }

  toggleDisabled(): void {
    if (this.form.disabled) this.form.enable();
    else this.form.disable();
  }

  fillExample(): void {
    const start = new Date();
    start.setDate(start.getDate() + 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    this.form.patchValue({
      name: 'Harbor Q4 kickoff',
      organiser: 'lan.hoang@harbor.vn',
      category: 'allhands',
      teams: ['Engineering', 'Design'],
      period: [start, end],
      startsAt: new Date(2026, 0, 1, 9, 0),
      capacity: 120,
      budget: 45000000,
      format: 'hybrid',
      agenda: '09:00 Welcome\n09:30 Q3 results\n10:30 Roadmap\n12:00 Lunch',
      terms: true,
    });
  }

  checkSlug(v: string): void {
    const ok = /^[a-z0-9-]{3,30}$/.test(v);
    if (!ok) {
      this.slugError.set('Use 3–30 lowercase letters, numbers or dashes');
    } else if (['admin', 'harbor-team', 'test'].includes(v)) {
      this.slugError.set(`${v}.harbor.vn is already taken`);
    } else {
      this.slugError.set(null);
      this.slugHint.set(`${v}.harbor.vn is available`);
    }
  }

  readonly code = {
    reactive: `form = this.fb.group({
  name:      ['', [Validators.required, Validators.minLength(4)]],
  organiser: ['', [Validators.required, Validators.email]],
  category:  [null, Validators.required],
  teams:     [[], [minSelected(1), maxSelected(4)]],
  period:    [null, [Validators.required, validDateRange]],
  capacity:  [null, [Validators.required, Validators.min(1)]],
  terms:     [false, Validators.requiredTrue],
});

<form [formGroup]="form" (ngSubmit)="submit()">
  <ui-input formControlName="name" label="Event name" />
  <ui-select formControlName="category" label="Category" [options]="categories" />
  <ui-multi-select formControlName="teams" label="Teams invited" [options]="teams"
                   [errorMessages]="{ minSelected: 'Invite at least one team' }" />
  <ui-date-range-picker formControlName="period" label="Dates" disablePast />
  <ui-number formControlName="capacity" label="Capacity" unit="people" />
  <ui-checkbox formControlName="terms" text="I confirm the venue is booked" />
  <button ui-button variant="primary" type="submit">Create event</button>
</form>

// Error from the API on a specific field:
this.form.controls.organiser.setErrors({ server: 'Already organising an event that week' });`,
    template: `<form #f="ngForm" (ngSubmit)="save(f)">
  <ui-input name="fullName" [(ngModel)]="person.name" label="Full name" required minlength="2" />
  <ui-input name="email" [(ngModel)]="person.email" label="Email" type="email" email required />
  <ui-select name="role" [(ngModel)]="person.role" label="Role" [options]="roles" required />
  <button ui-button variant="primary" type="submit">Save</button>
</form>`,
    standalone: `slug = signal('harbor');
slugError = signal<string | null>(null);

<ui-input
  label="Workspace URL" addonAfter=".harbor.vn"
  [(value)]="slug"
  [debounce]="500" (debounced)="checkSlug($event)"
  [error]="slugError()" />

<ui-select label="Timezone" [options]="zones" [(value)]="zone" searchable />
<ui-date-picker label="Go-live date" [(value)]="goLive" disablePast />`,
  };
}
