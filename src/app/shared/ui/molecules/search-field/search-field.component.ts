import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ButtonComponent } from '@shared/ui/atoms/button/button.component';
import { InputTextComponent } from '@shared/ui/atoms/input-text/input-text.component';

@Component({
  selector: 'app-search-field',
  standalone: true,
  imports: [
    InputTextComponent,
    ButtonComponent,
  ],
  templateUrl: './search-field.component.html',
  styleUrl: './search-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFieldComponent {
  idInput = input.required<string>();
  formField = input(new FormControl());
  nameInput = input('');
  labelInput = input('');
  placeholderInput = input('');
  focus = input(false);
  icon = input('close');

  idBtn = input.required();
  labelBtn = input('');
  disabledBtn = input(false);

  onClick = output<void>();
  onEnter = output<void>();

  clearValue(): void {
    this.formField().setValue(null);
  }

  showCloseIcon(): boolean {
    return !!this.formField().value;
  }
}
