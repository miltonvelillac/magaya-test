import { CharactersMapper } from '@core/mappers/characters/characters.mapper';
import { TextConstant } from '@shared/constants/text.constant';
import { CharacterRequestModel } from '@shared/models/character-api-request.model';
import { CharacterModel } from '@shared/models/character.model';

describe('CharactersMapper', () => {
  let mapper: CharactersMapper;

  beforeEach(() => {
    mapper = new CharactersMapper();
  });

  describe('getRequest', () => {
    it('should build ids as comma-separated and include page', () => {
      // Arrange
      const props: CharacterRequestModel = { ids: [1, 2, 3], page: 5 };

      // Act
      const req = mapper.getRequest(props as any);

      // Assert
      expect(req.ids).toBe('1,2,3');
      expect(req.params?.get('page')).toBe('5');
    });

    it('should build empty ids and omit page when not provided', () => {
      // Arrange
      const props: CharacterRequestModel = { ids: [] };

      // Act
      const req = mapper.getRequest(props as any);

      // Assert
      expect(req.ids).toBe('');
      expect(req.params?.has('page')).toBeFalse();
    });
  });

  describe('getResponseByOneCharacterId', () => {
    it('should map a single API response into CharacterModel', () => {
      // Arrange
      const api = {
        id: 7,
        name: 'Morty',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        origin: { name: 'Earth', url: 'https://test.com/api/1' },
        location: { name: 'Citadel of Ricks', url: 'https://test2.com/api/2' },
        image: 'http://img',
        episode: ['ep1', 'ep2'],
        url: 'http://char/7',
        created: '2020-01-01',
        type: '',
      };

      // Act
      const model = mapper.getResponseByOneCharacterId(api);

      // Assert
      expect(model).toEqual({
        id: 7,
        name: 'Morty',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        origin: { name: 'Earth', url: 'https://test.com/api/1' },
        location: { name: 'Citadel of Ricks', url: 'https://test2.com/api/2' },
        image: 'http://img',
        episode: ['ep1', 'ep2'],
        url: 'http://char/7',
        created: '2020-01-01',
        type: '',
      });
    });
  });

  describe('getResponseByCharacterIds', () => {
    it('should map an array of API responses', () => {
      // Arrange
      const apiArray = [
        { id: 1, name: 'Rick' },
        { id: 2, name: 'Morty' },
      ];

      // Act
      const models = mapper.getResponseByCharacterIds(apiArray as any);

      // Assert
      expect(models.length).toBe(2);
      expect(models[0].id).toBe(1);
      expect(models[1].id).toBe(2);
    });

    it('should return empty array when response is undefined/null', () => {
      // Arrange
      const apiArray = undefined;

      // Act
      const models = mapper.getResponseByCharacterIds(apiArray as any);

      // Assert
      expect(models).toEqual([]);
    });
  });

  describe('getCharactersByIndex', () => {
    it('should place characters starting at indexFrom when slots are empty', () => {
      // Arrange
      const current: CharacterModel[] = [];
      const charactersFromApi = [{ id: 1 } as CharacterModel, { id: 2 } as CharacterModel];
      const indexFrom = 10;

      // Act
      const result = mapper.getCharactersByIndex({ currentCharacters: current, charactersFromApi, indexFrom });

      // Assert
      expect(result[indexFrom]).toEqual({ id: 1 } as any);
      expect(result[indexFrom + 1]).toEqual({ id: 2 } as any);
      expect(result[indexFrom - 1]).toBeUndefined();
    });

    it('should skip occupied slots inside [indexFrom, indexFrom+len)', () => {
      // Arrange
      const indexFrom = 10;
      const current: CharacterModel[] = [];
      current[indexFrom] = { id: 99 } as CharacterModel; // occupied at 10
      const charactersFromApi = [{ id: 1 } as CharacterModel, { id: 2 } as CharacterModel];

      // Act
      const result = mapper.getCharactersByIndex({ currentCharacters: current, charactersFromApi, indexFrom });

      // Assert
      expect(result[indexFrom]).toEqual({ id: 99 } as any); // original kept
      expect(result[indexFrom + 1]).toEqual({ id: 1 } as any);
      expect(result[indexFrom + 2]).toEqual({ id: 2 } as any);
    });

    it('should append after multiple occupied positions', () => {
      // Arrange
      const indexFrom = 10;
      const current: CharacterModel[] = [];
      current[indexFrom] = { id: 50 } as CharacterModel;      // occupied at 10
      current[indexFrom + 1] = { id: 51 } as CharacterModel;  // occupied at 11
      const charactersFromApi = [{ id: 1 } as CharacterModel, { id: 2 } as CharacterModel];

      // Act
      const result = mapper.getCharactersByIndex({ currentCharacters: current, charactersFromApi, indexFrom });

      // Assert
      expect(result[indexFrom]).toEqual({ id: 50 } as any);
      expect(result[indexFrom + 1]).toEqual({ id: 51 } as any);
      expect(result[indexFrom + 2]).toEqual({ id: 1 } as any);
      expect(result[indexFrom + 3]).toEqual({ id: 2 } as any);
    });
  });

  describe('getIdsToSearch', () => {
    it('should return all ids when current is empty', () => {
      // Arrange
      const current: CharacterModel[] = [];
      const ids = [1, 2, 3];

      // Act
      const result = mapper.getIdsToSearch({ currentCharacters: current, characterIds: ids });

      // Assert
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return only missing ids when some exist', () => {
      // Arrange
      const current: CharacterModel[] = [{ id: 1 } as any, undefined as any, { id: 3 } as any];
      const ids = [1, 2, 3];

      // Act
      const result = mapper.getIdsToSearch({ currentCharacters: current, characterIds: ids });

      // Assert
      expect(result).toEqual([2]);
    });

    it('should return empty when all exist', () => {
      // Arrange
      const current: CharacterModel[] = [{ id: 1 } as any, { id: 2 } as any];
      const ids = [1, 2];

      // Act
      const result = mapper.getIdsToSearch({ currentCharacters: current, characterIds: ids });

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getErrorResponse', () => {
    it('should map nested API error and compose message with searched ids', () => {
      // Arrange
      const apiError = { error: { error: 'Server says no' } };
      const ids = [4, 5];

      // Act
      const result = mapper.getErrorResponse({ error: apiError, characterSearchIds: ids });

      // Assert
      expect(result.messageFromApi).toBe('Server says no');
      // message must start with constant + a space, then "4, 5"
      expect(result.message).toBe(`${TextConstant.character.noDataFoundErrorMessage} 4, 5`);
    });
  });
});
