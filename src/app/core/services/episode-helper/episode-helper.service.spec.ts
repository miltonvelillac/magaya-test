import { TestBed } from '@angular/core/testing';

import { EpisodeHelperService } from './episode-helper.service';
import { CharacterSearchHelperService } from '../character-search-helper/character-search-helper.service';
import { CharactersHandlerStore } from '@core/state/characters/handler/characters-handler.store';
import { EpisodesHandlerStore } from '@core/state/episodes/handler/episodes-handler.store';
import { SnackBarService } from '@shared/ui/atoms/snack-bar/snack-bar.service';
import { MockProvider } from 'ng-mocks';

describe('EpisodeHelperService', () => {
  let service: EpisodeHelperService;

  let characterSearchHelperService: CharacterSearchHelperService;
  let charactersHandlerStore: CharactersHandlerStore;
  let episodesHandlerStore: EpisodesHandlerStore
  let snackBarService: SnackBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(CharacterSearchHelperService),
        MockProvider(CharactersHandlerStore),
        MockProvider(EpisodesHandlerStore),
        MockProvider(SnackBarService),
      ]
    });
    characterSearchHelperService = TestBed.inject(CharacterSearchHelperService);
    charactersHandlerStore = TestBed.inject(CharactersHandlerStore);
    episodesHandlerStore = TestBed.inject(EpisodesHandlerStore);
    snackBarService = TestBed.inject(SnackBarService);
    service = TestBed.inject(EpisodeHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
