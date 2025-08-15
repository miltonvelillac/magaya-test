import { inject, Injectable } from '@angular/core';
import { take } from 'rxjs';
import { CharactersReducerStore } from '../reducer/characters-reducer.store';
import { CharacterModel } from '@shared/models/character.model';

@Injectable({
  providedIn: 'root'
})
export class CharactersHandlerStore {
  #store = inject(CharactersReducerStore);

  characters = this.#store.characters;
  isLoading = this.#store.isLoading;
  error = this.#store.error;

  loadCharactersByIds(props: { ids: string[] }): void {
    const { ids } = props;
    this.#store.loadCharactersByIds({ ids }).pipe(take(1)).subscribe();
  }

  setCharacters(props: { characters: CharacterModel[] }): void {
    const { characters } = props;
    this.#store.setCharacters({ characters });
  }

  setCharacterIds(props: { ids: string[] }): void {
    const { ids } = props;
    this.#store.setCharacterIds({ ids });
  }
  
}
