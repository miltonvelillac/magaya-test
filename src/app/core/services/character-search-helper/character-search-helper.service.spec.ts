import { TestBed } from '@angular/core/testing';

import { CharacterSearchHelperService } from './character-search-helper.service';
import { CharactersHandlerStore } from '@core/state/characters/handler/characters-handler.store';
import { NavigationServiceTsService } from '../navigation/navigation.service.ts.service';
import { MockProvider } from 'ng-mocks';
import { SnackBarService } from '@shared/ui/atoms/snack-bar/snack-bar.service';

describe('CharacterSearchHelperService', () => {
  let service: CharacterSearchHelperService;

  let charactersHandlerStore: CharactersHandlerStore;
  let navigationServiceTsService: NavigationServiceTsService;
  let snackBarService: SnackBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(CharactersHandlerStore),
        MockProvider(NavigationServiceTsService),
        MockProvider(SnackBarService),
      ]
    });

    charactersHandlerStore = TestBed.inject(CharactersHandlerStore);
    navigationServiceTsService = TestBed.inject(NavigationServiceTsService);
    snackBarService = TestBed.inject(SnackBarService);
    service = TestBed.inject(CharacterSearchHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
