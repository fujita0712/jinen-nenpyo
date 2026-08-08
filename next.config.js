/** @type {import('next').NextConfig} */
const nextConfig = {
  // LP は SSG 配信を基本方針とする(仕様 §9)
  // App Router では per-route の revalidate を各 page.tsx 側で指定する
};

module.exports = nextConfig;
