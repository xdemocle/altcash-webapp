import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: 'dist',
  cleanDistDir: true,
  reactStrictMode: true,
  staticPageGenerationTimeout: 300,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com',
      },
    ],
  },
};

if (process.env.NODE_ENV !== 'production') {
  const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');
  initOpenNextCloudflareForDev();
}

export default nextConfig;
