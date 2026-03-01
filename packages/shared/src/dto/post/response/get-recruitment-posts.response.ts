import { RecruitmentPostItemResponse } from './recruitment-post-item.response';

export interface GetRecruitmentPostsResponse {
  data: RecruitmentPostItemResponse[];
  total: number;
  page: number;
  limit: number;
}
