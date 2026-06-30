/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Local assets live under /public — no remote patterns needed yet.
  },
};

export default nextConfig;
