import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';
import { MatButtonModule } from '@angular/material/button';
import { Component } from '@angular/core';

@Component({
  selector: 'app-test-button',
  standalone: true,
  imports: [
    ButtonComponent
  ],
  template: `
  <app-button id="btnId" />
  `
})
export class ButtonTestComponent {}

describe('ButtonComponent', () => {
  let component: ButtonTestComponent;
  let fixture: ComponentFixture<ButtonTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ButtonTestComponent,
        ButtonComponent,
        MatButtonModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
