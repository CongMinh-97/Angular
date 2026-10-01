import { HttpClient, HttpEventType } from '@angular/common/http';
import { ButtonView, Editor, FileLoader, Plugin, UploadAdapter, UploadResponse } from 'ckeditor5';
import { Subscription } from 'rxjs';

// Custom toolbar icon (20×20 viewBox, as CKEditor expects): calendar page with a check.
const CALENDAR_ICON =
  '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6 2.5a.75.75 0 0 1 .75.75V4h6.5v-.75a.75.75 0 0 1 1.5 0V4H16a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1.25v-.75A.75.75 0 0 1 6 2.5ZM3.5 8.5v7c0 .28.22.5.5.5h12a.5.5 0 0 0 .5-.5v-7h-13Zm9.78 1.97a.75.75 0 0 1 0 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-1.75-1.75a.75.75 0 1 1 1.06-1.06l1.22 1.22 2.97-2.97a.75.75 0 0 1 1.06 0Z"/></svg>';

/** Toolbar button "insertDate": inserts today's date at the caret, formatted for vi-VN. */
export class InsertDate extends Plugin {
  static get pluginName() {
    return 'InsertDate' as const;
  }

  init(): void {
    const editor = this.editor;
    editor.ui.componentFactory.add('insertDate', locale => {
      const button = new ButtonView(locale);
      button.set({ label: "Insert today's date", icon: CALENDAR_ICON, tooltip: true });
      button.on('execute', () => {
        const text = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date());
        editor.model.change(writer => {
          editor.model.insertContent(writer.createText(text), editor.model.document.selection);
        });
        editor.editing.view.focus();
      });
      return button;
    });
  }
}

/** Sends images through Angular's HttpClient so the auth and error interceptors apply. */
class HttpUploadAdapter implements UploadAdapter {
  private sub?: Subscription;

  constructor(
    private loader: FileLoader,
    private http: HttpClient,
    private url: string,
  ) {}

  upload(): Promise<UploadResponse> {
    return this.loader.file.then(
      file =>
        new Promise<UploadResponse>((resolve, reject) => {
          if (!file) return reject('No file selected.');
          const body = new FormData();
          body.append('upload', file);
          this.sub = this.http.post<{ url: string }>(this.url, body, { reportProgress: true, observe: 'events' }).subscribe({
            next: ev => {
              if (ev.type === HttpEventType.UploadProgress && ev.total) {
                this.loader.uploadTotal = ev.total;
                this.loader.uploaded = ev.loaded;
              } else if (ev.type === HttpEventType.Response && ev.body) {
                resolve({ default: ev.body.url });
              }
            },
            error: err => reject(err.error?.message ?? 'Image upload failed.'),
          });
        }),
    );
  }

  abort(): void {
    this.sub?.unsubscribe();
  }
}

export function httpUploadPlugin(http: HttpClient, url: string) {
  return function HttpUploadAdapterPlugin(editor: Editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = loader => new HttpUploadAdapter(loader, http, url);
  };
}
