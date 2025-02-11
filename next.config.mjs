/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["travel-journal-api-bootcamp.do.dibimbing.id"], // Tambahkan domain gambar
  },
};

export default nextConfig;
