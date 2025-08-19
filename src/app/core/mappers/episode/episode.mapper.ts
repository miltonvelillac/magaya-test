import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TextConstant } from '@shared/constants/text.constant';
import { EpisodApiRequestModel, EpisodRequestModel } from '@shared/models/episode-api-request.model';
import { EpisodeModel } from '@shared/models/episode.model';
import { ErrorModel } from '@shared/models/error.model';
import { PaginatedResponseModel } from '@shared/models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class EpisodeMapper {

  getRequest(props: EpisodRequestModel): EpisodApiRequestModel {
    const { episodeName, page } = props;
    const params = new HttpParams({
      fromObject: {
        ...(episodeName ? { name: episodeName } : {}),
        ...(page ? { page } : {})
      }
    });
    
    return { params }
  }

  getResponse(props: { apiResponse: any }): PaginatedResponseModel<EpisodeModel> {
    const { apiResponse } = props;
    const episodes = this.getEpisodes({ apiResponse });
    return {
      info: {
        count: apiResponse?.info?.count,
        next: apiResponse?.info?.next,
        pages: apiResponse?.info?.pages,
        prev: apiResponse?.info?.prev,
      },
      results: episodes
    };
  }

  getErrorResponse(props: { error: any, episodeSearch: string }): ErrorModel {
    const { error, episodeSearch } = props;
    const errorMessage = error?.error?.error;
    const message = `${TextConstant.episodes.noDataFoundErrorMessage} ${ episodeSearch }`;
    return { messageFromApi: errorMessage, message };
  }

  private getEpisodes(props: { apiResponse: any }): EpisodeModel[] {
    const { apiResponse } = props;
    return apiResponse?.results?.map((resp: any) => ({
      id: resp.id,
      name: resp.name,
      airDate: resp.air_date,
      episode: resp.episode,
      characters: resp.characters,
      url: resp.url,
      created: resp.created
    } as EpisodeModel)) || [];
  }

}
