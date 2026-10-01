import { Component, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { UI_FORM_CONTROLS, UiErrorMessages, UiLayout, UiOption } from '@ui';

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'number'
  | 'currency'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'date'
  | 'daterange'
  | 'time'
  | 'upload';

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  hint?: string;
  tooltip?: string;
  icon?: string;
  options?: UiOption[];
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  /** Extra validators on top of the ones generated from the flags above. */
  validators?: ValidatorFn[];
  /** Field-specific messages, e.g. { pattern: 'Use 10 digits starting with 0' } */
  errorMessages?: UiErrorMessages;
  /** 24 = full row, 12 = half row (stacks on narrow screens). */
  span?: 12 | 24;
  initial?: unknown;
  /** radio: 'default' | 'button' | 'card' */
  variant?: 'default' | 'button' | 'card';
  /** checkbox / switch inline text */
  text?: string;
  accept?: string;
  maxFiles?: number;
}

/** Builds a FormGroup whose controls and validators mirror the field configs. */
export function buildForm(fields: FieldConfig[]): FormGroup {
  const controls: Record<string, FormControl> = {};
  for (const f of fields) {
    const v: ValidatorFn[] = [];
    if (f.required) v.push(f.type === 'checkbox' || f.type === 'switch' ? Validators.requiredTrue : Validators.required);
    if (f.type === 'email') v.push(Validators.email);
    if (f.minLength) v.push(Validators.minLength(f.minLength));
    if (f.maxLength) v.push(Validators.maxLength(f.maxLength));
    if (f.min !== undefined) v.push(Validators.min(f.min));
    if (f.max !== undefined) v.push(Validators.max(f.max));
    if (f.pattern) v.push(Validators.pattern(f.pattern));
    if (f.validators) v.push(...f.validators);
    const empty = f.type === 'multiselect' || f.type === 'upload' ? [] : f.type === 'checkbox' || f.type === 'switch' ? false : null;
    controls[f.key] = new FormControl(f.initial ?? empty, v);
  }
  return new FormGroup(controls);
}

/**
 * Renders a FormGroup from field configs using the ui-* controls.
 * Errors, required marks and messages come from the controls themselves.
 *
 * form = buildForm(FIELDS);
 * <form [formGroup]="form"><app-dynamic-form [form]="form" [fields]="FIELDS" /></form>
 */
@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule, ...UI_FORM_CONTROLS],
  templateUrl: './dynamic-form.component.html',
  styles: [
    `
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 16px; }
      .span-24 { grid-column: 1 / -1; }
      @media (max-width: 639px) { .grid { grid-template-columns: minmax(0, 1fr); } }
    `,
  ],
})
export class DynamicFormComponent {
  form = input.required<FormGroup>();
  fields = input.required<FieldConfig[]>();
  layout = input<UiLayout>('vertical');
  idPrefix = input('f');
}
