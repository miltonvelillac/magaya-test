import { Injectable } from '@angular/core';
import { TextConstant } from '@shared/constants/text.constant';
import { ErrorModel } from '@shared/models/error.model';
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

  getResponse(props: { apiResponse: any }): PaginatedResponseModel<LocationModel> {
    const { apiResponse } = props;
    const locations = this.getLocations({ apiResponse });
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

  getErrorResponse(props: { error: any, dimesionSearch: string }): ErrorModel {
    const { error, dimesionSearch } = props;
    const errorMessage = error?.error?.error;
    const message = `${TextConstant.dimension.noDataFoundErrorMessage} ${ dimesionSearch }`;
    return { messageFromApi: errorMessage, message };
  }

  private getLocations(props: { apiResponse: any }): LocationModel[] {
    const { apiResponse } = props;
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
