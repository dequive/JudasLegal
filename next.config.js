/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Disable unnecessary features
  poweredByHeader: false,
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
  },

  // Turbopack configuration (stable in Next.js 15)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Development configuration
  ...(process.env.NODE_ENV === 'development' && {
    // Configure fast refresh and hot reload
    onDemandEntries: {
      maxInactiveAge: 60 * 1000,
      pagesBufferLength: 5,
    },
  }),
  
  // Webpack configuration optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize for development
    if (dev) {
      config.watchOptions = {
        poll: false,
        aggregateTimeout: 200,
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
      };
      
      // Reduce chunk sizes in development
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    // Optimize bundle analysis
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './frontend/src',
      '@/components': './frontend/src/components',
      '@/hooks': './frontend/src/hooks',
      '@/lib': './frontend/src/lib',
      '@/contexts': './frontend/src/contexts',
      '@/store': './frontend/src/store',
    };

    return config;
  },
  
  // Headers configuration
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
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
  
  // API proxy configuration - different for development vs production
  async rewrites() {
    const isProduction = process.env.NODE_ENV === 'production';
    const authUrl = isProduction 
      ? process.env.NEXT_PUBLIC_AUTH_URL || 'https://judas-auth.vercel.app'
      : 'http://0.0.0.0:3001';
    const apiUrl = isProduction
      ? process.env.NEXT_PUBLIC_API_URL || 'https://judas-backend.vercel.app'
      : 'http://0.0.0.0:80';

    return [
      {
        source: '/api/auth/:path*',
        destination: `${authUrl}/api/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80',
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3001',
  },
  
  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    compress: true,
    generateEtags: false,
    httpAgentOptions: {
      keepAlive: true,
    },
  }),
};

module.exports = nextConfig;
