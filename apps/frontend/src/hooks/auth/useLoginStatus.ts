'use client';

import { useMemo } from 'react';
import { useMyProfileQuery } from '@/hooks/my/useProfileQuery';

export function useLoginStatus() {
  const profileQuery = useMyProfileQuery({ retry: false });
  const isLogged = useMemo(
    () => !profileQuery.isError && Boolean(profileQuery.data?.nickname),
    [profileQuery.data?.nickname, profileQuery.isError],
  );

  return {
    profile: profileQuery.data,
    isLogged,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
  };
}
