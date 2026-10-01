import { Component, OnDestroy, booleanAttribute, computed, input, numberAttribute, output, signal } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UiControlBase } from '../core/ui-control.base';
import { UiFieldComponent } from '../core/ui-field.component';

export type UiInputType = 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';

/**
 * Single-line text input.
 *
 * <ui-input formControlName="email" label="Email" type="email" prefixIcon="mail" />
 * <ui-input [(value)]="q" type="search" placeholder="Search" clearable [debounce]="300" (debounced)="load($event)" />
 */
@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [NzInputModule, NzIconModule, UiFieldComponent],
  template: `
    <ui-field
      [label]="label()"
      [forId]="inputId()"
      [msgId]="msgId()"
      [hint]="hint()"
      [tooltip]="tooltip()"
      [error]="errorText()"
      [required]="isRequired()"
      [layout]="layout()"
      [labelWidth]="labelWidth()"
    >
      <ng-content select="[uiLabelExtra]" ngProjectAs="[uiLabelExtra]" />
      <nz-input-group
        class="ui-control"
        [nzSize]="nzSize()"
        [nzStatus]="nzStatus()"
        [nzPrefix]="hasPrefix() ? prefixTpl : undefined"
        [nzSuffix]="hasSuffix() ? suffixTpl : undefined"
        [nzAddOnBefore]="addonBefore() || undefined"
        [nzAddOnAfter]="addonAfter() || undefined"
      >
        <input
          nz-input
          [nzStatus]="nzStatus()"
          [id]="inputId()"
          [type]="effectiveType()"
          [value]="value() ?? ''"
          [placeholder]="placeholder()"
          [disabled]="isDisabled()"
          [readOnly]="readonly()"
          [attr.maxlength]="maxChars() || null"
          [attr.autocomplete]="autocomplete() || null"
          [attr.inputmode]="inputmode() || null"
          [attr.aria-invalid]="!!errorText()"
          [attr.aria-required]="isRequired()"
          [attr.aria-describedby]="msgId()"
          (input)="onInput($event)"
          (blur)="markTouched()"
          (keydown.enter)="enter.emit(value() ?? '')"
        />
      </nz-input-group>
    </ui-field>

    <ng-template #prefixTpl>
      @if (prefixIcon()) {
        <span nz-icon [nzType]="prefixIcon()" class="ui-affix-icon"></span>
      }
      @if (prefix()) {
        <span class="ui-affix-text">{{ prefix() }}</span>
      }
    </ng-template>

    <ng-template #suffixTpl>
      @if (showClear()) {
        <button type="button" class="ui-affix-btn" (click)="clear()" aria-label="Clear">
          <span nz-icon nzType="close-circle" nzTheme="fill"></span>
        </button>
      }
      @if (showCount() && maxChars()) {
        <span class="ui-count num">{{ length() }}/{{ maxChars() }}</span>
      }
      @if (type() === 'password') {
        <button type="button" class="ui-affix-btn" (click)="reveal.set(!reveal())" [attr.aria-label]="reveal() ? 'Hide password' : 'Show password'">
          <span nz-icon [nzType]="reveal() ? 'eye-invisible' : 'eye'"></span>
        </button>
      }
      @if (suffixIcon()) {
        <span nz-icon [nzType]="suffixIcon()" class="ui-affix-icon"></span>
      }
      @if (suffix()) {
        <span class="ui-affix-text">{{ suffix() }}</span>
      }
    </ng-template>
  `,
  styles: [':host{display:block;min-width:0}'],
})
export class UiInputComponent extends UiControlBase<string> implements OnDestroy {
  type = input<UiInputType>('text');
  prefixIcon = input('');
  suffixIcon = input('');
  /** Text inside the box before the value, e.g. "https://". */
  prefix = input('');
  /** Text inside the box after the value, e.g. "kg". */
  suffix = input('');
  /** Grey box attached outside, e.g. "+84". */
  addonBefore = input('');
  addonAfter = input('');
  clearable = input(false, { transform: booleanAttribute });
  /** Character limit (named maxChars so Angular's [maxlength] validator directive doesn't attach). */
  maxChars = input(0, { transform: numberAttribute });
  showCount = input(false, { transform: booleanAttribute });
  autocomplete = input('');
  inputmode = input('');
  /** Milliseconds to wait after typing before emitting (debounced). 0 = off. */
  debounce = input(0, { transform: numberAttribute });

  enter = output<string>();
  debounced = output<string>();

  reveal = signal(false);
  private timer?: ReturnType<typeof setTimeout>;

  effectiveType = computed(() => (this.type() === 'password' && this.reveal() ? 'text' : this.type()));
  length = computed(() => (this.value() ?? '').length);
  showClear = computed(() => this.clearable() && !!this.value() && !this.isDisabled() && !this.readonly());
  hasPrefix = computed(() => !!(this.prefixIcon() || this.prefix()));
  hasSuffix = computed(
    () => this.clearable() || (this.showCount() && !!this.maxChars()) || this.type() === 'password' || !!this.suffixIcon() || !!this.suffix(),
  );

  onInput(e: Event): void {
    this.commit((e.target as HTMLInputElement).value);
    this.schedule();
  }

  clear(): void {
    this.commit('');
    this.schedule(true);
  }

  private schedule(now = false): void {
    if (!this.debounce()) return;
    clearTimeout(this.timer);
    const v = this.value() ?? '';
    if (now) this.debounced.emit(v);
    else this.timer = setTimeout(() => this.debounced.emit(v), this.debounce());
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}
