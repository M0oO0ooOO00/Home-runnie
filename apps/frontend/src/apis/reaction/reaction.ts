import { apiClient } from '@/lib/fetchClient';

export type ReactionTargetType = 'POST' | 'COMMENT';

export interface ToggleLikeResponse {
  liked: boolean;
  likeCount: number;
}

export async function toggleLike(
  targetType: ReactionTargetType,
  targetId: number,
): Promise<ToggleLikeResponse> {
  return apiClient.post<ToggleLikeResponse>(`/reaction/like/${targetType}/${targetId}`, undefined, {
    authRequired: true,
  });
}
