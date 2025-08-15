import { AfterViewInit, ChangeDetectionStrategy, Component, input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements AfterViewInit {
  displayedColumns = input.required<string[]>();
  dataSource = input.required({ transform: this.getDataSource });
  paginationArialLabel = input('');
  hasPagination = input(false);
  pageSizeOptions = input([5, 10, 20]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource().paginator = this.paginator;
  }

  getDataSource(data: unknown[]): MatTableDataSource<unknown[]> {
    return new MatTableDataSource<any>(data);
  }
}
