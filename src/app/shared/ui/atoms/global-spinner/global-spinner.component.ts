import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-global-spinner',
  standalone: true,
  imports: [
    MatProgressSpinnerModule
  ],
  templateUrl: './global-spinner.component.html',
  styleUrl: './global-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalSpinnerComponent {
  isLoading = input(false);
}
