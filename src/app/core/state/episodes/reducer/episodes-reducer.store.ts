import { inject } from "@angular/core";
import { RickAndMortyApiService } from "@core/api/rick-and-morty/rick-and-morty.api.service";
import { EpisodeMapper } from "@core/mappers/episode/episode.mapper";
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState
} from '@ngrx/signals';
import { EpisodRequestModel } from "@shared/models/episode-api-request.model";
import { EpisodeModel } from "@shared/models/episode.model";
import { ErrorModel } from "@shared/models/error.model";
import { catchError, Observable, tap, throwError } from "rxjs";

type EpisodesState = {
  episodes: EpisodeModel[];
  isLoading: boolean;
  error?: ErrorModel;
};

const initialState: EpisodesState = {
  episodes: [],
  isLoading: false,
  error: undefined,
};

export const EpisodeReducerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(
    (
      { episodes, isLoading }
    ) => ({
      episodes,
      isLoading,
    })
  ),
  withMethods((store, rickAndMortyApiService = inject(RickAndMortyApiService), episodeMapper = inject(EpisodeMapper)) => ({
    clearState(): void {
      patchState(store, initialState);
    },
    loadEpisodes(props: EpisodRequestModel): Observable<any> {
      patchState(store, { isLoading: true });
      const { episodeName } = props;
      const request = episodeMapper.getRequest({ episodeName });
      return rickAndMortyApiService.getEpisodes(request).pipe(
        tap((resp) => {
          const response = episodeMapper.getResponse({ apiResponse: resp });
          patchState(store, { isLoading: false, episodes: response.results, error: undefined })
        }),
        catchError(err => {
          const error: ErrorModel = episodeMapper.getErrorResponse({ error: err, episodeSearch: episodeName || '' });
          return throwError(() => patchState(store, { isLoading: false, episodes: [], error }));
        }
        )
      );
    },
  }))
  
);

