import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TextConstant } from '@shared/constants/text.constant';
import { ErrorModel } from '@shared/models/error.model';
import { LocationApiRequestModel, LocationRequestModel } from '@shared/models/location-api-request.model';
import { LocationModel } from '@shared/models/location.model';
import { PaginatedResponseModel } from '@shared/models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class LocationMapper {

  getRequest(props: LocationRequestModel): LocationApiRequestModel {
    const { ids, dimension, locationName: location, page } = props;

    const params = new HttpParams({
      fromObject: {
        ...(dimension ? { dimension } : {}),
        ...(location ? { location } : {}),
        ...(page ? { page } : {})
      }
    });

    const idsParams = ids?.join(',') || '';

    return { ids: idsParams, params };
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

  getLocations(props: { apiResponse: any }): LocationModel[] {
    const { apiResponse } = props;
    return apiResponse?.results?.map((resp: any) =>
      this.getSingleLocation({ apiResponse: resp })
    ) || [];
  }

  getSingleLocation(props: { apiResponse: any }): LocationModel {
    const { apiResponse } = props;
    return {
      id: apiResponse.id,
      name: apiResponse.name,
      type: apiResponse.type,
      dimension: apiResponse.dimension,
      residents: apiResponse.residents,
      url: apiResponse.url,
      created: apiResponse.created
    }
  }

  getDimensionsResponse(props: { apiResponse: any }): string[] {
    const { apiResponse } = props;

    let dimensions: { [key: string]: string } = {};
    apiResponse?.results?.forEach((location: any) => {
      const dimension = location.dimension;
      if(!dimensions[dimension]) dimensions[dimension] = dimension;      
    });

    return Object.values(dimensions);
  }

  getErrorResponse(props: { error: any, searchCriteria: string | number }): ErrorModel {
    const { error, searchCriteria } = props;
    const errorMessage = error?.error?.error;
    const message = `${TextConstant.dimension.noDataFoundErrorMessage} ${searchCriteria}`;
    return { messageFromApi: errorMessage, message };
  }


  getLocationsMultipleArray(props: { response: any,  }) {
  const { response } = props;
  const locationsArray: LocationModel[][] = [];
  const dimensionArray: string[][] = [];
  const dimensions: { [key: string]: string } = {};
  response.forEach((resp: any) => {
    locationsArray.push(this.getResponse({ apiResponse: resp }).results);
    dimensionArray.push(this.getDimensionsResponse({ apiResponse: resp }))
  });

  dimensionArray.flat().forEach(dim => dimensions[dim] = dim);
  const dimensionsResult = Object.values(dimensions);
  const locationsResult = locationsArray.flat();
  
  return { locations: locationsResult, dimensions: dimensionsResult };
}

}
