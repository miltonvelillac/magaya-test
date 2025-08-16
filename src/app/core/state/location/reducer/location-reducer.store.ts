import { inject, untracked } from "@angular/core";
import { RickAndMortyApiService } from "@core/api/rick-and-morty/rick-and-morty.api.service";
import { LocationMapper } from "@core/mappers/location/location.mapper";
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState
} from '@ngrx/signals';
import { ErrorModel } from "@shared/models/error.model";
import { LocationRequestModel } from "@shared/models/location-api-request.model";
import { LocationModel } from "@shared/models/location.model";
import { catchError, Observable, of, tap, throwError } from "rxjs";

type LocationState = {
  locations: LocationModel[];
  isLoading: boolean;
  selectedLocation?: LocationModel;
  error?: ErrorModel;
};

const initialState: LocationState = {
  locations: [],
  isLoading: false,
  selectedLocation: undefined,
  error: undefined,
};

export const LocationReducerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(
    (
      { locations, isLoading }
    ) => ({
      locations,
      isLoading,
    })
  ),
  withMethods((store, rickAndMortyApiService = inject(RickAndMortyApiService), locationMapper = inject(LocationMapper)) => ({
    clearState(): void {
      patchState(store, initialState);
    },
    loadLocations(props: LocationRequestModel): Observable<any> {
      patchState(store, { isLoading: true });
      const { dimension, location } = props;
      const request = locationMapper.getRequest({ dimension, location });
      return rickAndMortyApiService.getLocationsByFilters(request).pipe(
        tap((resp) => {
          const response = locationMapper.getResponse({ apiResponse: resp });
          patchState(store, { isLoading: false, locations: response.results, error: undefined })
        }),
        catchError(err => 
          {
            const error: ErrorModel = locationMapper.getErrorResponse({ error: err, searchCriteria: dimension || '' });
            return throwError(() => patchState(store, { isLoading: false, locations: [], error }));
          }
        )
      );
    },
    loadLocationById(props: { id: number }): Observable<any> {
      const { id } = props;
      const currentLocations = untracked(() => store.locations());

      const selectedLocation = currentLocations.find(char => char?.id === id);
      if (selectedLocation) {
        patchState(store, { selectedLocation });
        return of();
      }
      else {
        patchState(store, { isLoading: true });
        const request = locationMapper.getRequest({ ids: [id] });
        return rickAndMortyApiService.getLocationsByFilters(request)
          .pipe(
            tap((apiResponse) => {
              const selectedLocationFromApi = locationMapper.getSingleLocation({ apiResponse });
              patchState(store, { isLoading: false, selectedLocation: selectedLocationFromApi, error: undefined })
            }),
            catchError(err => {
              const error: ErrorModel = locationMapper.getErrorResponse({ error: err, searchCriteria: id });
              return throwError(() => patchState(store, { isLoading: false, selectedLocation: undefined, error }));
            })
          );
      }
    },

  }))
);

