import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  OnDestroy,
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
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule, NzTableQueryParams, NzTableSize } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ListQuery } from '@models/user.model';
import { UiButtonComponent, UiEmptyComponent, UiInputComponent } from '@ui';

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
    NzIconModule,
    NzDropDownModule,
    NzCheckboxModule,
    NzToolTipModule,
    UiInputComponent,
    UiButtonComponent,
    UiEmptyComponent,
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent<T extends { id: number | string }> implements AfterViewInit, OnDestroy {
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
  /** Under 640 px the left-pinned columns would eat the scroll area, so only the action column stays pinned. */
  narrow = signal(false);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private resizeObserver?: ResizeObserver;

  scrollX = computed(() => {
    const px = this.visibleColumns().reduce((sum, c) => sum + (parseInt(c.width ?? '', 10) || 160), this.selectable() ? 48 : 0);
    return `${px}px`;
  });

  pageIds = computed(() => this.data().map(r => r.id));
  allChecked = computed(() => this.pageIds().length > 0 && this.pageIds().every(id => this.selected().has(id)));
  someChecked = computed(() => !this.allChecked() && this.pageIds().some(id => this.selected().has(id)));

  constructor() {
    effect(
      () => {
        this.hiddenKeys.set(new Set(this.columns().filter(c => c.hidden).map(c => c.key)));
      },
      { allowSignalWrites: true },
    );
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(([entry]) => this.narrow.set(entry.contentRect.width < 640));
    this.resizeObserver.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  pinLeft(col?: TableColumn): boolean {
    return !this.narrow() && (!col || col.fixed === 'left');
  }

  onSearch(value: string): void {
    const search = value.trim();
    if (search === (this.query().search ?? '')) return;
    this.query.update(q => ({ ...q, search, page: 1 }));
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
