import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation, forwardRef, inject, input, output, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
  Alignment,
  AutoLink,
  Autoformat,
  BlockQuote,
  Bold,
  ClassicEditor,
  Code,
  CodeBlock,
  EditorConfig,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Fullscreen,
  Heading,
  Highlight,
  HorizontalLine,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  ShowBlocks,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersEssentials,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  WordCount,
} from 'ckeditor5';
import { environment } from '@environments/environment';
import { InsertDate, httpUploadPlugin } from './editor-plugins';

const STYLESHEET_ID = 'ckeditor-styles';

/** CKEditor's 400 KB stylesheet is built as a separate bundle (angular.json) and only loaded when an editor appears. */
function loadEditorStyles(): Promise<void> {
  const existing = document.getElementById(STYLESHEET_ID) as HTMLLinkElement | null;
  if (existing) return existing.dataset['loaded'] ? Promise.resolve() : new Promise(r => existing.addEventListener('load', () => r()));
  return new Promise(resolve => {
    const link = Object.assign(document.createElement('link'), { id: STYLESHEET_ID, rel: 'stylesheet', href: 'ckeditor.css' });
    link.addEventListener('load', () => {
      link.dataset['loaded'] = '1';
      resolve();
    });
    link.addEventListener('error', () => resolve());
    document.head.appendChild(link);
  });
}

export interface EditorStats {
  words: number;
  characters: number;
}

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CKEditorModule, FormsModule],
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RichTextEditorComponent), multi: true }],
})
export class RichTextEditorComponent implements ControlValueAccessor {
  private http = inject(HttpClient);

  placeholder = input('Start writing…');
  minHeight = input(360);
  stats = output<EditorStats>();

  readonly Editor = ClassicEditor;
  stylesReady = signal(false);
  value = '';
  disabled = false;

  readonly config: EditorConfig = {
    licenseKey: 'GPL',
    plugins: [
      Essentials, Paragraph, Heading, Autoformat, TextTransformation, PasteFromOffice,
      Bold, Italic, Underline, Strikethrough, Subscript, Superscript, Code, RemoveFormat,
      FontFamily, FontSize, FontColor, FontBackgroundColor, Highlight, Alignment,
      Link, AutoLink, List, ListProperties, TodoList, Indent, IndentBlock, BlockQuote, HorizontalLine,
      Image, ImageCaption, ImageStyle, ImageToolbar, ImageResize, ImageUpload, ImageInsert, LinkImage,
      Table, TableToolbar, TableProperties, TableCellProperties, TableCaption, TableColumnResize,
      MediaEmbed, CodeBlock, SpecialCharacters, SpecialCharactersEssentials,
      FindAndReplace, SourceEditing, ShowBlocks, Fullscreen, WordCount, InsertDate,
    ],
    extraPlugins: [httpUploadPlugin(this.http, `${environment.apiUrl}/uploads`)],
    toolbar: {
      items: [
        'undo', 'redo', '|',
        'heading', '|',
        'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
        'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'code', 'removeFormat', '|',
        'link', 'insertImage', 'insertTable', 'mediaEmbed', 'blockQuote', 'codeBlock', 'horizontalLine', 'specialCharacters', 'insertDate', '|',
        'alignment', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent', '|',
        'findAndReplace', 'sourceEditing', 'showBlocks', 'fullscreen',
      ],
      // Wrap onto extra rows so every tool stays visible.
      shouldNotGroupWhenFull: true,
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading2', view: 'h2', title: 'Heading 1', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 2', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 3', class: 'ck-heading_heading4' },
      ],
    },
    fontFamily: {
      options: ['default', 'Plus Jakarta Sans, sans-serif', 'Georgia, serif', 'JetBrains Mono, monospace'],
      supportAllValues: true,
    },
    fontSize: { options: [12, 14, 'default', 18, 22, 28], supportAllValues: true },
    fontColor: { columns: 6, colors: palette() },
    fontBackgroundColor: { columns: 6, colors: palette() },
    image: {
      toolbar: ['imageStyle:inline', 'imageStyle:block', 'imageStyle:side', '|', 'toggleImageCaption', 'imageTextAlternative', '|', 'linkImage', 'resizeImage'],
      resizeOptions: [
        { name: 'resizeImage:original', value: null, label: 'Original' },
        { name: 'resizeImage:50', value: '50', label: '50%' },
        { name: 'resizeImage:75', value: '75', label: '75%' },
      ],
      insert: { integrations: ['upload', 'url'] },
    },
    table: { contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties', 'toggleTableCaption'] },
    link: { addTargetToExternalLinks: true, defaultProtocol: 'https://' },
    list: { properties: { styles: true, startIndex: true, reversed: true } },
    codeBlock: {
      languages: [
        { language: 'plaintext', label: 'Plain text' },
        { language: 'typescript', label: 'TypeScript' },
        { language: 'html', label: 'HTML' },
        { language: 'css', label: 'CSS' },
        { language: 'bash', label: 'Bash' },
        { language: 'json', label: 'JSON' },
      ],
    },
    wordCount: { onUpdate: s => this.stats.emit({ words: s.words, characters: s.characters }) },
  };

  private onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    loadEditorStyles().then(() => this.stylesReady.set(true));
  }

  onReady(editor: ClassicEditor): void {
    // Replace CKEditor's window.alert() for upload errors; the HTTP error interceptor already shows a toast.
    editor.plugins.get('Notification').on('show:warning', (evt) => evt.stop(), { priority: 'high' });
    editor.editing.view.change(writer => {
      writer.setStyle('min-height', `${this.minHeight()}px`, editor.editing.view.document.getRoot()!);
    });
  }

  onModelChange(v: string): void {
    this.value = v;
    this.onChange(v);
  }

  writeValue(v: string | null): void {
    this.value = v ?? '';
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
}

function palette() {
  return [
    ['#121729', 'Ink'], ['#586178', 'Slate'], ['#8a92a6', 'Grey'], ['#e3e7ef', 'Mist'], ['#ffffff', 'White', true],
    ['#0d8a74', 'Jade'], ['#2fd3b0', 'Lagoon'], ['#f2643a', 'Coral'], ['#fde4da', 'Coral tint'],
    ['#7b61ff', 'Violet'], ['#f5a524', 'Amber'], ['#3a8ef6', 'Sky'],
  ].map(([color, label, hasBorder]) => ({ color: color as string, label: label as string, hasBorder: !!hasBorder }));
}
