/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for ESM support
  experimental: {
    esmExternals: true
  },
  // Configure allowed image domains
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
