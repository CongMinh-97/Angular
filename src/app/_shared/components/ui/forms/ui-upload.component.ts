import { Component, booleanAttribute, computed, input, numberAttribute, signal } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UiControlBase } from '../core/ui-control.base';
import { UiFieldComponent } from '../core/ui-field.component';

export interface UiUploadFile {
  uid: string;
  name: string;
  size: number;
  type: string;
  /** The browser File; absent for files that came from the server. */
  file?: File;
  /** Preview (data URL) for images, or the server URL for existing files. */
  url?: string;
}

export type UiUploadVariant = 'dropzone' | 'button' | 'image';

let fileUid = 0;

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * File picker that keeps the selected files as the control value (UiUploadFile[]).
 * Files are not sent anywhere; read `value[i].file` and upload on save.
 *
 * <ui-upload formControlName="attachments" label="Attachments" accept=".pdf,.docx" [maxFiles]="5" [maxSizeMb]="10" />
 * <ui-upload formControlName="photo" label="Photo" variant="image" accept="image/*" [maxFiles]="1" />
 */
@Component({
  selector: 'ui-upload',
  standalone: true,
  imports: [NzIconModule, UiFieldComponent],
  template: `
    <ui-field
      [label]="label()"
      [forId]="inputId()"
      [msgId]="msgId()"
      [hint]="hintText()"
      [tooltip]="tooltip()"
      [error]="rejectError() || errorText()"
      [required]="isRequired()"
      [layout]="layout()"
      [labelWidth]="labelWidth()"
    >
      <input
        #picker
        type="file"
        class="ui-up-native"
        [id]="inputId()"
        [accept]="accept()"
        [multiple]="maxFiles() !== 1"
        [disabled]="isDisabled() || full()"
        [attr.aria-describedby]="msgId()"
        (change)="onPick($event)"
      />

      @switch (variant()) {
        @case ('dropzone') {
          <div
            class="ui-up-drop"
            [class.is-over]="dragOver()"
            [class.is-disabled]="isDisabled() || full()"
            [class.is-invalid]="!!(rejectError() || errorText())"
            (click)="picker.click()"
            (keydown.enter)="picker.click()"
            (keydown.space)="$event.preventDefault(); picker.click()"
            (dragover)="onDragOver($event)"
            (dragleave)="dragOver.set(false)"
            (drop)="onDrop($event)"
            tabindex="0"
            role="button"
            [attr.aria-label]="'Choose files' + (label() ? ' for ' + label() : '')"
          >
            <span class="ui-up-icon"><span nz-icon nzType="cloud-upload"></span></span>
            <strong>{{ full() ? 'File limit reached' : 'Drop files here or click to browse' }}</strong>
            <span>{{ rulesText() }}</span>
          </div>
        }
        @case ('button') {
          <button type="button" class="ui-up-btn" [disabled]="isDisabled() || full()" (click)="picker.click()">
            <span nz-icon nzType="cloud-upload"></span>{{ buttonText() }}
          </button>
        }
      }

      @if (variant() === 'image') {
        <div class="ui-up-grid">
          @for (f of files(); track f.uid) {
            <figure class="ui-up-thumb">
              @if (f.url) {
                <img [src]="f.url" [alt]="f.name" />
              } @else {
                <span nz-icon nzType="file-text"></span>
              }
              @if (!isDisabled() && !readonly()) {
                <button type="button" class="ui-up-x" (click)="remove(f.uid)" [attr.aria-label]="'Remove ' + f.name">
                  <span nz-icon nzType="close"></span>
                </button>
              }
            </figure>
          }
          @if (!full() && !readonly()) {
            <button
              type="button"
              class="ui-up-add"
              [class.is-invalid]="!!(rejectError() || errorText())"
              [disabled]="isDisabled()"
              (click)="picker.click()"
              (dragover)="onDragOver($event)"
              (drop)="onDrop($event)"
            >
              <span nz-icon nzType="plus"></span>
              <span>Add image</span>
            </button>
          }
        </div>
      } @else if (files().length) {
        <ul class="ui-up-list">
          @for (f of files(); track f.uid) {
            <li>
              @if (f.url && f.type.startsWith('image/')) {
                <img [src]="f.url" alt="" />
              } @else {
                <span class="ui-up-ficon"><span nz-icon nzType="file-text"></span></span>
              }
              <div class="ui-up-meta">
                <strong>{{ f.name }}</strong>
                <span class="num">{{ bytes(f.size) }}</span>
              </div>
              @if (!isDisabled() && !readonly()) {
                <button type="button" class="ui-up-del" (click)="remove(f.uid)" [attr.aria-label]="'Remove ' + f.name">
                  <span nz-icon nzType="delete"></span>
                </button>
              }
            </li>
          }
        </ul>
      }
    </ui-field>
  `,
  styles: [
    `
      :host { display: block; min-width: 0; }
      .ui-up-native { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
      .ui-up-drop {
        display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 22px 16px; text-align: center; cursor: pointer;
        border: 1.5px dashed var(--border-strong); border-radius: var(--radius-lg); background: var(--surface-2);
        transition: border-color 0.15s, background 0.15s;
      }
      .ui-up-drop:hover, .ui-up-drop.is-over { border-color: var(--jade-500); background: var(--jade-50); }
      .ui-up-drop:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ant-primary-color-outline); }
      .ui-up-drop.is-invalid { border-color: var(--danger); }
      .ui-up-drop.is-disabled { cursor: not-allowed; opacity: 0.6; }
      .ui-up-drop strong { color: var(--text); font-size: 13.5px; }
      .ui-up-drop > span:last-child { font-size: 12px; color: var(--text-3); }
      .ui-up-icon { width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; margin-bottom: 4px; font-size: 18px; color: var(--jade-600); background: var(--surface); box-shadow: inset 0 0 0 1px var(--border); }
      .ui-up-btn {
        display: inline-flex; align-items: center; gap: 8px; height: 38px; padding: 0 14px; font: inherit; font-weight: 600; cursor: pointer;
        border: 1px solid var(--border-strong); border-radius: var(--radius); background: var(--surface); color: var(--text);
      }
      .ui-up-btn:hover:not(:disabled) { border-color: var(--jade-500); color: var(--jade-700); background: var(--jade-50); }
      .ui-up-btn:disabled { opacity: 0.55; cursor: not-allowed; }
      .ui-up-list { list-style: none; margin: 10px 0 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
      .ui-up-list li { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); }
      .ui-up-list img { width: 36px; height: 36px; object-fit: cover; border-radius: 8px; }
      .ui-up-ficon { width: 36px; height: 36px; border-radius: 8px; display: grid; place-items: center; color: var(--jade-600); background: var(--jade-50); }
      .ui-up-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; }
      .ui-up-meta strong { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .ui-up-meta span { font-size: 12px; color: var(--text-3); }
      .ui-up-del { width: 30px; height: 30px; border: 0; border-radius: 8px; background: none; color: var(--text-3); cursor: pointer; }
      .ui-up-del:hover { color: var(--danger); background: var(--danger-bg); }
      .ui-up-grid { display: flex; flex-wrap: wrap; gap: 10px; }
      .ui-up-thumb, .ui-up-add { position: relative; width: 104px; height: 104px; margin: 0; border-radius: var(--radius); overflow: hidden; }
      .ui-up-thumb { border: 1px solid var(--border); display: grid; place-items: center; background: var(--surface-2); color: var(--text-3); font-size: 22px; }
      .ui-up-thumb img { width: 100%; height: 100%; object-fit: cover; }
      .ui-up-x { position: absolute; top: 6px; right: 6px; width: 24px; height: 24px; border: 0; border-radius: 50%; display: grid; place-items: center; font-size: 11px; color: #fff; background: rgba(15, 19, 36, 0.6); cursor: pointer; }
      .ui-up-add { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; font: inherit; font-size: 12px; color: var(--text-2); cursor: pointer; border: 1.5px dashed var(--border-strong); background: var(--surface-2); }
      .ui-up-add [nz-icon] { font-size: 18px; color: var(--jade-600); }
      .ui-up-add:hover:not(:disabled) { border-color: var(--jade-500); background: var(--jade-50); }
      .ui-up-add.is-invalid { border-color: var(--danger); }
    `,
  ],
})
export class UiUploadComponent extends UiControlBase<UiUploadFile[]> {
  variant = input<UiUploadVariant>('dropzone');
  /** Same syntax as <input accept>, e.g. "image/*" or ".pdf,.docx". */
  accept = input('');
  maxFiles = input(10, { transform: numberAttribute });
  maxSizeMb = input(5, { transform: numberAttribute });
  buttonText = input('Choose files');
  /** Read images as data URLs so they can be previewed. */
  preview = input(true, { transform: booleanAttribute });

