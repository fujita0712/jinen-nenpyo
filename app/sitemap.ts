import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: new Date() },
    { url: `${SITE_URL}/legal/tokusho`, lastModified: new Date() },
    { url: `${SITE_URL}/legal/privacy`, lastModified: new Date() },
    { url: `${SITE_URL}/legal/terms`, lastModified: new Date() },
  ];
}
