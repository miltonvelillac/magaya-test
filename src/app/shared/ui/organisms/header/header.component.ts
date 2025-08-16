import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationServiceTsService } from '@core/services/navigation/navigation.service.ts.service';
import { TextConstant } from '@shared/constants/text.constant';
import { IconComponent } from '@shared/ui/atoms/icons/icon.component';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    IconComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  #navigationServiceTsService = inject(NavigationServiceTsService);

  labels = TextConstant.header;

  goToDimension(): void {
    this.#navigationServiceTsService.goToDimensions();
  }

  goToEpisodes(): void {
    this.#navigationServiceTsService.goToEpisodes();
  }

  goToLocations(): void {
    this.#navigationServiceTsService.goToLocations();
  }
  
}
