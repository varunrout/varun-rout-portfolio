import type { MetadataRoute } from 'next';
import { projects } from '@/content/projects';
import { site } from '@/lib/site';

const BASE_URL = site.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = ['', '/about', '/playground'].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${BASE_URL}/work/${p.slug}`,
    lastModified,
  }));

  return [...staticRoutes, ...projectRoutes];
}
