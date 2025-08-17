import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MatFormFieldAppearance, FloatLabelType } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputTextComponent implements AfterViewInit {
  id = input.required<string>();
  formField = input(new FormControl());
  focus = input(false);
  name = input('');
  label = input('');
  placeholder = input('');
  appearance = input<MatFormFieldAppearance>('outline');
  floatLabel = input<FloatLabelType>('always');
  errorMessage = input('');

  icon = input('');
  idIcon = input('');
  showIcon = input(true);

  onIconClick = output<void>();

  @ViewChild('appInputText') textareaRef!: ElementRef<HTMLTextAreaElement>;

  ngAfterViewInit(): void {
    this.setFocus();
  }

  setFocus(): void {
    if(!this.focus()) return;
    this.textareaRef.nativeElement.focus();
  }
}
