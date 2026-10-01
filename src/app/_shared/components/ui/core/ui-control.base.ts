import { Directive, booleanAttribute, computed, inject, input, model, output, signal } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm, Validators } from '@angular/forms';
import { DEFAULT_ERROR_MESSAGES, UI_ERROR_MESSAGES, UiErrorMessages, resolveErrorMessage } from './ui-error-messages';
import { NZ_SIZE, UiLayout, UiSize, nextUiId } from './ui-types';

/**
 * Base for every form control in the kit. One component works three ways:
 *
 *   Reactive forms   <ui-input formControlName="email" label="Email" />
 *   Template forms   <ui-input [(ngModel)]="email" name="email" label="Email" />
 *   Standalone       <ui-input [(value)]="email" placeholder="Search" />
 *
 * Inside a form it reads validators to show the required mark and renders the
 * first error once the control is touched, dirty, or the form was submitted.
 * Outside a form, pass `error` to show a message yourself.
 */
@Directive()
export abstract class UiControlBase<T> implements ControlValueAccessor {
  /** Field label rendered above (or beside, with layout="horizontal") the control. */
  label = input('');
  /** Helper text under the control; replaced by the error message when invalid. */
  hint = input('');
  /** Adds a ? icon next to the label with this text as tooltip. */
  tooltip = input('');
  placeholder = input('');
  size = input<UiSize>('md');
  layout = input<UiLayout>('vertical');
  /** Label column width when layout="horizontal". */
  labelWidth = input('160px');
  /** Shows the required mark. Detected automatically from Validators.required inside forms. */
  required = input(false, { transform: booleanAttribute });
  readonly = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  /** Error text to show without a form control (standalone usage, async checks…). */
  error = input<string | null | undefined>(null);
  /** Per-field message overrides, e.g. { pattern: 'Use 10 digits starting with 0' }. */
  errorMessages = input<UiErrorMessages>({});
  inputId = input(nextUiId('ui'));

  /** Two-way bindable value for standalone use: [(value)]. */
  value = model<T | null>(null);
  /** Fires when the control loses focus. */
  blurred = output<void>();

  protected ngControl = inject(NgControl, { self: true, optional: true });
  private formGroupDir = inject(FormGroupDirective, { optional: true });
  private ngForm = inject(NgForm, { optional: true });
  private globalMessages = inject(UI_ERROR_MESSAGES);

  private cvaDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  readonly nzSize = computed(() => NZ_SIZE[this.size()]);
  readonly msgId = computed(() => `${this.inputId()}-msg`);

  private onChange: (v: T | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Registering ourselves avoids the NG_VALUE_ACCESSOR provider and its circular DI with NgControl.
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  /** Call from the template whenever the user changes the value. */
  protected commit(v: T | null): void {
    this.value.set(v);
    this.onChange(v);
  }

  protected markTouched(): void {
    this.onTouched();
    this.blurred.emit();
  }

  /** Normalises values coming from the form model (e.g. undefined → null). */
  protected normalize(v: unknown): T | null {
    return (v ?? null) as T | null;
  }

  // Evaluated during change detection, so it reacts to touched/dirty/submit without subscriptions.
  errorText(): string | null {
    const manual = this.error();
    if (manual) return manual;
    const control = this.ngControl?.control;
    if (!control?.errors) return null;
    const submitted = this.formGroupDir?.submitted || this.ngForm?.submitted;
    if (!control.touched && !control.dirty && !submitted) return null;
    const [key, payload] = Object.entries(control.errors)[0];
    return resolveErrorMessage(key, payload, this.label(), this.errorMessages(), this.globalMessages, DEFAULT_ERROR_MESSAGES);
  }

  isRequired(): boolean {
    const control = this.ngControl?.control;
    return this.required() || !!control?.hasValidator(Validators.required) || !!control?.hasValidator(Validators.requiredTrue);
  }

  nzStatus(): 'error' | '' {
    return this.errorText() ? 'error' : '';
  }

  // ControlValueAccessor
  writeValue(v: unknown): void {
    this.value.set(this.normalize(v));
  }

  registerOnChange(fn: (v: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.cvaDisabled.set(disabled);
  }
}
