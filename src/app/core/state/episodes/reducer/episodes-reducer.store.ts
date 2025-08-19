import { inject, untracked } from "@angular/core";
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
import { catchError, forkJoin, map, mergeMap, Observable, of, tap, throwError } from "rxjs";

type EpisodesState = {
  allEpisodes: EpisodeModel[];
  episodes: EpisodeModel[];
  isLoading: boolean;
  error?: ErrorModel;
};

const initialState: EpisodesState = {
  allEpisodes: [],
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
      patchState(store, { ...initialState, allEpisodes: [ ...store.allEpisodes() ] });
    },
    loaAlldEpisodes(): Observable<any> {
      patchState(store, { isLoading: true });
      let page = 1;
      const request = episodeMapper.getRequest({ page });
      return rickAndMortyApiService.getEpisodes(request).pipe(
        map((resp) => episodeMapper.getResponse({ apiResponse: resp })),
        tap((resp) => patchState(store, { isLoading: false, allEpisodes: resp.results, error: undefined })),
        map((resp) => {
          const pages = resp.info.pages;
          if(pages <= 1) return [];

          page++;
          let nextRequests: Observable<any>[] = [];
          for (let index = page; index <= pages; index++) {
            const req = episodeMapper.getRequest({ page: index });            
            nextRequests.push(rickAndMortyApiService.getEpisodes(req));            
          }
          return nextRequests;
        }),
        mergeMap((resp) => forkJoin(resp)),
        tap((resp: any[]) => {
          const episodes = resp.map(r => episodeMapper.getResponse({ apiResponse: r }));
          const episodeResults = episodes.map(ep => ep.results).flat();
          const allEpisodes = untracked(() => store.allEpisodes());
          patchState(store, { isLoading: false, allEpisodes: [...allEpisodes, ...episodeResults], error: undefined });
        }),
        catchError(err => {
          const error: ErrorModel = episodeMapper.getErrorResponse({ error: err, episodeSearch: 'All Episodes' });
          return throwError(() => patchState(store, { isLoading: false, episodes: [], error }));
        }
        )
      );
    },
    loadEpisodes(props: EpisodRequestModel): Observable<any> {
      patchState(store, { isLoading: true });
      const { episodeName } = props;

      // Note: This is to avoid to call the api again if the UI alrady has the needed info due to this data doesn't change fequently
      if (episodeName) {
        const allEpisodes = untracked(() => store.allEpisodes());
        const episodes = allEpisodes?.filter(episode => episode.name?.includes(episodeName));
        if (episodes?.length > 0) {
          patchState(store, { isLoading: false, episodes, error: undefined });
          return of();
        }
      }

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

