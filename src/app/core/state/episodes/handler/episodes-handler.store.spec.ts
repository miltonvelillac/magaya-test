import { TestBed } from '@angular/core/testing';
import { EpisodesHandlerStore } from './episodes-handler.store';

describe('EpisodesHandlerStore', () => {
  let service: EpisodesHandlerStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpisodesHandlerStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
