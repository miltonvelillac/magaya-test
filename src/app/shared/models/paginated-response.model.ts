export interface PaginationInfoModel {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface PaginatedResponseModel<T> {
  info: PaginationInfoModel;
  results: T[];
}
