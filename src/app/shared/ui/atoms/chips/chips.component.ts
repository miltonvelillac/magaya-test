import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

@Component({
  selector: 'app-chips',
  standalone: true,
  imports: [
    ProgressBarComponent
  ],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipsComponent {
  label = input<string | undefined>('');
  isClickeble = input(false);
  isLoading = input(false);
}
