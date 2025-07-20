/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Remove custom headers to avoid auth issues
  async headers() {
    return [];
  },
};

module.exports = nextConfig;