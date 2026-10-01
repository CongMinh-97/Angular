import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  TemplateRef,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule, NzTableQueryParams, NzTableSize } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListQuery } from '@models/user.model';

export interface TableColumn {
  key: string;
  title: string;
  width?: string;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  filters?: { text: string; value: string }[];
  /** Hidden on first render; the user can switch it on from "Columns". */
  hidden?: boolean;
  /** Cannot be hidden from the column menu. */
  locked?: boolean;
  fixed?: 'left' | 'right';
}

function stableKey(o: Record<string, string[]>): string {
  return JSON.stringify(Object.keys(o).sort().map(k => [k, [...o[k]].sort()]));
}

/** Custom cell renderer: `<ng-template appCell="status" let-row>…</ng-template>` */
@Directive({ selector: 'ng-template[appCell]', standalone: true })
export class CellDefDirective {
  name = input.required<string>({ alias: 'appCell' });
  template = inject<TemplateRef<{ $implicit: unknown; index: number }>>(TemplateRef);
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzDropDownModule,
    NzCheckboxModule,
    NzToolTipModule,
    NzEmptyModule,
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent<T extends { id: number | string }> {
  columns = input.required<TableColumn[]>();
  data = input<T[]>([]);
  total = input(0);
  loading = input(false);
  pageSizeOptions = input([10, 20, 50]);
  searchPlaceholder = input('Search');
  selectable = input(true);
  itemLabel = input('items');

  query = model<ListQuery>({ page: 1, pageSize: 10 });
  selected = model<Set<T['id']>>(new Set());
  reload = output<void>();

  private cellDefs = contentChildren(CellDefDirective);
  cells = computed(() => new Map(this.cellDefs().map(d => [d.name(), d.template])));

  hiddenKeys = signal<Set<string>>(new Set());
  visibleColumns = computed(() => this.columns().filter(c => !this.hiddenKeys().has(c.key)));
  size = signal<NzTableSize>('middle');
  search = '';

  scrollX = computed(() => {
    const px = this.visibleColumns().reduce((sum, c) => sum + (parseInt(c.width ?? '', 10) || 160), this.selectable() ? 48 : 0);
    return `${px}px`;
  });

  pageIds = computed(() => this.data().map(r => r.id));
  allChecked = computed(() => this.pageIds().length > 0 && this.pageIds().every(id => this.selected().has(id)));
  someChecked = computed(() => !this.allChecked() && this.pageIds().some(id => this.selected().has(id)));

  private search$ = new Subject<string>();

  constructor() {
    effect(
      () => {
        this.hiddenKeys.set(new Set(this.columns().filter(c => c.hidden).map(c => c.key)));
      },
      { allowSignalWrites: true },
    );

    this.search$.pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed()).subscribe(search => {
      this.query.update(q => ({ ...q, search, page: 1 }));
    });
  }

  onSearch(value: string): void {
    this.search$.next(value.trim());
  }

  onQueryParams(p: NzTableQueryParams): void {
    const sort = p.sort.find(s => s.value);
    const prev = this.query();
    const ownKeys = new Set(this.columns().filter(c => c.filters).map(c => c.key));
    // Keep filters applied from outside the table (e.g. a toolbar select).
    const filters: Record<string, string[]> = Object.fromEntries(Object.entries(prev.filters ?? {}).filter(([k]) => !ownKeys.has(k)));
    for (const f of p.filter) {
      if (Array.isArray(f.value) && f.value.length) filters[f.key] = f.value;
    }
    const filtersChanged = stableKey(filters) !== stableKey(prev.filters ?? {});
    const next: ListQuery = {
      ...prev,
      page: filtersChanged ? 1 : p.pageIndex,
      pageSize: p.pageSize,
      sortField: sort?.key ?? null,
      sortOrder: (sort?.value as ListQuery['sortOrder']) ?? null,
      filters,
    };
    // nz-table re-emits when its own inputs change; ignore echoes so the parent doesn't fetch twice.
    const same =
      !filtersChanged && next.page === prev.page && next.pageSize === prev.pageSize &&
      next.sortField === (prev.sortField ?? null) && next.sortOrder === (prev.sortOrder ?? null);
    if (!same) {
      this.query.set(next);
    }
  }

  toggleColumn(key: string, show: boolean): void {
    this.hiddenKeys.update(s => {
      const next = new Set(s);
      if (show) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  resetColumns(): void {
    this.hiddenKeys.set(new Set(this.columns().filter(c => c.hidden).map(c => c.key)));
  }

  toggleRow(id: T['id'], checked: boolean): void {
    this.selected.update(s => {
      const next = new Set(s);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  toggleAll(checked: boolean): void {
    this.selected.update(s => {
      const next = new Set(s);
      for (const id of this.pageIds()) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }

  clearSelection(): void {
    this.selected.set(new Set());
  }

  value(row: T, key: string): unknown {
    return (row as Record<string, unknown>)[key];
  }

  rangeLabel = (total: number, range: [number, number]) => `${range[0]}–${range[1]} of ${total} ${this.itemLabel()}`;
}
