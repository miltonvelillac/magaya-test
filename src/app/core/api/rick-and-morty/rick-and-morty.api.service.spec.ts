import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpParams } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { RickAndMortyApiService } from './rick-and-morty.api.service';
import { CharacterApiRequestModel } from '@shared/models/character-api-request.model';
import { EpisodApiRequestModel } from '@shared/models/episode-api-request.model';
import { LocationApiRequestModel } from '@shared/models/location-api-request.model';


describe('RickAndMortyApiService', () => {
  let service: RickAndMortyApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RickAndMortyApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(RickAndMortyApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('getCharacters', () => {
    it('should GET /character/{ids} with page param when provided', () => {
      // Arrange
      const params = new HttpParams({ fromObject: { page: 3 } });
      const request: CharacterApiRequestModel = { ids: '1,2', params };
      const mockResponse = { info: { count: 2 }, results: [{ id: 1 }, { id: 2 }] };
      let result: any;

      // Act
      service.getCharacters(request).subscribe(res => (result = res));

      // Assert
      const req = http.expectOne(r => r.method === 'GET' && r.url.endsWith('/character/1,2'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('3');
      req.flush(mockResponse);
      expect(result).toEqual(mockResponse);
    });

    it('should GET /character/ (trailing slash) without page when ids is empty', () => {
      // Arrange
      const params = new HttpParams({ fromObject: { } });
      const request: CharacterApiRequestModel = { ids: '', params };

      const mockResponse = { info: { count: 0 }, results: [] };
      let result: any;

      // Act
      service.getCharacters(request as any).subscribe(res => (result = res));

      // Assert
      const req = http.expectOne(r => r.method === 'GET' && r.url.endsWith('/character/'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.has('page')).toBeFalse();
      req.flush(mockResponse);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getEpisodes', () => {
    it('should GET /episode with name query param', () => {
      // Arrange
      const params = new HttpParams({ fromObject: { name: 'Pilot' } });
      const request: EpisodApiRequestModel = { params };
      const mockResponse = { info: { count: 1 }, results: [{ id: 1, name: 'Pilot' }] };
      let result: any;

      // Act
      service.getEpisodes(request as any).subscribe(res => (result = res));

      // Assert
      const req = http.expectOne(r => r.method === 'GET' && r.url.endsWith('/episode'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('name')).toBe('Pilot');
      req.flush(mockResponse);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getLocationsByFilters', () => {
    it('should GET /location/{ids} and forward given HttpParams', () => {
      // Arrange
      const params = new HttpParams({ fromObject: { type: 'Planet', name: 'Earth' } });
      const request: LocationApiRequestModel = { ids: '1,2,3', params };
      const mockResponse = [{ id: 1 }, { id: 2 }, { id: 3 }];
      let result: any;

      // Act
      service.getLocationsByFilters(request as any).subscribe(res => (result = res));

      // Assert
      const req = http.expectOne(r => r.method === 'GET' && r.url.endsWith('/location/1,2,3'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('type')).toBe('Planet');
      expect(req.request.params.get('name')).toBe('Earth');
      req.flush(mockResponse);
      expect(result).toEqual(mockResponse);
    });
  });
});
