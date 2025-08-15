import { TestBed } from '@angular/core/testing';
import { CharactersHandlerStore } from './characters-handler.store';

describe('CharactersHandlerStore', () => {
  let service: CharactersHandlerStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharactersHandlerStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
