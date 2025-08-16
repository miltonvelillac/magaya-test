import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { GlobalSpinnerComponent } from '@shared/ui/atoms/global-spinner/global-spinner.component';
import { SearchFieldComponent } from '@shared/ui/molecules/search-field/search-field.component';
import { TableComponent } from '@shared/ui/molecules/table/table.component';

@Component({
  selector: 'app-search-table',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GlobalSpinnerComponent,
    TableComponent,
    SearchFieldComponent
  ],
  templateUrl: './search-table.component.html',
  styleUrl: './search-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchTableComponent<T> {
  formField = input(new FormControl());
  idInput = input('');
  nameInput = input('');
  labelInput = input('');
  placeholderInput = input('');
  focus = input(true);
  idBtn = input('');
  labelBtn = input('');
  disabledBtn = input(false);

  data = input.required<T[]>();
  displayedColumns = input.required<string[]>();
  pageIndex = input.required<number>();
  pageLength = input.required<number>();
  pageSize = input.required<number>();
  emptyDataMessage = input('');

  isLoading = input(false);

  onEnter = output<void>();
  onClick = output<void>();
  onPage = output<PageEvent>();
  onRowClick = output<T>();
}
