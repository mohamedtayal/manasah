/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable RTL support
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
  },
  // API proxy to backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
