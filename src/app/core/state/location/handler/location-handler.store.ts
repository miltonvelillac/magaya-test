import { inject, Injectable } from '@angular/core';
import { LocationReducerStore } from '../reducer/location-reducer.store';
import { LocationApiRequestModel } from '@shared/models/location-api-request.model';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationHandlerStore {
  #store = inject(LocationReducerStore);

  locations = this.#store.locations;
  isLoading = this.#store.isLoading;
  error = this.#store.error;

  loadLocationsByDimension(props: { dimension: string }): void {
    const { dimension } = props;
    this.#store.loadLocations({ dimension }).pipe(take(1)).subscribe();
  }
  
}
