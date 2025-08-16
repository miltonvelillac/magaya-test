import { HttpParams } from "@angular/common/http";

export interface LocationRequestModel {
    ids?: number[];
    dimension?: string;
    location?: string;
    page?: number;
}

export interface LocationApiRequestModel {
    ids?: string;
    params?: HttpParams;
}
