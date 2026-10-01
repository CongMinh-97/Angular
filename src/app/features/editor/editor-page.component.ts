import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { touchAll } from '@shared/components/dynamic-form/dynamic-form.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { EditorStats, RichTextEditorComponent } from '@shared/components/rich-text-editor/rich-text-editor.component';

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

@Component({
  selector: 'app-editor-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzRadioModule,
    NzDatePickerModule,
    NzButtonModule,
    NzIconModule,
    NzUploadModule,
    PageHeaderComponent,
    RichTextEditorComponent,
  ],
  templateUrl: './editor-page.component.html',
  styleUrls: ['./editor-page.component.scss'],
})
export class EditorPageComponent {
  private fb = inject(NonNullableFormBuilder);
  private message = inject(NzMessageService);

  readonly categories = ['Product updates', 'Engineering', 'Company news', 'Customer stories', 'Guides'];
  readonly tagOptions = ['release', 'dashboard', 'import', 'editor', 'performance', 'security'];

  stats = signal<EditorStats>({ words: 0, characters: 0 });
  readMinutes = computed(() => Math.max(1, Math.round(this.stats().words / 200)));
  cover = signal<string | null>(null);
  saving = signal<'draft' | 'publish' | null>(null);
  savedAt = signal<Date | null>(null);

  form = this.fb.group({
    title: ['Harbor Q3 product update', [Validators.required, Validators.maxLength(120)]],
    excerpt: ['Faster dashboards, saved filters and a brand-new import wizard.', [Validators.maxLength(200)]],
    body: [SAMPLE_BODY, [Validators.required]],
    category: ['Product updates', [Validators.required]],
    tags: [['release', 'dashboard'] as string[]],
    visibility: ['public'],
    publishAt: [null as Date | null],
  });

  beforeCover = (file: NzUploadFile): boolean => {
    const raw = file as unknown as File;
    if (!raw.type.startsWith('image/')) {
      this.message.error('Choose a PNG, JPG or WebP image.');
      return false;
    }
    if (raw.size > 5 * 1024 * 1024) {
      this.message.error('Cover images must be 5 MB or smaller.');
      return false;
    }
    const reader = new FileReader();
    reader.onload = () => this.cover.set(reader.result as string);
    reader.readAsDataURL(raw);
    return false;
  };

  save(mode: 'draft' | 'publish'): void {
    if (mode === 'publish' && this.form.invalid) {
      touchAll(this.form);
      this.message.warning('Add a title and some content before publishing.');
      return;
    }
    this.saving.set(mode);
    setTimeout(() => {
      this.saving.set(null);
      this.savedAt.set(new Date());
      const when = this.form.controls.publishAt.value;
      this.message.success(
        mode === 'draft' ? 'Draft saved' : when ? `Scheduled for ${when.toLocaleString('vi-VN')}` : 'Article published',
      );
    }, 600);
  }

  disablePast = (d: Date): boolean => d.getTime() < Date.now() - 86400000;
}
