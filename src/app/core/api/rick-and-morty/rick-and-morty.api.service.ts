import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../env/environment';
import { LocationModel } from '../../../shared/models/location.model';
import { PaginatedResponseModel } from '../../../shared/models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apis.rickAndMorty;

  getLocationsByDimension(props: { dimension: string, page?: number }) {
    const { dimension, page } = props;
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
