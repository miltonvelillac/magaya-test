import { TestBed } from '@angular/core/testing';

import { CharacterSearchHelperService } from './character-search-helper.service';
import { CharactersHandlerStore } from '@core/state/characters/handler/characters-handler.store';
import { NavigationServiceTsService } from '../navigation/navigation.service.ts.service';
import { MockProvider } from 'ng-mocks';

describe('CharacterSearchHelperService', () => {
  let service: CharacterSearchHelperService;

  let charactersHandlerStore: CharactersHandlerStore;
  let navigationServiceTsService: NavigationServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(CharactersHandlerStore),
        MockProvider(NavigationServiceTsService),
      ]
    });

    charactersHandlerStore = TestBed.inject(CharactersHandlerStore);
    navigationServiceTsService = TestBed.inject(NavigationServiceTsService);
    service = TestBed.inject(CharacterSearchHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
