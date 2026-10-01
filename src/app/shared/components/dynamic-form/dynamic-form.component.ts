import { Component, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

export type FieldType = 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'multiselect' | 'radio' | 'switch' | 'date';

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  hint?: string;
  icon?: string;
  options?: { label: string; value: string | number }[];
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: { regex: RegExp; message: string };
  /** 24 = full row, 12 = half row (stacks on narrow screens). */
  span?: 12 | 24;
  initial?: unknown;
}

/** Builds a FormGroup whose controls and validators mirror the field configs. */
export function buildForm(fields: FieldConfig[]): FormGroup {
  const controls: Record<string, FormControl> = {};
  for (const f of fields) {
    const v: ValidatorFn[] = [];
    if (f.required) v.push(f.type === 'switch' ? Validators.requiredTrue : Validators.required);
    if (f.type === 'email') v.push(Validators.email);
    if (f.minLength) v.push(Validators.minLength(f.minLength));
    if (f.maxLength) v.push(Validators.maxLength(f.maxLength));
    if (f.min !== undefined) v.push(Validators.min(f.min));
    if (f.max !== undefined) v.push(Validators.max(f.max));
    if (f.pattern) v.push(Validators.pattern(f.pattern.regex));
    const empty = f.type === 'multiselect' ? [] : f.type === 'switch' ? false : null;
    controls[f.key] = new FormControl(f.initial ?? empty, v);
  }
  return new FormGroup(controls);
}

export function touchAll(form: FormGroup): void {
  Object.values(form.controls).forEach(c => {
    c.markAsDirty();
    c.updateValueAndValidity({ onlySelf: true });
  });
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzRadioModule,
    NzSwitchModule,
    NzDatePickerModule,
    NzIconModule,
  ],
  templateUrl: './dynamic-form.component.html',
  styles: [
    `
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        column-gap: 16px;
      }
      .span-24 { grid-column: 1 / -1; }
      .hint { margin-top: 4px; font-size: 12px; color: var(--text-3); }
      .req { color: var(--danger); margin-left: 2px; }
      @media (max-width: 639px) {
        .grid { grid-template-columns: minmax(0, 1fr); }
      }
    `,
  ],
})
export class DynamicFormComponent {
  form = input.required<FormGroup>();
  fields = input.required<FieldConfig[]>();
  idPrefix = input('f');
  readonly minNum = Number.MIN_SAFE_INTEGER;
  readonly maxNum = Number.MAX_SAFE_INTEGER;

  errorFor(f: FieldConfig): string {
    const e = this.form().controls[f.key]?.errors;
    if (!e) return '';
    if (e['required']) return `${f.label} is required`;
    if (e['email']) return 'Enter a valid email address, like name@company.com';
    if (e['minlength']) return `Use at least ${e['minlength'].requiredLength} characters`;
    if (e['maxlength']) return `Use at most ${e['maxlength'].requiredLength} characters`;
    if (e['min']) return `Must be ${e['min'].min} or more`;
    if (e['max']) return `Must be ${e['max'].max} or less`;
    if (e['pattern']) return f.pattern?.message ?? 'Invalid format';
    if (e['server']) return e['server'];
    return 'Invalid value';
  }
}
