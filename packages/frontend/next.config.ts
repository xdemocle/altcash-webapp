import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: 'dist',
  cleanDistDir: true,
  reactStrictMode: true,
  staticPageGenerationTimeout: 1000,
  webpack: (config, options) => {
    config.dir = 'packages/frontend';

    return config;
  },
  images: {
    domains: [
      's2.coinmarketcap.com',
      'bittrexblobstorage.blob.core.windows.net'
    ]
  },
  async rewrites() {
    return [
      {
        source: '/graphql',
        destination: process.env.NEXT_PUBLIC_GRAPHQL_SERVER + '/graphql'
      }
    ];
  }
};

if (process.env.NODE_ENV !== 'production') {
  const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');
  initOpenNextCloudflareForDev();
}

export default nextConfig;
