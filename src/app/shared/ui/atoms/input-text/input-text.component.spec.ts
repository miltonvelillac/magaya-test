import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InputTextComponent } from './input-text.component';

@Component({
  selector: 'app-test-input-text',
  imports: [
    InputTextComponent
  ],
  template: `
  <app-input-text
    id="inputId"
    [formField]="formField()"
    [icon]="icon()"
    [idIcon]="idIcon"
    (onIconClick)="onIconClick()"
  />
  `,
})
export class InputTextTestComponent {
  formField = signal(new FormControl());
  icon = signal('');
  idIcon = 'iconId';

  onIconClick() {}
}

describe('InputTextComponent', () => {
  let component: InputTextTestComponent;
  let fixture: ComponentFixture<InputTextTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InputTextTestComponent,
        InputTextComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InputTextTestComponent);
    component = fixture.componentInstance;
  });
  
  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('icon', () => {
    it(`should show the icon html element when there is an icon`, () => {
      // Arrange
      component.icon.update(() => 'search');
      
      // Act
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      const iconElement = el.querySelector(`#${component.idIcon}`) as HTMLElement;
      
      // Assert
      expect(iconElement).not.toBeNull();
    });
  
    it(`should not show the icon html element when there is not an icon`, () => {
      // Arrange
      component.icon.update(() => '');
      
      // Act
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      const iconElement = el.querySelector(`#${component.idIcon}`) as HTMLElement;
      
      // Assert
      expect(iconElement).toBeNull();
    });

    it(`should call the onIconClick method when the button is clicked`, () => {
      // Arrange
      component.icon.update(() => 'search');
      spyOn(component, 'onIconClick');
      
      // Act
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      const iconElement = el.querySelector(`#${component.idIcon}`) as HTMLElement;
      iconElement.click();
      
      // Assert
      expect(component.onIconClick).toHaveBeenCalledWith();
    });
  });
  
});
