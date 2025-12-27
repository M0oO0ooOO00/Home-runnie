export interface PagePaginationResponse<T> {
  currentPage: number;
  totalPage: number;
  totalCount: number;
  data?: T;
}
