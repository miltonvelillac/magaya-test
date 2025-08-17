import { TestBed } from '@angular/core/testing';
import { EpisodesHandlerStore } from './episodes-handler.store';
import { MockProvider } from 'ng-mocks';
import { EpisodeReducerStore } from '../reducer/episodes-reducer.store';

describe('EpisodesHandlerStore', () => {
  let service: EpisodesHandlerStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(EpisodeReducerStore)
      ]
    });
    service = TestBed.inject(EpisodesHandlerStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
