import { NgTemplateOutlet } from '@angular/common';
import { Component, booleanAttribute, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { UiControlBase } from '../core/ui-control.base';
import { UiFieldComponent } from '../core/ui-field.component';
import { UiOption } from '../core/ui-types';

export interface UiOptionGroup<T> {
  name: string | null;
  options: UiOption<T>[];
}

export function groupOptions<T>(options: UiOption<T>[]): UiOptionGroup<T>[] {
  const map = new Map<string | null, UiOption<T>[]>();
  for (const o of options) {
    const key = o.group ?? null;
    map.set(key, [...(map.get(key) ?? []), o]);
  }
  return [...map.entries()].map(([name, opts]) => ({ name, options: opts }));
}

/**
 * Single-value dropdown.
 *
 * <ui-select formControlName="role" label="Role" [options]="roles" />
 * <ui-select [(value)]="city" [options]="cities" searchable clearable placeholder="All cities" />
 * Remote search: <ui-select serverSearch [loading]="busy" (search)="find($event)" [options]="results" />
 */
@Component({
  selector: 'ui-select',
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
        [ngModel]="value()"
        [ngModelOptions]="{ standalone: true }"
        (ngModelChange)="commit($event)"
        (nzBlur)="markTouched()"
        (nzOnSearch)="search.emit($event)"
        [nzPlaceHolder]="placeholder() || 'Select'"
        [nzSize]="nzSize()"
        [nzStatus]="nzStatus()"
        [nzDisabled]="isDisabled() || readonly()"
        [nzShowSearch]="searchable() || serverSearch()"
        [nzServerSearch]="serverSearch()"
        [nzAllowClear]="clearable()"
        [nzLoading]="loading()"
        [nzNotFoundContent]="emptyText()"
        [nzCustomTemplate]="selectedTpl"
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
    <ng-template #selectedTpl let-selected>
      @if (selectedOption()?.icon) {
        <span nz-icon [nzType]="selectedOption()!.icon!" class="ui-opt-icon"></span>
      }
      {{ selected.nzLabel }}
    </ng-template>
  `,
  styles: [':host{display:block;min-width:0} nz-select{width:100%}'],
})
export class UiSelectComponent<T = unknown> extends UiControlBase<T> {
  options = input<UiOption<T>[]>([]);
  searchable = input(false, { transform: booleanAttribute });
  clearable = input(false, { transform: booleanAttribute });
  loading = input(false, { transform: booleanAttribute });
  /** Disable local filtering and emit (search) so the parent can load options. */
  serverSearch = input(false, { transform: booleanAttribute });
  emptyText = input('No matches');

  search = output<string>();

  groups = computed(() => groupOptions(this.options()));
  selectedOption = computed(() => this.options().find(o => o.value === this.value()));
}
