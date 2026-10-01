import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { EditorStats, RichTextEditorComponent } from '@shared/components/rich-text-editor/rich-text-editor.component';
import {
  UiButtonComponent,
  UiCardComponent,
  UiDatePickerComponent,
  UiDialogService,
  UiFieldComponent,
  UiMultiSelectComponent,
  UiOption,
  UiRadioGroupComponent,
  UiSelectComponent,
  UiTagComponent,
  UiUploadComponent,
  UiUploadFile,
} from '@ui';

const SAMPLE_BODY = `
<h2>Harbor Q3 product update</h2>
<p>This quarter we focused on <strong>speed</strong> and <strong>clarity</strong>. Dashboards now load 40% faster, and every table supports saved filters.</p>
<blockquote><p>“The import wizard saved our HR team two days of copy-and-paste.” — Lan Hoàng, Operations</p></blockquote>
<h3>What shipped</h3>
<ul>
  <li>Bulk import from CSV with column matching and row-level validation</li>
  <li>Column visibility and density controls on every table</li>
  <li>A rebuilt editor with image upload, tables and code blocks</li>
</ul>
<h3>Release dates</h3>
<figure class="table"><table><thead><tr><th>Feature</th><th>Status</th><th>Date</th></tr></thead><tbody>
<tr><td>CSV import</td><td>Live</td><td>02/09/2026</td></tr>
<tr><td>Saved filters</td><td>Live</td><td>16/09/2026</td></tr>
<tr><td>Audit log export</td><td>Beta</td><td>14/10/2026</td></tr>
</tbody></table></figure>
<p>Try the toolbar: upload an image, insert a table, or use the calendar button to stamp today's date.</p>
`;

const MESSAGES: Record<string, Record<string, string>> = {
  title: { required: 'Give the article a title', maxlength: 'Keep the title under 120 characters' },
  excerpt: { maxlength: 'Keep the summary under 200 characters' },
  body: { required: 'Write something before publishing' },
};

@Component({
  selector: 'app-editor-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    RichTextEditorComponent,
    UiButtonComponent,
    UiCardComponent,
    UiFieldComponent,
    UiRadioGroupComponent,
    UiDatePickerComponent,
    UiSelectComponent,
    UiMultiSelectComponent,
    UiUploadComponent,
    UiTagComponent,
  ],
  templateUrl: './editor-page.component.html',
  styleUrls: ['./editor-page.component.scss'],
})
export class EditorPageComponent {
  private fb = inject(NonNullableFormBuilder);
  private dialog = inject(UiDialogService);

  readonly categories: UiOption<string>[] = ['Product updates', 'Engineering', 'Company news', 'Customer stories', 'Guides'].map(c => ({ label: c, value: c }));
  readonly tagOptions: UiOption<string>[] = ['release', 'dashboard', 'import', 'editor', 'performance', 'security'].map(t => ({ label: t, value: t }));
  readonly visibilityOptions: UiOption<string>[] = [
    { label: 'Public', value: 'public', description: 'Anyone with the link' },
    { label: 'Members only', value: 'members', description: 'Signed-in users' },
    { label: 'Private', value: 'private', description: 'Only editors' },
  ];

  stats = signal<EditorStats>({ words: 0, characters: 0 });
  readMinutes = computed(() => Math.max(1, Math.round(this.stats().words / 200)));
  saving = signal<'draft' | 'publish' | null>(null);
  savedAt = signal<Date | null>(null);
  private attempted = signal(false);

  form = this.fb.group({
    title: ['Harbor Q3 product update', [Validators.required, Validators.maxLength(120)]],
    excerpt: ['Faster dashboards, saved filters and a brand-new import wizard.', [Validators.maxLength(200)]],
    body: [SAMPLE_BODY, [Validators.required]],
    category: ['Product updates' as string | null, [Validators.required]],
    tags: [['release', 'dashboard'] as string[]],
    visibility: ['public'],
    publishAt: [null as Date | null],
    cover: [[] as UiUploadFile[]],
  });

  /** For the custom-styled title/summary/body fields wrapped in <ui-field>. */
  fieldError(key: keyof typeof MESSAGES): string | null {
    const c = this.form.get(key);
    if (!c?.errors || !(c.touched || this.attempted())) return null;
    const first = Object.keys(c.errors)[0];
    return MESSAGES[key][first] ?? 'This value is not valid';
  }

  save(mode: 'draft' | 'publish'): void {
    if (mode === 'publish' && this.form.invalid) {
      this.attempted.set(true);
      this.form.markAllAsTouched();
      this.dialog.warning('Add a title and some content before publishing.');
      return;
    }
    this.saving.set(mode);
    setTimeout(() => {
      this.saving.set(null);
      this.savedAt.set(new Date());
      const when = this.form.controls.publishAt.value;
      this.dialog.success(mode === 'draft' ? 'Draft saved' : when ? `Scheduled for ${when.toLocaleString('vi-VN')}` : 'Article published');
    }, 600);
  }
}
