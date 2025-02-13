/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["travel-journal-api-bootcamp.do.dibimbing.id", "media.kompas.tv"],
    unoptimized: true,
  },
  output: "export",
};

export default nextConfig;
