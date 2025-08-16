import { inject, Injectable } from '@angular/core';
import { take } from 'rxjs';
import { LocationReducerStore } from '../reducer/location-reducer.store';

@Injectable({
  providedIn: 'root'
})
export class LocationHandlerStore {
  #store = inject(LocationReducerStore);

  locations = this.#store.locations;
  isLoading = this.#store.isLoading;
  error = this.#store.error;

  clearState(): void {
    this.#store.clearState();
  }

  loadLocationsByFilters(props: { dimension?: string, location?: string }): void {
    const { dimension, location } = props;
    this.#store.loadLocations({ dimension, location }).pipe(take(1)).subscribe();
  }
  
}
