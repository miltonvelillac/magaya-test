import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonAppearance, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  id = input.required();
  label = input('');
  disabled = input(false);
  color = input('primary');
  apparience = input<MatButtonAppearance>('filled');
}
