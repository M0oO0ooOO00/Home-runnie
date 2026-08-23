'use client';

import dynamic from 'next/dynamic';
import { ReactNode, Suspense, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/shared/ui/toast/toaster';
import { initMocks, isMockEnabled } from '@/mocks';
import GaPageView from '@/shared/lib/analytics/GaPageView';

const ReactQueryDevtools = dynamic(
  () =>
    import('@tanstack/react-query-devtools').then(({ ReactQueryDevtools: Devtools }) => Devtools),
  { ssr: false },
);

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
      <Suspense fallback={null}>
        <GaPageView />
      </Suspense>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
