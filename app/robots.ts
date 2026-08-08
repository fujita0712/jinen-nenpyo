import type { MetadataRoute } from "next";

// TODO: 本番ドメイン確定後、環境変数 NEXT_PUBLIC_SITE_URL を設定すること
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
