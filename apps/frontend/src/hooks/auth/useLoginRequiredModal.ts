'use client';

import { useEffect, useState } from 'react';

interface UseLoginRequiredModalOptions {
  isLoading: boolean;
  isLogged: boolean;
  enabled?: boolean;
}

export function useLoginRequiredModal({
  isLoading,
  isLogged,
  enabled = true,
}: UseLoginRequiredModalOptions) {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    if (enabled && !isLoading && !isLogged) {
      setLoginModalOpen(true);
    }
  }, [enabled, isLoading, isLogged]);

  return {
    loginModalOpen,
    setLoginModalOpen,
  };
}
