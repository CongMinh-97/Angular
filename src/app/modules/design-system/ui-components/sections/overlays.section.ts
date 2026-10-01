import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UI_DISPLAY, UI_FORM_CONTROLS, UiDialogService, UiModalSize, UiOption } from '@ui';
import { ApiRow, DOC } from '../doc.components';

@Component({
  selector: 'section-overlays',
  standalone: true,
  imports: [...DOC, ...UI_DISPLAY, ...UI_FORM_CONTROLS, ReactiveFormsModule],
  template: `
    <doc-section anchor="modal" heading="Modal" selector="<ui-modal>" intro="Dialog with a consistent header (icon, title, subtitle) and footer (Cancel + primary). Clicking the backdrop does not close it by default, so half-filled forms are not lost.">
      <doc-example heading="Form in a modal" description="The standard create/edit pattern used on the Users page." [code]="code.form">
        <button ui-button variant="primary" icon="plus" (click)="openCreate()">New project</button>
        <button ui-button variant="secondary" icon="edit" (click)="openEdit()">Edit “Harbor app”</button>
      </doc-example>

      <doc-example heading="Sizes" [code]="code.sizes">
        @for (s of sizes; track s) {
          <button ui-button variant="secondary" (click)="openSize(s)">{{ s }}</button>
        }
      </doc-example>

      <doc-api heading="ui-modal" [rows]="modalApi" />
    </doc-section>

    <doc-section anchor="confirm" heading="Confirm and toasts" selector="UiDialogService" intro="confirm() returns a Promise<boolean>. Pass onOk to keep the dialog open with a spinner until your request finishes.">
      <doc-example heading="Confirm" [code]="code.confirm">
        <button ui-button variant="danger-soft" icon="delete" (click)="confirmDelete()">Delete 3 users</button>
        <button ui-button variant="secondary" (click)="confirmPublish()">Publish article</button>
        @if (lastAnswer()) {
          <span class="out">Answer: <code>{{ lastAnswer() }}</code></span>
        }
      </doc-example>
      <doc-example heading="Toasts" description="Short confirmation of what just happened. They disappear on their own." [code]="code.toast">
        <button ui-button variant="secondary" (click)="dialog.success('Changes saved')">Success</button>
        <button ui-button variant="secondary" (click)="dialog.info('Sync starts in 5 minutes')">Info</button>
        <button ui-button variant="secondary" (click)="dialog.warning('Your trial ends in 3 days')">Warning</button>
        <button ui-button variant="secondary" (click)="dialog.error('Could not reach the server. Try again.')">Error</button>
      </doc-example>
    </doc-section>

    <ui-modal
      [(open)]="formOpen"
      [heading]="editing() ? 'Edit project' : 'New project'"
      [subtitle]="editing() ? 'Changes are visible to everyone on the project' : 'You can change these later'"
      [icon]="editing() ? 'edit' : 'plus'"
      size="lg"
      [okText]="editing() ? 'Save changes' : 'Create project'"
      [okLoading]="saving()"
      (ok)="saveProject()"
    >
      <form [formGroup]="form" class="modal-form" (ngSubmit)="saveProject()">
        <ui-input formControlName="name" label="Project name" placeholder="Harbor app" />
        <ui-input formControlName="key" label="Key" placeholder="HAR" hint="2–5 capital letters, used in ticket IDs" [errorMessages]="{ pattern: 'Use 2–5 capital letters, e.g. HAR' }" />
        <ui-select formControlName="lead" label="Project lead" [options]="people" searchable />
        <ui-date-range-picker formControlName="period" label="Timeline" />
        <ui-multi-select formControlName="teams" label="Teams" [options]="teams" class="span-2" />
        <ui-textarea formControlName="summary" label="Summary" [maxChars]="200" showCount class="span-2" />
        <button type="submit" hidden></button>
      </form>
    </ui-modal>

    <ui-modal [(open)]="sizeOpen" [size]="size()" [heading]="'Size: ' + size()" okText="Got it" (ok)="sizeOpen.set(false)">
      <p class="muted">sm 420 px · md 560 px (default) · lg 760 px · xl 980 px. On phones every size fills the screen width minus 16 px.</p>
    </ui-modal>
  `,
  styles: [
    `
      .modal-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 16px; }
      .span-2 { grid-column: 1 / -1; }
      .muted { margin: 0; color: var(--text-2); }
      .out { font-size: 12.5px; color: var(--text-3); }
      code { font-family: 'JetBrains Mono', monospace; color: var(--text); }
      @media (max-width: 639px) { .modal-form { grid-template-columns: minmax(0, 1fr); } }
    `,
  ],
})
export class OverlaysSectionComponent {
  readonly dialog = inject(UiDialogService);
  private fb = inject(FormBuilder);

