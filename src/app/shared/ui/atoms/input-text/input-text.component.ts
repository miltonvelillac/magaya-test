import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, input, ViewChild } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MatFormFieldAppearance, FloatLabelType } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputTextComponent implements AfterViewInit {
  formField = input(new FormControl());
  focus = input(false);
  id = input('');
  name = input('');
  label = input('');
  placeholder = input('');
  appearance = input<MatFormFieldAppearance>('outline');
  floatLabel = input<FloatLabelType>('always');
  errorMessage = input('');

  @ViewChild('appInputText') textareaRef!: ElementRef<HTMLTextAreaElement>;

  ngAfterViewInit(): void {
    this.setFocus();
  }

  setFocus(): void {
    if(!this.focus()) return;
    this.textareaRef.nativeElement.focus();
  }
}
