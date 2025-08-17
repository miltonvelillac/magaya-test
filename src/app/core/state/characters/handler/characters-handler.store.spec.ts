import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, defer } from 'rxjs';

import { CharactersHandlerStore } from './characters-handler.store';
import { CharactersReducerStore } from '../reducer/characters-reducer.store';
import { CharacterModel } from '@shared/models/character.model';

describe('CharactersHandlerStore', () => {
  let handler: CharactersHandlerStore;

  const charactersSig = signal<CharacterModel[]>([]);
  const selectedCharacterSig = signal<CharacterModel | undefined>(undefined);
  const isLoadingSig = signal<boolean>(false);
  const errorSig = signal<any>(undefined);

  let loadByIdsSubscribeCount = 0;
  let loadByIdSubscribeCount = 0;

  const storeSpy = {
    characters: charactersSig,
    selectedCharacter: selectedCharacterSig,
    isLoading: isLoadingSig,
    error: errorSig,

    loadCharactersByIds: jasmine.createSpy('loadCharactersByIds').and.callFake(() =>
      defer(() => {
        loadByIdsSubscribeCount++;
        return of(0);
      })
    ),
    setCharacters: jasmine.createSpy('setCharacters'),
    setCharacterIds: jasmine.createSpy('setCharacterIds'),
    loadCharacterById: jasmine.createSpy('loadCharacterById').and.callFake(() =>
      defer(() => {
        loadByIdSubscribeCount++;
        return of(0);
      })
    ),
    clearState: jasmine.createSpy('clearState'),
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CharactersHandlerStore,
        { provide: CharactersReducerStore, useValue: storeSpy },
      ],
    });
    handler = TestBed.inject(CharactersHandlerStore);

    // reset counters before each test
    loadByIdsSubscribeCount = 0;
    loadByIdSubscribeCount = 0;

    // reset signals
    charactersSig.set([]);
    selectedCharacterSig.set(undefined);
    isLoadingSig.set(false);
    errorSig.set(undefined);

    // reset method spies calls
    (storeSpy.loadCharactersByIds as jasmine.Spy).calls.reset();
    (storeSpy.setCharacters as jasmine.Spy).calls.reset();
    (storeSpy.setCharacterIds as jasmine.Spy).calls.reset();
    (storeSpy.loadCharacterById as jasmine.Spy).calls.reset();
    (storeSpy.clearState as jasmine.Spy).calls.reset();
  });

  describe('signals re-exposure', () => {
    it('should return the defaul values', () => {
      // Arrange
      // Act
      // Assert
      expect(handler.characters).toBe(storeSpy.characters);
      expect(handler.selectedCharacter).toBe(storeSpy.selectedCharacter);
      expect(handler.isLoading).toBe(storeSpy.isLoading);
      expect(handler.error).toBe(storeSpy.error);
    });

    it('should reflect changes from underlying signals', () => {
      // Arrange
      const list: CharacterModel[] = [{ id: 1, name: 'Rick' } as any];

      // Act
      charactersSig.set(list);
      isLoadingSig.set(true);

      // Assert
      expect(handler.characters()).toEqual(list);
      expect(handler.isLoading()).toBeTrue();
    });
  });

  describe('loadCharactersByIds', () => {
    it('should forward to store with same args and subscribe once', () => {
      // Arrange
      const args = { ids: [1, 2], indexFrom: 0 };

      // Act
      handler.loadCharactersByIds(args);

      // Assert
      expect(storeSpy.loadCharactersByIds).toHaveBeenCalledTimes(1);
      expect(storeSpy.loadCharactersByIds).toHaveBeenCalledWith(args);
      expect(loadByIdsSubscribeCount).toBe(1); // take(1) => exactly one subscription
    });
  });

  describe('setters', () => {
    it('should call setCharacters with the provided list', () => {
      // Arrange
      const chars: CharacterModel[] = [{ id: 7 } as any];

      // Act
      handler.setCharacters({ characters: chars });

      // Assert
      expect(storeSpy.setCharacters).toHaveBeenCalledTimes(1);
      expect(storeSpy.setCharacters).toHaveBeenCalledWith({ characters: chars });
    });

    it('should call setCharacterIds with the provided ids', () => {
      // Arrange
      const ids = [1, 3, 5];

      // Act
      handler.setCharacterIds({ ids });

      // Assert
      expect(storeSpy.setCharacterIds).toHaveBeenCalledTimes(1);
      expect(storeSpy.setCharacterIds).toHaveBeenCalledWith({ ids });
    });
  });

  describe('loadCharacterById', () => {
    it('should forward to store and subscribe once', () => {
      // Arrange
      const args = { id: 42 };

      // Act
      handler.loadCharacterById(args);

      // Assert
      expect(storeSpy.loadCharacterById).toHaveBeenCalledTimes(1);
      expect(storeSpy.loadCharacterById).toHaveBeenCalledWith(args);
      expect(loadByIdSubscribeCount).toBe(1);
    });
  });

  describe('clearState', () => {
    it('should forward to store.clearState', () => {
      // Arrange – nothing

      // Act
      handler.clearState();

      // Assert
      expect(storeSpy.clearState).toHaveBeenCalledTimes(1);
    });
  });
});
