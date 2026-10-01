export type UiSize = 'sm' | 'md' | 'lg';
export type UiTone = 'neutral' | 'jade' | 'success' | 'warning' | 'danger' | 'info' | 'violet' | 'coral';
export type UiLayout = 'vertical' | 'horizontal';

export interface UiOption<T = unknown> {
  label: string;
  value: T;
  disabled?: boolean;
  /** Secondary line shown under the label in dropdowns and card radios. */
  description?: string;
  icon?: string;
  /** Options with the same group are rendered under one heading. */
  group?: string;
}

/** Maps our sizes onto ng-zorro's size names. */
export const NZ_SIZE: Record<UiSize, 'small' | 'default' | 'large'> = { sm: 'small', md: 'default', lg: 'large' };

let uid = 0;
export function nextUiId(prefix: string): string {
  return `${prefix}-${++uid}`;
}
