import { TestBed } from '@angular/core/testing';

import { CharactersMapper } from './characters.mapper';

describe('CharactersMapper', () => {
  let service: CharactersMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharactersMapper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
