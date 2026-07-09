import type { MetadataRoute } from 'next'
import { all, pageCollections } from '@/lib/content'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = pageCollections.flatMap((c) =>
    all(c).map((e) => ({
      url: `${site.url}${e.url}`,
      lastModified: e.date ? new Date(e.date) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  )
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...pages,
  ]
}
