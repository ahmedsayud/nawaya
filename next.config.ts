import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tan-bison-374038.hostingersite.com',
      },
      {
        protocol: 'https',
        hostname: 'tan-bison-374038.hostingersite1.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://tan-bison-374038.hostingersite.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
