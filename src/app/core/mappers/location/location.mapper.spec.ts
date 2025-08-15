import { TestBed } from '@angular/core/testing';

import { LocationMapper } from './location.mapper';

describe('LocationMapper', () => {
  let service: LocationMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationMapper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
