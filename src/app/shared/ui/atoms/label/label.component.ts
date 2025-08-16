import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [
    MatInputModule
  ],
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelComponent {
  label = input('');
}
