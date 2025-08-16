import { TestBed } from '@angular/core/testing';

import { EpisodeMapper } from './episode.mapper';

describe('EpisodeMapper', () => {
  let service: EpisodeMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpisodeMapper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
