import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Ensure EdgeOne / edge caching headers can be passed
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-EdgeOne-Cache',
            value: 'SSR-Enabled',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
