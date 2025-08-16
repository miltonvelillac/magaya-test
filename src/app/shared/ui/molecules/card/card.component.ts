import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DividerComponent } from '@shared/ui/atoms/divider/divider.component';

@Component({
  selector: 'app-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    DividerComponent,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {

}
