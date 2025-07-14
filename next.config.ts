/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Avoids Vercel build failure
  },
};

module.exports = nextConfig;