  readonly sizes: UiModalSize[] = ['sm', 'md', 'lg', 'xl'];
  readonly people: UiOption<string>[] = ['Nguyễn Minh Anh', 'Trần Thảo Vy', 'Lê Quốc Bảo', 'Hoàng Ngọc Lan'].map(p => ({ label: p, value: p }));
  readonly teams: UiOption<string>[] = ['Engineering', 'Design', 'Marketing', 'Support'].map(t => ({ label: t, value: t }));

  formOpen = signal(false);
  editing = signal(false);
  saving = signal(false);
  sizeOpen = signal(false);
  size = signal<UiModalSize>('md');
  lastAnswer = signal('');

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    key: ['', [Validators.required, Validators.pattern(/^[A-Z]{2,5}$/)]],
    lead: [null as string | null, Validators.required],
    period: [null as [Date, Date] | null],
    teams: [[] as string[]],
    summary: ['', Validators.maxLength(200)],
  });

  openCreate(): void {
    this.editing.set(false);
    this.form.reset({ teams: [] });
    this.formOpen.set(true);
  }

  openEdit(): void {
    this.editing.set(true);
    this.form.reset({ name: 'Harbor app', key: 'HAR', lead: 'Trần Thảo Vy', teams: ['Engineering', 'Design'], summary: 'Customer-facing admin console.' });
    this.formOpen.set(true);
  }

  saveProject(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.formOpen.set(false);
      this.dialog.success(this.editing() ? 'Project saved' : `${this.form.value.name} was created`);
    }, 700);
  }

  openSize(s: UiModalSize): void {
    this.size.set(s);
    this.sizeOpen.set(true);
  }

  async confirmDelete(): Promise<void> {
    const ok = await this.dialog.confirm({
      heading: 'Delete 3 users?',
      content: 'They lose access immediately. This cannot be undone.',
      okText: 'Delete',
      danger: true,
      onOk: () => new Promise(r => setTimeout(r, 900)),
    });
    this.lastAnswer.set(String(ok));
    if (ok) this.dialog.success('3 users deleted');
  }

  async confirmPublish(): Promise<void> {
    const ok = await this.dialog.confirm({ heading: 'Publish “Q3 product update”?', content: 'It will be visible to all members.', okText: 'Publish' });
    this.lastAnswer.set(String(ok));
  }

  readonly modalApi: ApiRow[] = [
    { name: '[(open)]', type: 'boolean', default: 'false', description: 'Two-way visibility.' },
    { name: 'heading / subtitle / icon', type: 'string', description: 'Header content.' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: '420 / 560 / 760 / 980 px.' },
    { name: 'okText / cancelText / okIcon', type: 'string', default: "'Save' / 'Cancel'", description: 'Footer labels.' },
    { name: 'okLoading / okDisabled / okDanger', type: 'boolean', default: 'false', description: 'Primary button state. While loading, Cancel and Esc are blocked.' },
    { name: 'hideFooter', type: 'boolean', default: 'false', description: 'No footer at all.' },
    { name: 'maskClosable / closable / centered', type: 'boolean', default: 'false / true / true', description: 'Closing behaviour and position.' },
    { name: 'ng-template[uiModalFooter]', type: 'slot', description: 'Replace the default footer.' },
    { name: '(ok) / (cancel) / (opened) / (closed)', type: 'void', description: 'Events.' },
  ];

  readonly code = {
    form: `<button ui-button variant="primary" icon="plus" (click)="openCreate()">New project</button>

<ui-modal
  [(open)]="formOpen"
  [heading]="editing() ? 'Edit project' : 'New project'"
  [okText]="editing() ? 'Save changes' : 'Create project'"
  [okLoading]="saving()"
  size="lg"
  (ok)="save()">
  <form [formGroup]="form" (ngSubmit)="save()">
    <ui-input formControlName="name" label="Project name" />
    <ui-select formControlName="lead" label="Project lead" [options]="people" />
    …
  </form>
</ui-modal>

save() {
  if (this.form.invalid) { this.form.markAllAsTouched(); return; }
  …
}`,
    sizes: `<ui-modal [(open)]="open" size="sm | md | lg | xl" heading="…">…</ui-modal>`,
    confirm: `const ok = await this.dialog.confirm({
  heading: 'Delete 3 users?',
  content: 'They lose access immediately.',
  okText: 'Delete',
  danger: true,
  onOk: () => firstValueFrom(this.api.deleteMany(ids)),  // spinner until done
});`,
    toast: `this.dialog.success('Changes saved');
this.dialog.error('Could not reach the server. Try again.');`,
  };
}
