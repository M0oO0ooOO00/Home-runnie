'use client';

import { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/shared/ui/toast/toaster';
import { initMocks, isMockEnabled } from '@/mocks';

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [mockReady, setMockReady] = useState(!isMockEnabled);

  useEffect(() => {
    if (!isMockEnabled) return;
    initMocks().then(() => setMockReady(true));
  }, []);

  if (!mockReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
