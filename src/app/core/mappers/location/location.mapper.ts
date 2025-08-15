import { Injectable } from '@angular/core';
import { LocationApiRequestModel } from '@shared/models/location-api-request.model';
import { LocationModel } from '@shared/models/location.model';
import { PaginatedResponseModel } from '@shared/models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class LocationMapper {

  getRequest(props: { dimension: string }): LocationApiRequestModel {
    const { dimension } = props;
    return { dimension }
  }
  
  getResponse(apiResponse: any): PaginatedResponseModel<LocationModel> {
    const locations = this.getLocations(apiResponse);
    return {
      info: {
        count: apiResponse?.info?.count,
        next: apiResponse?.info?.next,
        pages: apiResponse?.info?.pages,
        prev: apiResponse?.info?.prev,
      },
      results: locations
    };
  }

  getLocations(apiResponse: any): LocationModel[] {
    return apiResponse?.results?.map((resp: any) => ({
      id: resp.id,
      name: resp.name,
      type: resp.type,
      dimension: resp.dimension,
      residents: resp.residents,
      url: resp.url,
      created: resp.created
    })) || [];
  }
  
}
