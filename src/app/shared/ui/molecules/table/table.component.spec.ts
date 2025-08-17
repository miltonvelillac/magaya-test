import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-test-table',
  imports: [TableComponent],
  template: `
  <app-table [displayedColumns]="[]" [rows]="[]" [length]="10"/>
  `,
})
export class TableTestComponent { }

describe('TableComponent', () => {
  let component: TableTestComponent;
  let fixture: ComponentFixture<TableTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TableTestComponent,
        TableComponent,
        MatTableModule,
        MatPaginatorModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TableTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
