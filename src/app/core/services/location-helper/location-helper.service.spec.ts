import { TestBed } from '@angular/core/testing';

import { CharactersHandlerStore } from '@core/state/characters/handler/characters-handler.store';
import { LocationHandlerStore } from '@core/state/location/handler/location-handler.store';
import { SnackBarService } from '@shared/ui/atoms/snack-bar/snack-bar.service';
import { MockProvider } from 'ng-mocks';
import { CharacterSearchHelperService } from '../character-search-helper/character-search-helper.service';
import { LocationHelperService } from './location-helper.service';

describe('LocationHelperService', () => {
  let service: LocationHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CharacterSearchHelperService,
        MockProvider(CharactersHandlerStore),
        MockProvider(LocationHandlerStore),
        MockProvider(SnackBarService),
      ]
    });
    service = TestBed.inject(LocationHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
