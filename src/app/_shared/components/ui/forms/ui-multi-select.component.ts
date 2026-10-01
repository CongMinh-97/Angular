import { NgTemplateOutlet } from '@angular/common';
import { Component, booleanAttribute, computed, input, numberAttribute, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { UiControlBase } from '../core/ui-control.base';
import { UiFieldComponent } from '../core/ui-field.component';
import { UiOption } from '../core/ui-types';
import { groupOptions } from './ui-select.component';

/**
 * Multiple-value dropdown. The value is always an array.
 *
 * <ui-multi-select formControlName="teams" label="Teams" [options]="teams" showSelectAll />
 * <ui-multi-select [(value)]="tags" allowCreate placeholder="Type and press Enter" />
 */
@Component({
  selector: 'ui-multi-select',
  standalone: true,
  imports: [FormsModule, NgTemplateOutlet, NzSelectModule, NzIconModule, UiFieldComponent],
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
      <nz-select
        class="ui-control"
        [nzId]="inputId()"
        [nzMode]="allowCreate() ? 'tags' : 'multiple'"
        [ngModel]="value() ?? []"
        [ngModelOptions]="{ standalone: true }"
        (ngModelChange)="commit($event)"
        (nzBlur)="markTouched()"
        (nzOnSearch)="search.emit($event)"
        [nzPlaceHolder]="placeholder() || 'Select one or more'"
        [nzSize]="nzSize()"
        [nzStatus]="nzStatus()"
        [nzDisabled]="isDisabled() || readonly()"
        [nzServerSearch]="serverSearch()"
        [nzAllowClear]="clearable()"
        [nzLoading]="loading()"
        [nzMaxTagCount]="maxTagCount()"
        [nzMaxTagPlaceholder]="moreTpl"
        [nzMaxMultipleCount]="maxSelected() || Infinity"
        [nzTokenSeparators]="allowCreate() ? [','] : []"
        [nzNotFoundContent]="emptyText()"
        [nzDropdownRender]="showSelectAll() && !allowCreate() ? headerTpl : null"
        [attr.aria-invalid]="!!errorText()"
      >
        @for (g of groups(); track g.name) {
          @if (g.name) {
            <nz-option-group [nzLabel]="g.name">
              @for (o of g.options; track o.value) {
                <nz-option nzCustomContent [nzLabel]="o.label" [nzValue]="o.value" [nzDisabled]="!!o.disabled">
                  <ng-container *ngTemplateOutlet="optionTpl; context: { $implicit: o }" />
                </nz-option>
              }
            </nz-option-group>
          } @else {
            @for (o of g.options; track o.value) {
              <nz-option nzCustomContent [nzLabel]="o.label" [nzValue]="o.value" [nzDisabled]="!!o.disabled">
                <ng-container *ngTemplateOutlet="optionTpl; context: { $implicit: o }" />
              </nz-option>
            }
          }
        }
      </nz-select>
    </ui-field>

    <ng-template #optionTpl let-o>
      <div class="ui-opt">
        @if (o.icon) {
          <span nz-icon [nzType]="o.icon" class="ui-opt-icon"></span>
        }
        <div class="ui-opt-text">
          <span>{{ o.label }}</span>
          @if (o.description) {
            <small>{{ o.description }}</small>
          }
        </div>
      </div>
    </ng-template>
    <ng-template #moreTpl let-hidden>+{{ hidden.length }} more</ng-template>
    <ng-template #headerTpl>
      <div class="ui-ms-foot">
        <span class="num">{{ (value() ?? []).length }} of {{ selectable().length }} selected</span>
        <span class="ui-ms-actions">
          <button type="button" (mousedown)="$event.preventDefault()" (click)="selectAll()">Select all</button>
          <button type="button" (mousedown)="$event.preventDefault()" (click)="commit([])">Clear</button>
        </span>
      </div>
    </ng-template>
  `,
  styles: [
    `
      :host { display: block; min-width: 0; }
      nz-select { width: 100%; }
      .ui-ms-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 12px 4px; margin-top: 4px; border-top: 1px solid var(--border); font-size: 12px; color: var(--text-3); }
      .ui-ms-actions { display: flex; gap: 4px; }
      .ui-ms-actions button { border: 0; background: none; padding: 2px 6px; border-radius: 6px; font: inherit; font-weight: 600; color: var(--jade-600); cursor: pointer; }
      .ui-ms-actions button:hover { background: var(--jade-50); }
    `,
  ],
})
export class UiMultiSelectComponent<T = unknown> extends UiControlBase<T[]> {
  readonly Infinity = Infinity;

  options = input<UiOption<T>[]>([]);
  clearable = input(true, { transform: booleanAttribute });
  loading = input(false, { transform: booleanAttribute });
  serverSearch = input(false, { transform: booleanAttribute });
  /** Let users type new values (tags mode). Comma or Enter adds a tag. */
  allowCreate = input(false, { transform: booleanAttribute });
  /** Adds "Select all / Clear" under the list. */
  showSelectAll = input(false, { transform: booleanAttribute });
  /** Tags shown before collapsing into "+N more". */
  maxTagCount = input(3, { transform: numberAttribute });
  /** Hard limit on how many can be selected. 0 = no limit. */
  maxSelected = input(0, { transform: numberAttribute });
  emptyText = input('No matches');

  search = output<string>();

  groups = computed(() => groupOptions(this.options()));
  selectable = computed(() => this.options().filter(o => !o.disabled));

  selectAll(): void {
    const all = this.selectable().map(o => o.value);
    this.commit(this.maxSelected() ? all.slice(0, this.maxSelected()) : all);
  }

  protected override normalize(v: unknown): T[] | null {
    return Array.isArray(v) ? (v as T[]) : [];
  }
}

/** Validator factories for array values: Validators.compose([minSelected(1), maxSelected(3)]) */
export function minSelected(min: number) {
  return (c: { value: unknown }) => (Array.isArray(c.value) && c.value.length < min ? { minSelected: { min, actual: c.value.length } } : null);
}

export function maxSelected(max: number) {
  return (c: { value: unknown }) => (Array.isArray(c.value) && c.value.length > max ? { maxSelected: { max, actual: c.value.length } } : null);
}
