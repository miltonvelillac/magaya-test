import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTableComponent } from './search-table.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalSpinnerComponent } from '@shared/ui/atoms/global-spinner/global-spinner.component';
import { TableComponent } from '@shared/ui/molecules/table/table.component';
import { SearchFieldComponent } from '@shared/ui/molecules/search-field/search-field.component';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-test-search-table',
  imports: [
    SearchTableComponent
  ],
  template: `
  <app-search-table
    [data]="data()"
    [displayedColumns]="displayedColumns()"
    [pageIndex]="pageIndex()"
    [pageLength]="pageLength()"
    [pageSize]="pageSize()"
  />
  `,
})
export class SearchTableTestComponent {
  data = signal([{ id: 1 }]);
  displayedColumns = signal(['id']);
  pageIndex = signal(0);
  pageLength = signal(0);
  pageSize = signal(0);

}

describe('SearchTableComponent', () => {
  let component: SearchTableTestComponent;
  let fixture: ComponentFixture<SearchTableTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchTableComponent,
        FormsModule,
        ReactiveFormsModule,
        GlobalSpinnerComponent,
        TableComponent,
        SearchFieldComponent
      ],
      providers: [
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SearchTableTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
