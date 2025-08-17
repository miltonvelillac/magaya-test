import { TestBed } from '@angular/core/testing';
import { LocationReducerStore } from '../reducer/location-reducer.store';

import { LocationHandlerStore } from './location-handler.store';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('LocationHandlerStore', () => {
  let service: LocationHandlerStore;

  let locationReducerStore: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocationHandlerStore,
        LocationReducerStore,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    locationReducerStore = TestBed.inject(LocationReducerStore);
    service = TestBed.inject(LocationHandlerStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
