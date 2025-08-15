import { inject } from "@angular/core";
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
import { catchError, Observable, tap, throwError } from "rxjs";

type CharactersState = {
  characterIds: string[];
  characters: CharacterModel[];
  isLoading: boolean;
  error?: ErrorModel;
};

const initialState: CharactersState = {
  characterIds: [],
  characters: [],
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
    loadCharactersByIds(props: { ids: string[] }): Observable<any> {
      patchState(store, { isLoading: true });
      const { ids } = props;
      const request = charactersMapper.getRequest({ ids });
      return rickAndMortyApiService.getCharacters(request).pipe(
        tap((resp) => {
          const response = charactersMapper.getResponseByCharacterIds(resp);
          patchState(store, { isLoading: false, characters: response, error: undefined })
        }),
        catchError(error => throwError(() => patchState(store, { isLoading: false, characters: [], error: {message: ''} })))
      );
    },
    setCharacters(props: { characters: CharacterModel[] }): void {
      const { characters } = props;
      patchState(store, { characters });
    },
    setCharacterIds(props: {ids: string[] }): void {
      const { ids } = props;
      patchState(store, { characterIds: ids })
    }
  }))
);

