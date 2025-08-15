import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T> {
  displayedColumns = input.required<string[]>();
  rows = input.required<T[]>();

  length = input.required<number>();
  pageIndex = input(0);
  pageSize = input(10);
  pageSizeOptions = input([5, 10, 20]);
  hasPagination = input(true);
  paginationAriaLabel = input('');
  emptyDataMessage = input('');

  pageChange = output<PageEvent>();

  onPage(e: PageEvent) {
    this.pageChange.emit(e);
  }
}
