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
    const graphqlServer = process.env.NEXT_PUBLIC_GRAPHQL_SERVER;

    if (!graphqlServer) {
      return [];
    }

    const destinationBase = graphqlServer.endsWith('/graphql')
      ? graphqlServer
      : `${graphqlServer.replace(/\/$/, '')}/graphql`;

    return [
      {
        source: '/graphql',
        destination: destinationBase
      }
    ];
  }
};

if (process.env.NODE_ENV !== 'production') {
  const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');
  initOpenNextCloudflareForDev();
}

export default nextConfig;
