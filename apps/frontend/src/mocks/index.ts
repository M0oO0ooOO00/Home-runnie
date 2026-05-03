export const isMockEnabled = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export async function initMocks(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!isMockEnabled) return;
  const { worker } = await import('./browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
  });
}
