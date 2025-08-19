import { inject, Injectable } from '@angular/core';
import { take } from 'rxjs';
import { LocationReducerStore } from '../reducer/location-reducer.store';

@Injectable({
  providedIn: 'root'
})
export class LocationHandlerStore {
  #store = inject(LocationReducerStore);

  allLocations = this.#store.allLocations;
  allDimensions = this.#store.allDimensions;
  locations = this.#store.locations;
  selectedLocation = this.#store.selectedLocation;
  isLoading = this.#store.isLoading;
  error = this.#store.error;

  clearState(): void {
    this.#store.clearState();
  }

  loadAllLocations(): void {
    this.#store.loadAllLocations().pipe(take(1)).subscribe();
  }

  loadLocationsByFilters(props: { dimension?: string, location?: string }): void {
    const { dimension, location } = props;
    this.#store.loadLocations({ dimension, locationName: location }).pipe(take(1)).subscribe();
  }

  loadLocationById(props: { id: number }): void {
    const { id } = props;
    this.#store.loadLocationById({ id }).pipe(take(1)).subscribe();
  }
  
}
