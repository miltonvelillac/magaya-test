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
  allLocations: LocationModel[];
  allDimensions: string[];
  locations: LocationModel[];
  isLoading: boolean;
  selectedLocation?: LocationModel;
  error?: ErrorModel;
};

const initialState: LocationState = {
  locations: [],
  allLocations: [],
  allDimensions: [],
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
      patchState(store, { ...initialState, allLocations: [ ...store.allLocations() ], allDimensions: [ ...store.allDimensions() ]});
    },
    loadAllLocations(): Observable<any> {
      patchState(store, { isLoading: true });

      // Note: This is to avoid to call the api again if the UI alrady has the needed info due to this data doesn't change fequently
      const allLocations = untracked(() => store.allLocations());
      if(allLocations?.length > 0) {
        patchState(store, { isLoading: false, error: undefined });
        return of();
      }

      const request = locationMapper.getRequest({});
      return rickAndMortyApiService.getLocationsByFilters(request).pipe(
        tap((resp) => {
          const response = locationMapper.getResponse({ apiResponse: resp });
          const dimensions = locationMapper.getDimensionsResponse({ apiResponse: resp });
          patchState(store, { isLoading: false, allLocations: response.results, allDimensions: dimensions, error: undefined })
        }),
        catchError(err => {
          const error: ErrorModel = locationMapper.getErrorResponse({ error: err, searchCriteria: 'All Locations' });
          return throwError(() => patchState(store, { isLoading: false, locations: [], error }));
        }
        )
      );
    },
    loadLocations(props: LocationRequestModel): Observable<any> {
      patchState(store, { isLoading: true });
      const { dimension, locationName } = props;
      const allLocations = untracked(() => store.allLocations());

      // Note: This is to avoid to call the api again if the UI alrady has the needed info due to this data doesn't change fequently
      if (locationName || dimension) {
        const selectedLocations = locationName ?
          allLocations.filter(char => char?.name?.includes(locationName)) :
          allLocations.filter(char => char?.dimension?.includes(dimension as string));
        if (selectedLocations?.length > 0) {
          patchState(store, { isLoading: false, locations: selectedLocations, error: undefined });
          return of();
        }
      }

      const request = locationMapper.getRequest({ dimension, locationName });
      return rickAndMortyApiService.getLocationsByFilters(request).pipe(
        tap((resp) => {
          const response = locationMapper.getResponse({ apiResponse: resp });
          patchState(store, { isLoading: false, locations: response.results, error: undefined })
        }),
        catchError(err => {
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

