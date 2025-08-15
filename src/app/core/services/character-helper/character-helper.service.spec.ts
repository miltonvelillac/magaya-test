import { TestBed } from '@angular/core/testing';

import { CharacterHelperService } from './character-helper.service';

describe('CharacterHelperService', () => {
  let service: CharacterHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
