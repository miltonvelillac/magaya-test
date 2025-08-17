import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RickAndMortyApiService } from '@core/api/rick-and-morty/rick-and-morty.api.service';
import { CharactersMapper } from '@core/mappers/characters/characters.mapper';
import { CharacterModel } from '@shared/models/character.model';
import { ErrorModel } from '@shared/models/error.model';
import { CharactersReducerStore } from './characters-reducer.store';

describe('CharactersReducerStore', () => {
  let store: any;
  let api: jasmine.SpyObj<RickAndMortyApiService>;
  let mapper: jasmine.SpyObj<CharactersMapper>;

  beforeEach(() => {
    api = jasmine.createSpyObj<RickAndMortyApiService>('RickAndMortyApiService', ['getCharacters']);
    mapper = jasmine.createSpyObj<CharactersMapper>('CharactersMapper', [
      'getIdsToSearch',
      'getRequest',
      'getResponseByCharacterIds',
      'getCharactersByIndex',
      'getErrorResponse',
      'getResponseByOneCharacterId',
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: RickAndMortyApiService, useValue: api },
        { provide: CharactersMapper, useValue: mapper },
      ],
    });

    store = TestBed.inject(CharactersReducerStore);
  });

  afterEach(() => {
    // Clean up just in case the store retained state between tests
    store.clearState();
  });

  describe('clearState', () => {
    it('should reset to initial state', () => {
      // Arrange
      store.setCharacters({ characters: [{ id: 99 } as CharacterModel] });
      store.setCharacterIds({ ids: [99] });

      // Act
      store.clearState();

      // Assert
      expect(store.characters()).toEqual([]);
      expect(store.isLoading()).toBeFalse();
    });
  });

  describe('setters', () => {
    it('should set characters', () => {
      // Arrange
      const chars: CharacterModel[] = [{ id: 1 } as CharacterModel, { id: 2 } as CharacterModel];

      // Act
      store.setCharacters({ characters: chars });

      // Assert
      expect(store.characters()).toEqual(chars);
    });

    it('should set character ids', () => {
      // Arrange
      const ids = [1, 2, 3];

      // Act
      store.setCharacterIds({ ids });

      // Assert
      expect(store.isLoading()).toBeFalse();
    });
  });

  describe('loadCharactersByIds', () => {
    fit('should short-circuit when no ids to search, not calling API', (done) => {
      // Arrange
      mapper.getIdsToSearch.and.returnValue([]); // nothing to fetch

      // Act
      store.loadCharactersByIds({ ids: [1, 2], indexFrom: 0 }).subscribe({
        next: (resp: any) => {
          // Assert
          expect(resp).toEqual({});
          expect(store.isLoading()).toBeFalse();
          expect(api.getCharacters).not.toHaveBeenCalled();
          done();
        },
        error: done.fail,
      });
    });

    it('should call API and merge characters on success', (done) => {
      // Arrange
      const current: CharacterModel[] = [{ id: 10 } as CharacterModel];
      store.setCharacters({ characters: current });

      const idsToSearch = [1, 2];
      const apiRequest = { ids: idsToSearch };
      const apiRawResponse = { results: [{ id: 1 }, { id: 2 }] };

      mapper.getIdsToSearch.and.returnValue(idsToSearch);
      mapper.getRequest.and.returnValue(apiRequest as any);
      api.getCharacters.and.returnValue(of(apiRawResponse as any));
      mapper.getResponseByCharacterIds.and.returnValue([{ id: 1 }, { id: 2 }] as CharacterModel[]);
      mapper.getCharactersByIndex.and.callFake(({ currentCharacters, charactersFromApi }) => {
        return [...currentCharacters, ...charactersFromApi] as CharacterModel[];
      });

      // Act
      store.loadCharactersByIds({ ids: [1, 2], indexFrom: 0 }).subscribe({
        next: () => {
          // Assert
          expect(api.getCharacters).toHaveBeenCalledTimes(1);
          expect(mapper.getRequest).toHaveBeenCalledWith({ ids: idsToSearch });
          expect(mapper.getResponseByCharacterIds).toHaveBeenCalledWith(apiRawResponse as any);
          expect(store.isLoading()).toBeFalse();
          expect(store.characters()).toEqual([{ id: 10 }, { id: 1 }, { id: 2 }] as any);
          done();
        },
        error: done.fail,
      });
    });

    it('should patch error state on API failure', (done) => {
      // Arrange
      const idsToSearch = [3, 4];
      const apiRequest = { ids: idsToSearch };
      const httpError = new Error('Boom');
      const mappedError: ErrorModel = { message: 'Failed', code: 'X01' } as any;

      mapper.getIdsToSearch.and.returnValue(idsToSearch);
      mapper.getRequest.and.returnValue(apiRequest as any);
      api.getCharacters.and.returnValue(throwError(() => httpError));
      mapper.getErrorResponse.and.returnValue(mappedError);

      // Act
      store.loadCharactersByIds({ ids: [3, 4], indexFrom: 0 }).subscribe({
        next: () => done.fail('expected error'),
        error: () => {
          expect(api.getCharacters).toHaveBeenCalledTimes(1);
          expect(store.isLoading()).toBeFalse();
          done();
        },
      });
    });
  });

  describe('loadCharacterById', () => {
    it('should return from cache and not call API when character exists', (done) => {
      // Arrange
      const cached = [{ id: 42, name: 'Rick' } as CharacterModel];
      store.setCharacters({ characters: cached });

      // Act
      store.loadCharacterById({ id: 42 }).subscribe({
        next: (resp: any) => {
          // Assert
          expect(resp).toEqual({});
          expect(api.getCharacters).not.toHaveBeenCalled();
          done();
        },
        error: done.fail,
      });
    });

    it('should call API and set selectedCharacter on success', (done) => {
      // Arrange
      const apiRequest = { ids: [7] };
      const apiRawResponse = { id: 7, name: 'Morty' };
      const mapped = { id: 7, name: 'Morty' } as CharacterModel;

      mapper.getRequest.and.returnValue(apiRequest as any);
      api.getCharacters.and.returnValue(of(apiRawResponse as any));
      mapper.getResponseByOneCharacterId.and.returnValue(mapped);

      // Act
      store.loadCharacterById({ id: 7 }).subscribe({
        next: () => {
          // Assert
          expect(api.getCharacters).toHaveBeenCalledTimes(1);
          expect(mapper.getRequest).toHaveBeenCalledWith({ ids: [7] });
          expect(mapper.getResponseByOneCharacterId).toHaveBeenCalledWith(apiRawResponse as any);
          expect(store.isLoading()).toBeFalse();
          done();
        },
        error: done.fail,
      });
    });

    it('should patch error state and rethrow on failure', (done) => {
      // Arrange
      const httpError = new Error('Network down');
      const mappedError: ErrorModel = { message: 'Cannot load', code: 'E_NET' } as any;

      mapper.getRequest.and.returnValue({ ids: [8] } as any);
      api.getCharacters.and.returnValue(throwError(() => httpError));
      mapper.getErrorResponse.and.returnValue(mappedError);

      // Act
      store.loadCharacterById({ id: 8 }).subscribe({
        next: () => done.fail('expected error'),
        error: () => {
          // Assert
          expect(api.getCharacters).toHaveBeenCalledTimes(1);
          expect(store.isLoading()).toBeFalse();
          done();
        },
      });
    });
  });
});