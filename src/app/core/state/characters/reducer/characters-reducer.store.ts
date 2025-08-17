import { inject, untracked } from "@angular/core";
import { RickAndMortyApiService } from "@core/api/rick-and-morty/rick-and-morty.api.service";
import { CharactersMapper } from "@core/mappers/characters/characters.mapper";
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState
} from '@ngrx/signals';
import { CharacterModel } from "@shared/models/character.model";
import { ErrorModel } from "@shared/models/error.model";
import { catchError, Observable, of, tap, throwError } from "rxjs";

type CharactersState = {
  characterIds: number[];
  characters: CharacterModel[];
  isLoading: boolean;
  selectedCharacter?: CharacterModel;
  error?: ErrorModel;
};

const initialState: CharactersState = {
  characterIds: [],
  characters: [],
  selectedCharacter: undefined,
  isLoading: false,
  error: undefined,
};

export const CharactersReducerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(
    (
      { characters, isLoading }
    ) => ({
      characters,
      isLoading,
    })
  ),
  withMethods((store, rickAndMortyApiService = inject(RickAndMortyApiService), charactersMapper = inject(CharactersMapper)) => ({
    clearState(): void {
      patchState(store, initialState);
    },
    loadCharactersByIds(props: { ids: number[], indexFrom: number }): Observable<any> {
      patchState(store, { isLoading: true });
      const { ids, indexFrom } = props;
      const currentCharacters = untracked(() => store.characters());
      const idsToSearch: number[] = charactersMapper.getIdsToSearch({ currentCharacters, characterIds: ids });

      // NOTE: Since the data shouldn't change frequently, the UI only calls the API when it doesn't have the data.
      if (idsToSearch.length === 0) {
        patchState(store, { isLoading: false, error: undefined })
        return of({});
      }

      const request = charactersMapper.getRequest({ ids: idsToSearch });
      return rickAndMortyApiService.getCharacters(request).pipe(
        tap((resp) => {
          const response = charactersMapper.getResponseByCharacterIds(resp);
          const characters = charactersMapper.getCharactersByIndex({ currentCharacters, charactersFromApi: response, indexFrom });
          patchState(store, { isLoading: false, characters, error: undefined })
        }),
        catchError(err => {
          const error: ErrorModel = charactersMapper.getErrorResponse({ error: err, characterSearchIds: ids });
          return throwError(() => patchState(store, { isLoading: false, selectedCharacter: undefined, error }));
        })
      );
    },
    setCharacters(props: { characters: CharacterModel[] }): void {
      const { characters } = props;
      patchState(store, { characters });
    },
    setCharacterIds(props: { ids: number[] }): void {
      const { ids } = props;
      patchState(store, { characterIds: ids })
    },
    loadCharacterById(props: { id: number }): Observable<any> {
      const { id } = props;
      const currentCharacters = untracked(() => store.characters());

      const selectedCharacter = currentCharacters.find(char => char?.id === id);
      if (selectedCharacter) {
        patchState(store, { selectedCharacter });
        return of({});
      }
      else {
        patchState(store, { isLoading: true });
        const request = charactersMapper.getRequest({ ids: [id] });
        return rickAndMortyApiService.getCharacters(request)
          .pipe(
            tap((resp) => {
              const selectedCharacterFromApi = charactersMapper.getResponseByOneCharacterId(resp);
              patchState(store, { isLoading: false, selectedCharacter: selectedCharacterFromApi, error: undefined })
            }),
            catchError(err => {
              const error: ErrorModel = charactersMapper.getErrorResponse({ error: err, characterSearchIds: [id] });
              return throwError(() => patchState(store, { isLoading: false, selectedCharacter: undefined, error }));
            })
          );
      }
    }
  }))
);

