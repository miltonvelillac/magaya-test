import { HttpParams } from "@angular/common/http";

export interface CharacterRequestModel {
    ids: number[];
    page?: number;
}
export interface CharacterApiRequestModel {
    ids?: string;
    params?: HttpParams;
}
