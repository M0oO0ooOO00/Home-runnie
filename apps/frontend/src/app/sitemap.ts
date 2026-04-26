import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.homerunnie.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${SITE_URL}/home`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];
}
