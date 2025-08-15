import { inject } from "@angular/core";
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
import { LocationModel } from "@shared/models/location.model";
import { catchError, Observable, tap, throwError } from "rxjs";

type PaginationInfo = { count: number; pages: number; next: string|null; prev: string|null };
type Location = { id:number; name:string; type:string; dimension:string; residents:string[]; url:string; created:string };
type PageResp<T> = { info: PaginationInfo; results: T[] };

const BASE = 'https://rickandmortyapi.com/api';

type LocationState = {
  locations: LocationModel[];
  isLoading: boolean;
  error?: ErrorModel;
};

const initialState: LocationState = {
  locations: [],
  isLoading: false,
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
      isLoading
    })
  ),
  withMethods((store, rickAndMortyApiService = inject(RickAndMortyApiService), locationMapper = inject(LocationMapper)) => ({
    loadLocations(props: { dimension: string }): Observable<any> {
      patchState(store, { isLoading: true });
      const { dimension } = props;
      const request = locationMapper.getRequest({ dimension });
      return rickAndMortyApiService.getLocationsByDimension(request).pipe(
        tap((resp) => {
          const response = locationMapper.getResponse(resp);
          patchState(store, { isLoading: false, locations: response.results, error: undefined })
        }),
        catchError(error => throwError(() => patchState(store, { isLoading: false, locations: [], error: {message: ''} })))
      );
    },

  }))
);

