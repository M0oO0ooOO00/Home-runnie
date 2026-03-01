import { CreateRecruitmentPostRequest, CreateRecruitmentPostResponse } from '@homerunnie/shared';
import { apiClient } from '@/lib/fetchClient';

export interface RecruitmentPostItemResponse {
  id: number;
  title: string;
  gameDate: string;
  teamHome: string;
  teamAway: string;
  createdAt: string;
}

export interface GetRecruitmentPostsResponse {
  data: RecruitmentPostItemResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface GetRecruitmentPostDetailResponse {
  id: number;
  title: string;
  gameDate: string;
  gameTime: string;
  stadium: string;
  teamHome: string;
  teamAway: string;
  recruitmentLimit: number;
  currentParticipants: number;
  preferGender: string;
  message: string | null;
  ticketingType: string | null;
  supportTeam: string | null;
  createdAt: string;
}

export const createRecruitmentPost = async (
  data: CreateRecruitmentPostRequest,
): Promise<CreateRecruitmentPostResponse> => {
  return apiClient.post<CreateRecruitmentPostResponse>('/post/recruitment', data, {
    authRequired: true,
  });
};

export const getRecruitmentPosts = async (
  page: number = 1,
  pageSize: number = 10,
): Promise<GetRecruitmentPostsResponse> => {
  return apiClient.get<GetRecruitmentPostsResponse>(
    `/post/recruitment?page=${page}&pageSize=${pageSize}`,
  );
};

export const getRecruitmentPostDetail = async (
  postId: number,
): Promise<GetRecruitmentPostDetailResponse> => {
  return apiClient.get<GetRecruitmentPostDetailResponse>(`/post/recruitment/${postId}`);
};
