import { TestBed } from '@angular/core/testing';

import { LocationHelperService } from './location-helper.service';

describe('LocationHelperService', () => {
  let service: LocationHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