  dragOver = signal(false);
  rejectError = signal<string | null>(null);

  files = computed(() => this.value() ?? []);
  full = computed(() => this.files().length >= this.maxFiles());
  rulesText = computed(() => {
    const parts = [];
    if (this.accept()) parts.push(this.accept().replace(/,/g, ', '));
    parts.push(`up to ${this.maxSizeMb()} MB each`);
    if (this.maxFiles() > 1) parts.push(`max ${this.maxFiles()} files`);
    return parts.join(' · ');
  });
  hintText = computed(() => this.hint() || (this.variant() !== 'dropzone' ? this.rulesText() : ''));

  bytes = formatBytes;

  onPick(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.add(Array.from(input.files ?? []));
    input.value = '';
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    if (!this.isDisabled()) this.dragOver.set(true);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragOver.set(false);
    if (this.isDisabled() || this.readonly()) return;
    this.add(Array.from(e.dataTransfer?.files ?? []));
  }

  remove(uid: string): void {
    this.commit(this.files().filter(f => f.uid !== uid));
    this.rejectError.set(null);
    this.markTouched();
  }

  private add(picked: File[]): void {
    const room = this.maxFiles() - this.files().length;
    const accepted: UiUploadFile[] = [];
    const problems: string[] = [];

    for (const file of picked) {
      if (!this.matchesAccept(file)) problems.push(`${file.name} is not an accepted file type`);
      else if (file.size > this.maxSizeMb() * 1024 * 1024) problems.push(`${file.name} is larger than ${this.maxSizeMb()} MB`);
      else if (accepted.length >= room) problems.push(`Only ${this.maxFiles()} file${this.maxFiles() === 1 ? '' : 's'} allowed`);
      else accepted.push({ uid: `f${++fileUid}`, name: file.name, size: file.size, type: file.type, file });
    }

    this.rejectError.set(problems[0] ?? null);
    if (!accepted.length) return;
    const next = this.maxFiles() === 1 ? accepted.slice(0, 1) : [...this.files(), ...accepted];
    this.commit(next);
    this.markTouched();

    if (this.preview()) {
      for (const f of accepted.filter(a => a.type.startsWith('image/'))) {
        const reader = new FileReader();
        reader.onload = () => this.commit(this.files().map(x => (x.uid === f.uid ? { ...x, url: reader.result as string } : x)));
        reader.readAsDataURL(f.file!);
      }
    }
  }

  private matchesAccept(file: File): boolean {
    const rules = this.accept().split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    if (!rules.length) return true;
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();
    return rules.some(r => (r.startsWith('.') ? name.endsWith(r) : r.endsWith('/*') ? type.startsWith(r.slice(0, -1)) : type === r));
  }

  protected override normalize(v: unknown): UiUploadFile[] {
    return Array.isArray(v) ? (v as UiUploadFile[]) : [];
  }
}
