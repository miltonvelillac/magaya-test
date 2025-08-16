import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-chips',
  standalone: true,
  imports: [],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipsComponent {
  label = input<string | undefined>('');
}
