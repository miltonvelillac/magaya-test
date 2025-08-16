import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CharacterApiRequestModel } from '@shared/models/character-api-request.model';
import { LocationApiRequestModel } from '@shared/models/location-api-request.model';
import { Observable } from 'rxjs';
import { environment } from '../../env/environment';

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apis.rickAndMorty;

  // Note: the methods return any because we are controlling the model response in the mapper service

  getCharacters(request: CharacterApiRequestModel): Observable<any> {
    const { ids, page } = request;
    const params = new HttpParams({
      fromObject: {
        ...(page ? { page } : {})
      }
    });

    const idsParams = ids?.join(',') || '';

    return this.http.get(
      `${this.baseUrl}/character/${idsParams}`,
      { params }
    );
  }

  getEpisodes(request: CharacterApiRequestModel): Observable<any> {
    const { ids } = request;
    const idsParams = ids?.join(',') || '';

    return this.http.get(
      `${this.baseUrl}/episode/${idsParams}`
    );
  }

  getLocationsByDimension(request: LocationApiRequestModel): Observable<any> {
    const { dimension, page } = request;
    const params = new HttpParams({
      fromObject: {
        dimension,
        ...(page ? { page } : {})
      }
    });

    return this.http.get(
      `${this.baseUrl}/location`,
      { params }
    );
  }

}
