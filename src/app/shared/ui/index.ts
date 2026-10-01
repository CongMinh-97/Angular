// Harbor UI kit. Import single components, or spread UI_KIT into a standalone component's imports.

import { UiFieldComponent } from './core/ui-field.component';
import { UiAlertComponent } from './display/ui-alert.component';
import { UiAvatarComponent, UiAvatarGroupComponent } from './display/ui-avatar.component';
import { UiButtonComponent } from './display/ui-button.component';
import { UiCardComponent } from './display/ui-card.component';
import { UiEmptyComponent } from './display/ui-empty.component';
import { UiModalComponent, UiModalFooterDirective } from './display/ui-modal.component';
import { UiTagComponent } from './display/ui-tag.component';
import { UiCheckboxComponent, UiCheckboxGroupComponent } from './forms/ui-checkbox.component';
import { UiDatePickerComponent } from './forms/ui-date-picker.component';
import { UiDateRangePickerComponent } from './forms/ui-date-range-picker.component';
import { UiInputComponent } from './forms/ui-input.component';
import { UiMultiSelectComponent } from './forms/ui-multi-select.component';
import { UiNumberComponent } from './forms/ui-number.component';
import { UiRadioGroupComponent } from './forms/ui-radio-group.component';
import { UiSelectComponent } from './forms/ui-select.component';
import { UiSliderComponent } from './forms/ui-slider.component';
import { UiSwitchComponent } from './forms/ui-switch.component';
import { UiTextareaComponent } from './forms/ui-textarea.component';
import { UiTimePickerComponent } from './forms/ui-time-picker.component';
import { UiUploadComponent } from './forms/ui-upload.component';

export * from './core/ui-types';
export * from './core/ui-error-messages';
export * from './core/ui-control.base';
export * from './core/ui-field.component';
export * from './display/ui-alert.component';
export * from './display/ui-avatar.component';
export * from './display/ui-button.component';
export * from './display/ui-card.component';
export * from './display/ui-empty.component';
export * from './display/ui-modal.component';
export * from './display/ui-tag.component';
export * from './forms/ui-checkbox.component';
export * from './forms/ui-date-picker.component';
export * from './forms/ui-date-range-picker.component';
export * from './forms/ui-input.component';
export * from './forms/ui-multi-select.component';
export * from './forms/ui-number.component';
export * from './forms/ui-radio-group.component';
export * from './forms/ui-select.component';
export * from './forms/ui-slider.component';
export * from './forms/ui-switch.component';
export * from './forms/ui-textarea.component';
export * from './forms/ui-time-picker.component';
export * from './forms/ui-upload.component';

export const UI_FORM_CONTROLS = [
  UiFieldComponent,
  UiInputComponent,
  UiTextareaComponent,
  UiNumberComponent,
  UiSelectComponent,
  UiMultiSelectComponent,
  UiDatePickerComponent,
  UiDateRangePickerComponent,
  UiTimePickerComponent,
  UiCheckboxComponent,
  UiCheckboxGroupComponent,
  UiRadioGroupComponent,
  UiSwitchComponent,
  UiSliderComponent,
  UiUploadComponent,
] as const;

export const UI_DISPLAY = [
  UiButtonComponent,
  UiTagComponent,
  UiAvatarComponent,
  UiAvatarGroupComponent,
  UiCardComponent,
  UiAlertComponent,
  UiEmptyComponent,
  UiModalComponent,
  UiModalFooterDirective,
] as const;

/** Everything: `imports: [ReactiveFormsModule, ...UI_KIT]` */
export const UI_KIT = [...UI_FORM_CONTROLS, ...UI_DISPLAY] as const;
