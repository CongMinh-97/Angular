import { Component, Input, Output, EventEmitter, ViewChild, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzUploadModule,
  ],
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
  ],
})
export class RichTextEditorComponent implements ControlValueAccessor {
  @ViewChild('editor') editorElement: any;

  @Input() placeholder = 'Enter content here...';
  @Input() height = '400px';
  @Output() contentChange = new EventEmitter<string>();

  editorInstance: any;
  content = '';
  isLoading = false;

  constructor(private message: NzMessageService) {}

  ngOnInit(): void {
    this.initializeEditor();
  }

  async initializeEditor(): Promise<void> {
    try {
      // Dynamic import of CKEditor 5
      const { ClassicEditor, Essentials, Paragraph, Bold, Italic, Link, List, Image, ImageUpload, Heading, Alignment } = await import('ckeditor5');

      const editor = await ClassicEditor.create(this.editorElement?.nativeElement, {
        plugins: [Essentials, Paragraph, Bold, Italic, Link, List, Image, ImageUpload, Heading, Alignment],
        toolbar: [
          'heading',
          '|',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          '|',
          'alignment',
          'imageUpload',
          'undo',
          'redo',
        ],
        image: {
          upload: {
            types: ['jpeg', 'png', 'gif', 'bmp', 'webp'],
          },
        },
      });

      editor.model.document.on('change:data', () => {
        this.content = editor.getData();
        this.contentChange.emit(this.content);
        this.onChange(this.content);
      });

      this.editorInstance = editor;
    } catch (error) {
      this.message.error('Failed to initialize editor');
    }
  }

  onImageUpload(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      if (this.editorInstance) {
        this.editorInstance.model.change((writer: any) => {
          const imageElement = writer.createElement('image', {
            src: imageUrl,
          });
          this.editorInstance.model.insertContent(imageElement, this.editorInstance.model.document.selection);
        });
      }
    };
    reader.readAsDataURL(file);
  }

  writeValue(value: string): void {
    if (value && this.editorInstance) {
      this.editorInstance.setData(value);
      this.content = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private onChange: any = () => {};
  private onTouched: any = () => {};
}
