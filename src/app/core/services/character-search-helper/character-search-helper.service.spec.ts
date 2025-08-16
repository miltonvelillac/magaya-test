import { TestBed } from '@angular/core/testing';

import { CharacterSearchHelperService } from './character-search-helper.service';

describe('CharacterSearchHelperService', () => {
  let service: CharacterSearchHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterSearchHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
