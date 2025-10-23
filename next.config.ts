import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: 'dist',
  cleanDistDir: true,
  reactStrictMode: true,
  staticPageGenerationTimeout: 300,
  webpack: (config, { isServer, nextRuntime }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        fs: false,
        path: false,
        os: false,
      };
    }
    if (nextRuntime === 'edge') {
      config.externals = [...(config.externals || []), 'undici'];
      // Exclude binance.node from edge bundle - it uses Node.js crypto
      config.resolve.alias = {
        ...config.resolve.alias,
        './binance.node': false,
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
