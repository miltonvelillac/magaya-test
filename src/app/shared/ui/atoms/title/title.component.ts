import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [
    ProgressBarComponent
  ],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleComponent {
  id = input('');
  label = input('');
  isLoading = input(false);
}
