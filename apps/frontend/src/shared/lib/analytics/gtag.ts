export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export type GaPostType = 'recruitment' | 'feed';
export type WriteCtaSource = 'home_banner' | 'feed_fab' | 'footer';

export type GaEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function pageview(url: string) {
  if (!GA_ID || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('config', GA_ID, { page_path: url });
}

export function event(name: string, params?: GaEventParams) {
  if (!GA_ID || typeof window === 'undefined' || !window.gtag) return;

  const cleaned = params
    ? Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined))
    : undefined;

  window.gtag('event', name, cleaned);
}

export function trackWriteCtaClick(params: {
  post_type: GaPostType;
  source: WriteCtaSource;
  blocked_by_login: boolean;
}) {
  event('write_cta_click', params);
}

export function trackWritePageView(post_type: GaPostType) {
  event('write_page_view', { post_type });
}

export function trackPostCreateSuccess(params: {
  post_type: GaPostType;
  post_id: number | string;
}) {
  event('post_create_success', params);
}

export function trackPostView(params: { post_type: GaPostType; post_id: number | string }) {
  event('post_view', params);
}

export function trackCommentCreateSuccess(params: {
  post_type: GaPostType;
  post_id: number | string;
  is_reply?: boolean;
}) {
  event('comment_create_success', params);
}
