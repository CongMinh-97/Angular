import { InjectionToken } from '@angular/core';

/** A message, or a function that builds one from the validator's error payload and the field label. */
export type UiErrorMessage = string | ((error: any, label: string) => string);
export type UiErrorMessages = Record<string, UiErrorMessage>;

export const DEFAULT_ERROR_MESSAGES: UiErrorMessages = {
  required: (_, label) => (label ? `${label} is required` : 'This field is required'),
  requiredTrue: 'You need to tick this to continue',
  email: 'Enter a valid email address, like name@company.com',
  minlength: e => `Use at least ${e.requiredLength} characters`,
  maxlength: e => `Use at most ${e.requiredLength} characters`,
  min: e => `Must be ${e.min} or more`,
  max: e => `Must be ${e.max} or less`,
  pattern: 'The format is not valid',
  minSelected: e => `Choose at least ${e.min}`,
  maxSelected: e => `Choose at most ${e.max}`,
  dateRange: 'The end date must be after the start date',
  fileSize: e => `${e.name} is larger than ${e.maxMb} MB`,
  fileType: e => `${e.name} is not an accepted file type`,
  // Errors set from an API response: control.setErrors({ server: 'Email already in use' })
  server: e => String(e),
};

/**
 * Override or extend the default messages app-wide, e.g. for translation:
 * `{ provide: UI_ERROR_MESSAGES, useValue: { required: 'Bắt buộc nhập' } }`
 */
export const UI_ERROR_MESSAGES = new InjectionToken<UiErrorMessages>('UI_ERROR_MESSAGES', {
  providedIn: 'root',
  factory: () => ({}),
});

export function resolveErrorMessage(key: string, payload: unknown, label: string, ...sources: UiErrorMessages[]): string {
  for (const src of sources) {
    const msg = src[key];
    if (msg !== undefined) return typeof msg === 'function' ? msg(payload, label) : msg;
  }
  return typeof payload === 'string' ? payload : 'This value is not valid';
}
