import { TestBed } from '@angular/core/testing';

import { LocationHandlerStore } from './location-handler.store';

describe('LocationHandlerStore', () => {
  let service: LocationHandlerStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationHandlerStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
