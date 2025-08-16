import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UrlsConstants } from '@shared/constants/utls.constant';

@Injectable({
  providedIn: 'root'
})
export class NavigationServiceTsService {
  #router = inject(Router);

  goToCharacters(props: { id: number }): void {
    const { id } = props;
    void this.#router.navigate([UrlsConstants.character], {
      queryParams: { id }
    });
  }

  goToDimensions(): void {
    void this.#router.navigate([UrlsConstants.dimensions]);
  }

  goToLocations(): void {
    void this.#router.navigate([UrlsConstants.locations]);
  }

}
