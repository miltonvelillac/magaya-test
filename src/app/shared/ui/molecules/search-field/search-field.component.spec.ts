import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFieldComponent } from './search-field.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-search-test-field',
  imports: [
    SearchFieldComponent
  ],
  template: `<app-search-field idInput="inputId" idBtn="buttonId"/>`
})
export class SearchFieldTestComponent {}

describe('SearchFieldComponent', () => {
  let component: SearchFieldTestComponent;
  let fixture: ComponentFixture<SearchFieldTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchFieldTestComponent,
        SearchFieldComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFieldTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
