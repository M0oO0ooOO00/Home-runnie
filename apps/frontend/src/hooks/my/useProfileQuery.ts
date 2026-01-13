import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getMyProfile } from '@/apis/my/member';
import { GetMyProfileResponse } from '@homerunnie/shared';

export const useMyProfileQuery = (
  options?: Omit<UseQueryOptions<GetMyProfileResponse, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['my-profile'],
    queryFn: getMyProfile,
    ...options,
  });
};
