import { TestBed } from '@angular/core/testing';

import { EpisodeHelperService } from './episode-helper.service';

describe('EpisodeHelperService', () => {
  let service: EpisodeHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpisodeHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
