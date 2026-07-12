import type { MetadataRoute } from 'next';
import { fetchFeedPostsForSeo, fetchRecruitmentPostsForSeo, getSiteUrl } from '@/lib/seo-api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const SITE_URL = getSiteUrl();
  const now = new Date();
  const [recruitments, feed] = await Promise.all([
    fetchRecruitmentPostsForSeo({ page: 1, pageSize: 100 }),
    fetchFeedPostsForSeo(100),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/home`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/home/list`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/feed`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  const recruitmentRoutes: MetadataRoute.Sitemap =
    recruitments?.data.map((post) => ({
      url: `${SITE_URL}/home/${post.id}`,
      lastModified: new Date(post.createdAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    })) ?? [];

  const feedRoutes: MetadataRoute.Sitemap =
    feed?.items.map((post) => ({
      url: `${SITE_URL}/feed/${post.id}`,
      lastModified: new Date(post.updatedAt ?? post.createdAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    })) ?? [];

  return [...staticRoutes, ...recruitmentRoutes, ...feedRoutes];
}
