/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Production optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Static export for better Vercel compatibility
  output: 'standalone',
  
  // Image optimization disabled for static export
  images: {
    unoptimized: true
  },
  
  // Headers configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;