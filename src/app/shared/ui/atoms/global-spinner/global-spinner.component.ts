import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-global-spinner',
  standalone: true,
  imports: [
    MatProgressSpinnerModule
  ],
  templateUrl: './global-spinner.component.html',
  styleUrl: './global-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms ease-out',
          style({ opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class GlobalSpinnerComponent {
  isLoading = input(false);
  showSpinner = signal(false);

  constructor() {
    effect(() => {
      if(this.isLoading()) this.showSpinner.update(() => this.isLoading());
      else {
        setTimeout(() => {
          this.showSpinner.update(() => this.isLoading())
        }, 500);
      }
    });
  }
  
}
