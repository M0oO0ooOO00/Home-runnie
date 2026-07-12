import type {
  GetRecruitmentPostDetailResponse,
  GetRecruitmentPostsQueryParams,
  GetRecruitmentPostsResponse,
} from '@/apis/post/post';
import type { GetFeedPostsResponse } from '@/apis/feed/feed';
import type { FeedPost } from '@/shared/ui/feed-card/feed-card.types';

const DEFAULT_SITE_URL = 'https://www.homerunnie.app';
const DEFAULT_REVALIDATE_SECONDS = 300;

export const getSiteUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, '');

const getApiBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  return apiUrl ?? `${getSiteUrl()}/api`;
};

export const absoluteUrl = (path: string) => new URL(path, `${getSiteUrl()}/`).toString();

const buildApiUrl = (path: string, query?: URLSearchParams) => {
  const url = new URL(`${getApiBaseUrl()}/${path.replace(/^\//, '')}`);

  query?.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  return url;
};

const fetchSeoJson = async <T>(path: string, query?: URLSearchParams): Promise<T | null> => {
  try {
    const response = await fetch(buildApiUrl(path, query), {
      headers: {
        Accept: 'application/json',
      },
      next: {
        revalidate: DEFAULT_REVALIDATE_SECONDS,
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
};

export const fetchRecruitmentPostsForSeo = (
  params: GetRecruitmentPostsQueryParams = {},
): Promise<GetRecruitmentPostsResponse | null> => {
  const { page = 1, pageSize = 10, picked, ...rest } = params;
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  Object.entries(rest).forEach(([key, value]) => {
    if (value == null) return;
    const text = String(value).trim();
    if (text) query.set(key, text);
  });

  if (picked?.length) {
    query.set('picked', picked.join(','));
  }

  return fetchSeoJson<GetRecruitmentPostsResponse>('/post/recruitment', query);
};

export const fetchRecruitmentPostDetailForSeo = (
  postId: number,
): Promise<GetRecruitmentPostDetailResponse | null> => {
  if (!Number.isFinite(postId) || postId <= 0) {
    return Promise.resolve(null);
  }

  return fetchSeoJson<GetRecruitmentPostDetailResponse>(`/post/recruitment/${postId}`);
};

export const fetchFeedPostsForSeo = (limit = 20): Promise<GetFeedPostsResponse | null> => {
  const query = new URLSearchParams({
    limit: String(limit),
  });

  return fetchSeoJson<GetFeedPostsResponse>('/post/feed', query);
};

export const fetchFeedPostForSeo = (postId: number): Promise<FeedPost | null> => {
  if (!Number.isFinite(postId) || postId <= 0) {
    return Promise.resolve(null);
  }

  return fetchSeoJson<FeedPost>(`/post/feed/${postId}`);
};

export const buildSeoDescription = (value: string | null | undefined, fallback: string) => {
  const text = value?.replace(/\s+/g, ' ').trim() || fallback;
  return text.length > 155 ? `${text.slice(0, 152)}...` : text;
};
