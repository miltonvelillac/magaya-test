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

  loadCharactersByIds(props: { ids: number[], indexFrom: number }): void {
    const { ids, indexFrom } = props;
    this.#store.loadCharactersByIds({ ids, indexFrom }).pipe(take(1)).subscribe();
  }

  setCharacters(props: { characters: CharacterModel[] }): void {
    const { characters } = props;
    this.#store.setCharacters({ characters });
  }

  setCharacterIds(props: { ids: number[] }): void {
    const { ids } = props;
    this.#store.setCharacterIds({ ids });
  }
  
}
