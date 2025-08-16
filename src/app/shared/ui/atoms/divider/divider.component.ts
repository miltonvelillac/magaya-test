import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-divider',
  imports: [
    MatDividerModule
  ],
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DividerComponent { }
