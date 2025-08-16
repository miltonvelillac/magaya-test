import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CharacterApiRequestModel } from '@shared/models/character-api-request.model';
import { LocationApiRequestModel } from '@shared/models/location-api-request.model';
import { Observable } from 'rxjs';
import { environment } from '../../env/environment';
import { EpisodApiRequestModel } from '@shared/models/episode-api-request.model';

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

  getEpisodes(request: EpisodApiRequestModel): Observable<any> {
    const { name } = request;
    const params = new HttpParams({
      fromObject: {
        name
      }
    });

    return this.http.get(
      `${this.baseUrl}/episode`,
      { params }
    );
  }

  getLocationsByFilters(props: LocationApiRequestModel): Observable<any> {
    const { ids, params } = props;

    return this.http.get(
      `${this.baseUrl}/location/${ids}`,
      { params }
    );
  }

}
