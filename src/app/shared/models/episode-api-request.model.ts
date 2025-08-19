import { HttpParams } from "@angular/common/http";

export interface EpisodApiRequestModel {
    params?: HttpParams;
}

export interface EpisodRequestModel {
    episodeName?: string;
    page?: number;
}
