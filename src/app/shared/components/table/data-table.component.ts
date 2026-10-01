import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';

export interface Column {
  key: string;
  title: string;
  width?: string;
  hidden?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  render?: (record: any) => string;
}

export interface TableConfig {
  columns: Column[];
  data: any[];
  total?: number;
  loading?: boolean;
  pageSize?: number;
  currentPage?: number;
  showRowNumber?: boolean;
  selectable?: boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzPaginationModule,
    NzCheckboxModule,
    NzDropDownModule,
    NzButtonModule,
    NzIconModule,
    NzEmptyModule,
    NzSpinModule,
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {
  @Input() config!: TableConfig;
  @Input() visibleColumns: string[] = [];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() rowSelect = new EventEmitter<any[]>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<{ key: string; order: string }>();
  @Output() filterChange = new EventEmitter<any>();

  selectedRows: any[] = [];
  displayColumns: Column[] = [];

  ngOnInit(): void {
    this.updateDisplayColumns();
  }

  ngOnChanges(): void {
    this.updateDisplayColumns();
  }

  updateDisplayColumns(): void {
    if (this.config?.columns) {
      this.displayColumns = this.config.columns.filter(col => {
        if (this.visibleColumns.length > 0) {
          return this.visibleColumns.includes(col.key) && !col.hidden;
        }
        return !col.hidden;
      });
    }
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSizeChange.emit(pageSize);
  }

  onRowSelectionChange(selected: any[]): void {
    this.selectedRows = selected;
    this.rowSelect.emit(selected);
  }

  onRowClick(record: any): void {
    this.rowClick.emit(record);
  }

  onSortChange(event: any): void {
    this.sortChange.emit(event);
  }

  onFilterChange(filters: any): void {
    this.filterChange.emit(filters);
  }

  toggleColumnVisibility(columnKey: string): void {
    const index = this.visibleColumns.indexOf(columnKey);
    if (index > -1) {
      this.visibleColumns.splice(index, 1);
    } else {
      this.visibleColumns.push(columnKey);
    }
    this.updateDisplayColumns();
  }
}
