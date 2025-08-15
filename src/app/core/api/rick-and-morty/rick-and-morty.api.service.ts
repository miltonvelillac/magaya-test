import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../env/environment';
import { LocationModel } from '../../../shared/models/location.model';
import { PaginatedResponseModel } from '../../../shared/models/paginated-response.model';
import { LocationApiRequestModel } from '@shared/models/location-api-request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apis.rickAndMorty;

  getLocationsByDimension(request: LocationApiRequestModel): Observable<PaginatedResponseModel<LocationModel>> {
    const { dimension, page } = request;
    const params = new HttpParams({
      fromObject: {
        dimension,
        ...(page ? { page } : {})
      }
    });

    return this.http.get<PaginatedResponseModel<LocationModel>>(
      `${this.baseUrl}/location`,
      { params }
    );
  }
  
}
